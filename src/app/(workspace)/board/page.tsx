import { KanbanBoard } from "@/components/kanban-board";
import { PageHeader } from "@/components/page-header";
import { getWorkspace } from "@/lib/workspace";
import { CreateProjectForm } from "@/components/create-project-form";

export const metadata = {
  title: "Kanban",
};

export default async function BoardPage() {
  const { tasks, project, connected } = await getWorkspace();
  if (!project) return <CreateProjectForm />;
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Kanban panosu"
        description="Görevleri durumlarına göre görüntüleyin ve yönetin."
      />
      <KanbanBoard
        key={JSON.stringify(tasks)}
        initialTasks={tasks}
        connected={connected}
      />
    </div>
  );
}
