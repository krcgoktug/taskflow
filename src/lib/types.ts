export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type Assignee = {
  id: string;
  name: string;
  initials: string;
};

export type Task = {
  id: string;
  code: string;
  title: string;
  description: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Assignee | null;
  startDate: string;
  dueDate: string;
  progress: number;
  tags: string[];
  dependencyIds: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  memberCount: number;
};
