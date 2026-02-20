"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminRole } from "@/lib/adminRoles";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../components/AdminGuard";

interface RoleAssignment {
  user_id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

interface UserProfileSummary {
  id: string;
  email: string | null;
  nickname: string | null;
  status: string | null;
  deleted_at: string | null;
  last_active_at: string | null;
}

const roleValues: AdminRole[] = ["viewer", "admin", "owner"];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleAssignment[]>([]);
  const [profilesById, setProfilesById] = useState<Record<string, UserProfileSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [assignUserId, setAssignUserId] = useState("");
  const [assignRole, setAssignRole] = useState<AdminRole>("viewer");
  const [assignSaving, setAssignSaving] = useState(false);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState<string | null>(null);
  const [revokingUserId, setRevokingUserId] = useState<string | null>(null);

  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfileSummary[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleDrafts, setRoleDrafts] = useState<Record<string, AdminRole>>({});

  const loadRoleAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: roleRows, error: roleError } = await supabase
      .from("admin_user_roles")
      .select("user_id,role,created_at,updated_at")
      .order("updated_at", { ascending: false });

    if (roleError) {
      setError(roleError.message);
      setLoading(false);
      return;
    }

    const typedRoles = ((roleRows ?? []) as RoleAssignment[]).filter((row) =>
      roleValues.includes(row.role),
    );
    setRoles(typedRoles);
    setRoleDrafts(
      typedRoles.reduce<Record<string, AdminRole>>((acc, row) => {
        acc[row.user_id] = row.role;
        return acc;
      }, {}),
    );

    const userIds = typedRoles.map((row) => row.user_id);
    if (userIds.length === 0) {
      setProfilesById({});
      setLoading(false);
      return;
    }

    const { data: profiles, error: profileError } = await supabase
      .from("user_profiles")
      .select("id,email,nickname,status,deleted_at,last_active_at")
      .in("id", userIds);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const profileMap = (profiles ?? []).reduce<Record<string, UserProfileSummary>>((acc, profile) => {
      const typedProfile = profile as UserProfileSummary;
      acc[typedProfile.id] = typedProfile;
      return acc;
    }, {});

    setProfilesById(profileMap);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRoleAssignments();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadRoleAssignments]);

  useEffect(() => {
    const term = userSearch.trim();
    if (term.length < 2) {
      return;
    }

    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      setSearchingUsers(true);

      const escaped = term.replaceAll(",", " ").replaceAll("%", "");
      const { data, error: searchError } = await supabase
        .from("user_profiles")
        .select("id,email,nickname,status,deleted_at,last_active_at")
        .or(`email.ilike.%${escaped}%,nickname.ilike.%${escaped}%`)
        .limit(8);

      if (cancelled) return;

      if (searchError) {
        setError(searchError.message);
        setSearchResults([]);
        setSearchingUsers(false);
        return;
      }

      setSearchResults((data ?? []) as UserProfileSummary[]);
      setSearchingUsers(false);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [userSearch]);

  const assignedCount = useMemo(() => roles.length, [roles.length]);
  const assignedUserIds = useMemo(() => new Set(roles.map((role) => role.user_id)), [roles]);
  const visibleSearchResults = useMemo(
    () => searchResults.filter((user) => !assignedUserIds.has(user.id)),
    [assignedUserIds, searchResults],
  );

  const upsertRole = async () => {
    const trimmedUserId = assignUserId.trim();
    if (!trimmedUserId) {
      setError("User ID is required.");
      return;
    }

    setAssignSaving(true);
    setError(null);
    setMessage(null);

    const { error: upsertError } = await supabase
      .from("admin_user_roles")
      .upsert({ user_id: trimmedUserId, role: assignRole }, { onConflict: "user_id" });

    if (upsertError) {
      setError(upsertError.message);
      setAssignSaving(false);
      return;
    }

    setMessage("Role saved successfully.");
    setAssignUserId("");
    setUserSearch("");
    setSearchResults([]);
    setSearchOpen(false);
    setAssignSaving(false);
    await loadRoleAssignments();
  };

  const changeAssignedRole = async (assignment: RoleAssignment) => {
    const nextRole = roleDrafts[assignment.user_id] ?? assignment.role;
    if (nextRole === assignment.role) {
      return;
    }

    setUpdatingRoleUserId(assignment.user_id);
    setError(null);
    setMessage(null);

    const { error: updateError } = await supabase
      .from("admin_user_roles")
      .update({ role: nextRole })
      .eq("user_id", assignment.user_id);

    if (updateError) {
      setError(updateError.message);
      setUpdatingRoleUserId(null);
      return;
    }

    setMessage(`Role updated to ${nextRole}.`);
    setUpdatingRoleUserId(null);
    await loadRoleAssignments();
  };

  const revokeRole = async (userId: string) => {
    const confirmed = window.confirm("Are you sure you want to revoke this user's admin access?");
    if (!confirmed) {
      return;
    }

    setRevokingUserId(userId);
    setError(null);
    setMessage(null);

    const { error: revokeError } = await supabase.from("admin_user_roles").delete().eq("user_id", userId);
    if (revokeError) {
      setError(revokeError.message);
      setRevokingUserId(null);
      return;
    }

    setMessage(`Role removed for ${userId}.`);
    setRevokingUserId(null);
    await loadRoleAssignments();
  };

  return (
    <AdminGuard
      pageTitle="Role Management"
      pageDescription="Assign who can access the admin portal."
      requiredRole="admin"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-base font-semibold text-slate-900">Assign role</h2>
          <p className="mt-1 text-sm text-slate-600">
            Search users by email or nickname, then assign one of the admin roles.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span>User search</span>
              <input
                type="text"
                value={userSearch}
                onChange={(event) => {
                  const value = event.target.value;
                  setUserSearch(value);
                  setSearchOpen(value.trim().length >= 2);
                  if (value.trim().length < 2) {
                    setSearchingUsers(false);
                    setSearchResults([]);
                  }
                }}
                onFocus={() => setSearchOpen(userSearch.trim().length >= 2)}
                placeholder="name or email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Role</span>
              <select
                value={assignRole}
                onChange={(event) => setAssignRole(event.target.value as AdminRole)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {roleValues.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {searchOpen && userSearch.trim().length >= 2 ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2">
              {searchingUsers ? (
                <p className="px-2 py-1 text-xs text-slate-500">Searching users...</p>
              ) : visibleSearchResults.length === 0 ? (
                <p className="px-2 py-1 text-xs text-slate-500">No users found.</p>
              ) : (
                <ul className="space-y-1">
                  {visibleSearchResults.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100"
                        onClick={() => {
                          setAssignUserId(user.id);
                          setUserSearch(user.email ?? user.nickname ?? user.id);
                          setSearchingUsers(false);
                          setSearchResults([]);
                          setSearchOpen(false);
                        }}
                      >
                        <p className="font-medium text-slate-800">{user.email ?? user.nickname ?? "-"}</p>
                        <p className="text-xs text-slate-500">{user.id}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <label className="mt-3 block space-y-1 text-sm text-slate-700">
            <span>User ID (UUID)</span>
            <input
              type="text"
              value={assignUserId}
              onChange={(event) => setAssignUserId(event.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => void upsertRole()}
              disabled={assignSaving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {assignSaving ? "Saving..." : "Save role"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <div className="rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Assigned roles</h3>
            <span className="text-xs text-slate-500">{assignedCount} assignments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Last active</th>
                  <th className="px-3 py-2">Updated</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={6}>
                      Loading roles...
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={6}>
                      No admin roles assigned yet.
                    </td>
                  </tr>
                ) : (
                  roles.map((assignment) => {
                    const profile = profilesById[assignment.user_id];
                    return (
                      <tr key={assignment.user_id} className="border-t border-slate-200">
                        <td className="px-3 py-2">
                          <p className="font-medium text-slate-800">
                            {profile?.email ?? profile?.nickname ?? "-"}
                          </p>
                          <p className="text-xs text-slate-500">{assignment.user_id}</p>
                        </td>
                        <td className="px-3 py-2">
                          <RoleBadge role={assignment.role} />
                        </td>
                        <td className="px-3 py-2 text-slate-700">{profile?.status ?? "-"}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {profile?.last_active_at
                            ? new Date(profile.last_active_at).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {new Date(assignment.updated_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={roleDrafts[assignment.user_id] ?? assignment.role}
                              onChange={(event) => {
                                const nextRole = event.target.value as AdminRole;
                                setRoleDrafts((prev) => ({
                                  ...prev,
                                  [assignment.user_id]: nextRole,
                                }));
                              }}
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                            >
                              {roleValues.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={
                                updatingRoleUserId === assignment.user_id ||
                                (roleDrafts[assignment.user_id] ?? assignment.role) === assignment.role
                              }
                              onClick={() => void changeAssignedRole(assignment)}
                            >
                              {updatingRoleUserId === assignment.user_id ? "Updating..." : "Update"}
                            </button>
                            <button
                              type="button"
                              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={revokingUserId === assignment.user_id}
                              onClick={() => void revokeRole(assignment.user_id)}
                            >
                              {revokingUserId === assignment.user_id ? "Revoking..." : "Revoke"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

function RoleBadge({ role }: { role: AdminRole }) {
  if (role === "owner") {
    return (
      <span className="rounded-md bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
        owner
      </span>
    );
  }
  if (role === "admin") {
    return (
      <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
        admin
      </span>
    );
  }
  return (
    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
      viewer
    </span>
  );
}
