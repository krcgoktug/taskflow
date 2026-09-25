import { GanttChart } from "@/components/gantt-chart";
import { PageHeader } from "@/components/page-header";
import { getWorkspace } from "@/lib/workspace";
import { CreateProjectForm } from "@/components/create-project-form";

export const metadata = {
  title: "Gantt",
};

export default async function TimelinePage() {
  const { tasks, project } = await getWorkspace();
  if (!project) return <CreateProjectForm />;
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Gantt zaman planı"
        description="Görevlerin tarihlerini, ilerleme durumlarını ve bağımlılıklarını görüntüleyin."
      />

      <GanttChart tasks={tasks} />
    </div>
  );
}
