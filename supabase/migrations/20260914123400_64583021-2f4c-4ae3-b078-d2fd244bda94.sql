-- Roles
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read their own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create policy "Admins can read all roles"
on public.user_roles for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Recipe publishing status
alter table public.recipes
  add column if not exists status text not null default 'published';

alter table public.recipes
  add constraint recipes_status_check check (status in ('draft', 'published'));

create index if not exists recipes_status_idx on public.recipes (status);

-- Admin management policies on recipes
create policy "Admins can view all recipes"
on public.recipes for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert recipes"
on public.recipes for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update recipes"
on public.recipes for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete recipes"
on public.recipes for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));