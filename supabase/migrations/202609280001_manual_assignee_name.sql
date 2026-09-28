alter table public.tasks
add column assignee_name text;

alter table public.tasks
add constraint tasks_assignee_name_length
check (
  assignee_name is null
  or char_length(btrim(assignee_name)) between 2 and 80
);
