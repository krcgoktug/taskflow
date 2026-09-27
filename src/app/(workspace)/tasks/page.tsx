import { PageHeader } from "@/components/page-header";
import { TaskTable } from "@/components/task-table";
import { getWorkspace } from "@/lib/workspace";
import { CreateProjectForm } from "@/components/create-project-form";

export const metadata = {
  title: "Görevler",
};

export default async function TasksPage() {
  const { tasks, project, assignees, connected } = await getWorkspace();
  if (!project) return <CreateProjectForm />;
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Görevler"
        description="Görevleri arayın ve durumlarına göre filtreleyin."
      />
      <TaskTable
        initialTasks={tasks}
        projectId={project.id}
        assignees={assignees}
        connected={connected}
      />
    </div>
  );
}
