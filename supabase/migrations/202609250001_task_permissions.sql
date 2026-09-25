create policy "Owners can delete tasks"
on public.tasks for delete to authenticated
using (exists (
  select 1 from public.projects
  where projects.id = tasks.project_id and projects.owner_id = auth.uid()
));

create or replace function public.validate_task_assignment()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    if new.project_id is distinct from old.project_id
       or new.created_by is distinct from old.created_by then
      raise exception 'Task project and creator cannot be changed';
    end if;
  end if;
  if new.assignee_id is not null and not exists (
    select 1 from public.projects where id = new.project_id and owner_id = new.assignee_id
  ) and not exists (
    select 1 from public.project_members where project_id = new.project_id and user_id = new.assignee_id
  ) then
    raise exception 'Assignee must belong to the project';
  end if;
  return new;
end;
$$;

create trigger tasks_validate_assignment
before insert or update on public.tasks
for each row execute function public.validate_task_assignment();

insert into public.profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', '') from auth.users
on conflict (id) do nothing;
