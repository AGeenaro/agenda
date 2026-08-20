-- Row Level Security: any logged-in user can read the team agenda
-- and edit appointments, clients, and locks.

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.calendar_locks enable row level security;

create policy profiles_select
  on public.profiles for select to authenticated using (true);

create policy profiles_update_admin
  on public.profiles for update to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy clients_select
  on public.clients for select to authenticated using (true);
create policy clients_insert
  on public.clients for insert to authenticated with check (true);
create policy clients_update
  on public.clients for update to authenticated using (true);
create policy clients_delete
  on public.clients for delete to authenticated using (true);

create policy appointments_select
  on public.appointments for select to authenticated using (true);
create policy appointments_insert
  on public.appointments for insert to authenticated with check (true);
create policy appointments_update
  on public.appointments for update to authenticated using (true);
create policy appointments_delete
  on public.appointments for delete to authenticated using (true);

create policy locks_select
  on public.calendar_locks for select to authenticated using (true);
create policy locks_insert
  on public.calendar_locks for insert to authenticated with check (true);
create policy locks_update
  on public.calendar_locks for update to authenticated using (true);
create policy locks_delete
  on public.calendar_locks for delete to authenticated using (true);
