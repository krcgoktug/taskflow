-- TaskFlow ilk veritabanı taslağı.
-- Bu dosya henüz canlı Supabase projesine uygulanmadı.

create type public.project_role as enum ('owner', 'manager', 'member');
create type public.task_status as enum ('todo', 'in_progress', 'review', 'done');
create type public.task_priority as enum ('low', 'medium', 'high');
create type public.dependency_type as enum ('finish_to_start', 'start_to_start');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 100),
  description text not null default '',
  owner_id uuid not null references public.profiles(id),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.project_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text not null,
  title text not null check (char_length(title) between 3 and 120),
  description text not null default '',
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id),
  parent_task_id uuid references public.tasks(id) on delete set null,
  start_date date,
  due_date date,
  progress smallint not null default 0 check (progress between 0 and 100),
  is_milestone boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, code),
  check (due_date is null or start_date is null or due_date >= start_date)
);

create table public.task_dependencies (
  id uuid primary key default gen_random_uuid(),
  predecessor_task_id uuid not null references public.tasks(id) on delete cascade,
  successor_task_id uuid not null references public.tasks(id) on delete cascade,
  dependency_type public.dependency_type not null default 'finish_to_start',
  lag_days integer not null default 0 check (lag_days >= 0),
  created_at timestamptz not null default now(),
  unique (predecessor_task_id, successor_task_id),
  check (predecessor_task_id <> successor_task_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_assignee_id_idx on public.tasks(assignee_id);
create index tasks_status_idx on public.tasks(status);
create index comments_task_id_idx on public.comments(task_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_project_member(target_project_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select
    exists (
      select 1
      from public.project_members
      where project_id = target_project_id
        and user_id = auth.uid()
    )
    or exists (
      select 1
      from public.projects
      where id = target_project_id
        and owner_id = auth.uid()
    );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.comments enable row level security;

create policy "Authenticated users can view profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Members can view their projects"
on public.projects for select
to authenticated
using (owner_id = auth.uid() or public.is_project_member(id));

create policy "Users can create projects"
on public.projects for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Owners can update projects"
on public.projects for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Members can view project memberships"
on public.project_members for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_project_member(project_id)
  or exists (
    select 1 from public.projects
    where projects.id = project_members.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project owners can manage memberships"
on public.project_members for all
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = project_members.project_id
      and projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects
    where projects.id = project_members.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Members can view tasks"
on public.tasks for select
to authenticated
using (public.is_project_member(project_id));

create policy "Members can create tasks"
on public.tasks for insert
to authenticated
with check (
  public.is_project_member(project_id)
  and created_by = auth.uid()
);

create policy "Members can update tasks"
on public.tasks for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

create policy "Members can view task dependencies"
on public.task_dependencies for select
to authenticated
using (
  exists (
    select 1 from public.tasks
    where tasks.id = task_dependencies.predecessor_task_id
      and public.is_project_member(tasks.project_id)
  )
);

create policy "Members can manage task dependencies"
on public.task_dependencies for all
to authenticated
using (
  exists (
    select 1 from public.tasks
    where tasks.id = task_dependencies.predecessor_task_id
      and public.is_project_member(tasks.project_id)
  )
)
with check (
  exists (
    select 1 from public.tasks
    where tasks.id = task_dependencies.predecessor_task_id
      and public.is_project_member(tasks.project_id)
  )
);

create policy "Members can view comments"
on public.comments for select
to authenticated
using (
  exists (
    select 1 from public.tasks
    where tasks.id = comments.task_id
      and public.is_project_member(tasks.project_id)
  )
);

create policy "Members can add comments"
on public.comments for insert
to authenticated
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.tasks
    where tasks.id = comments.task_id
      and public.is_project_member(tasks.project_id)
  )
);
