create extension if not exists pgcrypto;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete cascade,
  name text not null,
  relation text,
  age int,
  blood_group text,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.family_members(id) on delete cascade,
  name text not null,
  dosage text,
  timing text not null,
  frequency text,
  food_instruction text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.medicine_logs (
  id uuid primary key default gen_random_uuid(),
  medicine_id uuid references public.medicines(id) on delete cascade,
  member_id uuid references public.family_members(id) on delete cascade,
  status text check (status in ('taken', 'skipped')) not null,
  log_time timestamp with time zone default now(),
  notes text
);

create table if not exists public.vitals (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.family_members(id) on delete cascade,
  type text check (type in ('bp', 'sugar', 'temperature', 'weight', 'pulse')) not null,
  value_1 text not null,
  value_2 text,
  context text,
  recorded_at timestamp with time zone default now(),
  notes text
);

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.medicines enable row level security;
alter table public.medicine_logs enable row level security;
alter table public.vitals enable row level security;

-- V0.1 policies: a signed-in user owns exactly the family rows they create.
create policy "Users can create their own families"
on public.families for insert
with check (created_by = auth.uid());

create policy "Users can read their own families"
on public.families for select
using (created_by = auth.uid());

create policy "Users can update their own families"
on public.families for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "Users can delete their own families"
on public.families for delete
using (created_by = auth.uid());

-- Family member access is allowed only through a family created by the user.
create policy "Users can access members in their families"
on public.family_members for all
using (
  exists (
    select 1 from public.families
    where families.id = family_members.family_id
    and families.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.families
    where families.id = family_members.family_id
    and families.created_by = auth.uid()
  )
);

-- Medicine access is allowed only when the medicine belongs to a member in the user's family.
create policy "Users can access medicines in their families"
on public.medicines for all
using (
  exists (
    select 1
    from public.family_members
    join public.families on families.id = family_members.family_id
    where family_members.id = medicines.member_id
    and families.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.family_members
    join public.families on families.id = family_members.family_id
    where family_members.id = medicines.member_id
    and families.created_by = auth.uid()
  )
);

-- Medicine log access follows the member connected to each log row.
create policy "Users can access medicine logs in their families"
on public.medicine_logs for all
using (
  exists (
    select 1
    from public.family_members
    join public.families on families.id = family_members.family_id
    where family_members.id = medicine_logs.member_id
    and families.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.family_members
    join public.families on families.id = family_members.family_id
    where family_members.id = medicine_logs.member_id
    and families.created_by = auth.uid()
  )
);

-- Vital access follows the member connected to each reading.
create policy "Users can access vitals in their families"
on public.vitals for all
using (
  exists (
    select 1
    from public.family_members
    join public.families on families.id = family_members.family_id
    where family_members.id = vitals.member_id
    and families.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.family_members
    join public.families on families.id = family_members.family_id
    where family_members.id = vitals.member_id
    and families.created_by = auth.uid()
  )
);
