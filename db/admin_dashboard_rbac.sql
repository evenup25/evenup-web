-- Admin dashboard RBAC and read policies
-- Run this script in Supabase SQL editor as a privileged role.

create table if not exists public.admin_user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('viewer', 'admin', 'owner')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_user_roles_role_idx on public.admin_user_roles (role);

create or replace function public.admin_user_roles_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_admin_user_roles_touch_updated_at on public.admin_user_roles;
create trigger trg_admin_user_roles_touch_updated_at
before update on public.admin_user_roles
for each row
execute function public.admin_user_roles_touch_updated_at();

create or replace function public.is_admin_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_user_roles aur
    where aur.user_id = p_user_id
  );
$$;

create or replace function public.can_manage_admin_roles(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_user_roles aur
    where aur.user_id = p_user_id
      and aur.role in ('admin', 'owner')
  );
$$;

grant execute on function public.is_admin_user(uuid) to authenticated;
grant execute on function public.can_manage_admin_roles(uuid) to authenticated;

alter table public.admin_user_roles enable row level security;

drop policy if exists "admin_user_roles_select_self_or_admin" on public.admin_user_roles;
create policy "admin_user_roles_select_self_or_admin"
on public.admin_user_roles
for select
to authenticated
using (
  auth.uid() = user_id
  or public.is_admin_user(auth.uid())
);

drop policy if exists "admin_user_roles_insert_manage" on public.admin_user_roles;
create policy "admin_user_roles_insert_manage"
on public.admin_user_roles
for insert
to authenticated
with check (public.can_manage_admin_roles(auth.uid()));

drop policy if exists "admin_user_roles_update_manage" on public.admin_user_roles;
create policy "admin_user_roles_update_manage"
on public.admin_user_roles
for update
to authenticated
using (public.can_manage_admin_roles(auth.uid()))
with check (public.can_manage_admin_roles(auth.uid()));

drop policy if exists "admin_user_roles_delete_manage" on public.admin_user_roles;
create policy "admin_user_roles_delete_manage"
on public.admin_user_roles
for delete
to authenticated
using (public.can_manage_admin_roles(auth.uid()));

revoke all on table public.admin_user_roles from public;
grant select, insert, update, delete on table public.admin_user_roles to authenticated;
grant select on table public.admin_user_roles to service_role;

alter table public.app_error_logs enable row level security;

drop policy if exists "app_error_logs_select_admin" on public.app_error_logs;
create policy "app_error_logs_select_admin"
on public.app_error_logs
for select
to authenticated
using (public.is_admin_user(auth.uid()));

grant select on table public.app_error_logs to authenticated;

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles_select_admin" on public.user_profiles;
create policy "user_profiles_select_admin"
on public.user_profiles
for select
to authenticated
using (public.is_admin_user(auth.uid()));

grant select on table public.user_profiles to authenticated;

create index if not exists idx_user_profiles_last_active_at
on public.user_profiles (last_active_at desc)
where deleted_at is null;

-- Bootstrap at least one owner (replace with real user id):
-- insert into public.admin_user_roles (user_id, role)
-- values ('00000000-0000-0000-0000-000000000000', 'owner')
-- on conflict (user_id) do update set role = excluded.role;
