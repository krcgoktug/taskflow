import { KanbanBoard } from "@/components/kanban-board";
import { PageHeader } from "@/components/page-header";
import { tasks } from "@/lib/mock-data";

export const metadata = {
  title: "Kanban",
};

export default function BoardPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Kanban panosu"
        description="Görevleri durumlarına göre görüntüleyin ve yönetin."
      />
      <KanbanBoard initialTasks={tasks} />
    </div>
  );
}
