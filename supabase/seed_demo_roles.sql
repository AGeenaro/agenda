-- After creating Auth users in the dashboard, map demo emails to roles.
-- Replace the emails if you used different ones.

update public.profiles
set
  full_name = 'Admin',
  role = 'admin'
where id = (
  select id from auth.users where email = 'admin@example.com'
);

update public.profiles
set
  full_name = 'Recepção',
  role = 'receptionist'
where id = (
  select id from auth.users where email = 'recepcao@example.com'
);

update public.profiles
set
  full_name = 'Atendente',
  role = 'staff'
where id = (
  select id from auth.users where email = 'atendente@example.com'
);
