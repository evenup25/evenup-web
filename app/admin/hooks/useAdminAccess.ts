"use client";

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { isAdminRole, type AdminRole } from "@/lib/adminRoles";
import { supabase } from "@/lib/supabaseClient";

interface AdminAccessState {
  loading: boolean;
  error: string | null;
  session: Session | null;
  role: AdminRole | null;
}

export function useAdminAccess() {
  const [state, setState] = useState<AdminAccessState>({
    loading: true,
    error: null,
    session: null,
    role: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setState({
        loading: false,
        error: sessionError.message,
        session: null,
        role: null,
      });
      return;
    }

    const session = sessionData.session;
    if (!session?.user?.id) {
      setState({
        loading: false,
        error: null,
        session: null,
        role: null,
      });
      return;
    }

    const { data: roleData, error: roleError } = await supabase
      .from("admin_user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle<{ role: string | null }>();

    if (roleError) {
      setState({
        loading: false,
        error: roleError.message,
        session,
        role: null,
      });
      return;
    }

    const role = isAdminRole(roleData?.role) ? roleData.role : null;
    setState({
      loading: false,
      error: null,
      session,
      role,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await refresh();
      if (!mounted) {
        return;
      }
    };

    load();

    const { data } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [refresh]);

  return { ...state, refresh };
}
