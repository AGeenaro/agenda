-- Agenda schema: profiles, clients, appointments, calendar locks.
-- Timezone for calendar dates: America/Sao_Paulo.

create type public.user_role as enum ('admin', 'receptionist', 'staff');
create type public.lock_type as enum ('full_day', 'time_slot');
create type public.appointment_status as enum ('scheduled', 'done', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.profiles (id),
  client_id uuid references public.clients (id),
  walk_in_name text,
  walk_in_phone text,
  description text,
  contact_phone text,
  entry_date date not null default (timezone('America/Sao_Paulo', now()))::date,
  starts_at timestamptz not null,
  duration_minutes integer not null,
  status public.appointment_status not null default 'scheduled',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  constraint appointments_duration_grid check (
    duration_minutes >= 15 and duration_minutes % 15 = 0
  ),
  constraint appointments_client_or_walk_in check (
    client_id is not null or walk_in_name is not null
  )
);

create table public.calendar_locks (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.profiles (id),
  lock_type public.lock_type not null,
  lock_date date,
  starts_at timestamptz,
  ends_at timestamptz,
  note text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  constraint calendar_locks_shape check (
    (lock_type = 'full_day' and lock_date is not null)
    or (
      lock_type = 'time_slot'
      and starts_at is not null
      and ends_at is not null
    )
  )
);

create index appointments_staff_starts_idx
  on public.appointments (staff_id, starts_at);

create index calendar_locks_staff_date_idx
  on public.calendar_locks (staff_id, lock_date);
