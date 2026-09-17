import { PageHeader } from "@/components/page-header";
import { PriorityBadge, StatusBadge } from "@/components/task-badges";
import { projects, tasks } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, CircleDashed, ListTodo } from "lucide-react";
import type { ReactNode } from "react";

export const metadata = {
  title: "Genel bakış",
};

function StatCard({
  label,
  value,
  note,
  icon,
  warning = false,
}: {
  label: string;
  value: number;
  note: string;
  icon: ReactNode;
  warning?: boolean;
}) {
  return (
    <article className="border border-[#d9d9d3] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#68717d]">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-[#202833]">{value}</p>
        </div>
        <span className={warning ? "text-[#a85136]" : "text-[#245c54]"}>{icon}</span>
      </div>
      <p className="mt-4 border-t border-[#ecece7] pt-3 text-xs text-[#68717d]">{note}</p>
    </article>
  );
}

export default function OverviewPage() {
  const today = new Date().toISOString().slice(0, 10);
  const completed = tasks.filter((task) => task.status === "done").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in_progress" || task.status === "review",
  ).length;
  const overdue = tasks.filter(
    (task) => task.status !== "done" && task.dueDate < today,
  ).length;
  const project = projects[0];
  const currentTasks = tasks.filter((task) => task.status !== "done").slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Genel bakış"
        description="Projenin genel durumu ve yaklaşan görevler."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam görev"
          value={tasks.length}
          note="Proje kapsamındaki tüm işler"
          icon={<ListTodo className="h-5 w-5" />}
        />
        <StatCard
          label="Devam eden"
          value={inProgress}
          note="Geliştirme veya kontrol aşamasında"
          icon={<CircleDashed className="h-5 w-5" />}
        />
        <StatCard
          label="Tamamlanan"
          value={completed}
          note="Tamamlanarak kapatılan işler"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Geciken"
          value={overdue}
          note="Bitiş tarihi geçmiş açık görevler"
          icon={<AlertTriangle className="h-5 w-5" />}
          warning
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="overflow-hidden border border-[#d9d9d3] bg-white">
          <div className="border-b border-[#d9d9d3] px-5 py-4">
            <h2 className="font-semibold text-[#202833]">Aktif görevler</h2>
            <p className="mt-1 text-sm text-[#68717d]">
              Yakın tarihte ilgilenilmesi gereken işler
            </p>
          </div>

          <div className="divide-y divide-[#ecece7]">
            {currentTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#245c54]">{task.code}</p>
                  <p className="mt-1 truncate text-sm font-medium text-[#202833]">
                    {task.title}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-[#d9d9d3] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#245c54]">
                Aktif proje
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[#202833]">
                {project.name}
              </h2>
            </div>
            <span className="border-b-2 border-[#245c54] px-1 py-1 text-sm font-semibold text-[#245c54]">
              {project.progress}%
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#68717d]">
            {project.description}
          </p>

          <div className="mt-5 h-1.5 overflow-hidden bg-[#e7e7e1]">
            <div
              className="h-full bg-[#245c54]"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#ecece7] pt-5 text-sm">
            <div>
              <dt className="text-[#68717d]">Hedef tarih</dt>
              <dd className="mt-1 font-semibold text-[#202833]">28 Eylül</dd>
            </div>
            <div>
              <dt className="text-[#68717d]">Ekip</dt>
              <dd className="mt-1 font-semibold text-[#202833]">
                {project.memberCount} kişi
              </dd>
            </div>
          </dl>

        </article>
      </section>
    </div>
  );
}
