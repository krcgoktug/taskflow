import { GanttChart } from "@/components/gantt-chart";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Gantt",
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Gantt zaman planı"
        description="Görevlerin tarihlerini, ilerleme durumlarını ve bağımlılıklarını görüntüleyin."
      />

      <GanttChart />
    </div>
  );
}
