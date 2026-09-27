import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  Assignee,
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

type TaskRow = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  start_date: string | null;
  due_date: string | null;
  progress: number;
};

export const getWorkspace = cache(
  async (): Promise<{
    project: Project | null;
    tasks: Task[];
    assignees: Assignee[];
    connected: boolean;
  }> => {
    if (!isSupabaseConfigured()) {
      const demo = await import("@/lib/mock-data");
      return {
        project: demo.projects[0],
        tasks: demo.tasks,
        assignees: demo.assignees,
        connected: false,
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) redirect("/login");

    const { data: project, error } = await supabase
      .from("projects")
      .select("id, name, description, owner_id, due_date")
      .order("created_at")
      .order("id")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error("Çalışma alanı yüklenemedi.");
    if (!project)
      return { project: null, tasks: [], assignees: [], connected: true };

    const [taskResult, memberResult, dependencyResult] = await Promise.all([
      supabase
        .from("tasks")
        .select(
          "id, code, title, description, status, priority, assignee_id, start_date, due_date, progress",
        )
        .eq("project_id", project.id)
        .order("created_at", { ascending: false })
        .returns<TaskRow[]>(),
      supabase
        .from("project_members")
        .select("user_id")
        .eq("project_id", project.id),
      supabase
        .from("task_dependencies")
        .select("predecessor_task_id, successor_task_id"),
    ]);
    if (taskResult.error || memberResult.error || dependencyResult.error)
      throw new Error("Görevler yüklenemedi.");
    const memberIds = [
      ...new Set([
        project.owner_id,
        ...(memberResult.data ?? []).map((member) => member.user_id),
      ]),
    ];
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", memberIds);
    if (profileError) throw new Error("Proje üyeleri yüklenemedi.");
    const assignees = (profiles ?? []).map((profile) => {
      const name =
        profile.full_name ||
        (profile.id === user.id ? user.email?.split("@")[0] : null) ||
        "Üye";
      return {
        id: profile.id,
        name,
        initials: name
          .split(/\s+/)
          .map((part: string) => part[0])
          .slice(0, 2)
          .join("")
          .toLocaleUpperCase("tr-TR"),
      };
    });
    const tasks = (taskResult.data ?? []).map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      description: row.description,
      project: project.name,
      status: row.status,
      priority: row.priority,
      assignee:
        assignees.find((person) => person.id === row.assignee_id) ?? null,
      startDate: row.start_date ?? "",
      dueDate: row.due_date ?? "",
      progress: row.progress,
      tags: [],
      dependencyIds: (dependencyResult.data ?? [])
        .filter((dependency) => dependency.successor_task_id === row.id)
        .map((dependency) => dependency.predecessor_task_id),
    }));
    return {
      connected: true,
      assignees,
      tasks,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        dueDate: project.due_date ?? "",
        memberCount: memberIds.length,
        progress: tasks.length
          ? Math.round(
              tasks.reduce((sum, task) => sum + task.progress, 0) /
                tasks.length,
            )
          : 0,
      },
    };
  },
);
