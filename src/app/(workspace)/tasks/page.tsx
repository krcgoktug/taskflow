import { PageHeader } from "@/components/page-header";
import { TaskTable } from "@/components/task-table";
import { tasks } from "@/lib/mock-data";

export const metadata = {
  title: "Görevler",
};

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Görevler"
        description="Görevleri arayın ve durumlarına göre filtreleyin."
      />
      <TaskTable initialTasks={tasks} />
    </div>
  );
}
