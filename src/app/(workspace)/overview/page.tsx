import { PageHeader } from "@/components/page-header";
import { PriorityBadge, StatusBadge } from "@/components/task-badges";
import { getWorkspace } from "@/lib/workspace";
import { CreateProjectForm } from "@/components/create-project-form";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ListTodo,
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata = {
  title: "Overview",
};

function StatCard({
  label,
  value,
  note,
  icon,
  color,
}: {
  label: string;
  value: number;
  note: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`rounded-xl p-2.5 ${color}`}>{icon}</span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{note}</p>
    </article>
  );
}

export default async function OverviewPage() {
  const { tasks, project } = await getWorkspace();
  if (!project) return <CreateProjectForm />;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
  const completed = tasks.filter((task) => task.status === "done").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in_progress" || task.status === "review",
  ).length;
  const overdue = tasks.filter(
    (task) => task.status !== "done" && task.dueDate && task.dueDate < today,
  ).length;
  const currentTasks = tasks
    .filter((task) => task.status !== "done")
    .sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Overview"
        description="Projenin genel durumu ve yaklaşan görevler."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam görev"
          value={tasks.length}
          note="Projedeki tüm işler"
          icon={<ListTodo className="h-5 w-5" />}
          color="bg-slate-100 text-slate-700"
        />
        <StatCard
          label="Devam eden"
          value={inProgress}
          note="Geliştirme veya kontrol aşamasında"
          icon={<CircleDashed className="h-5 w-5" />}
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          label="Tamamlanan"
          value={completed}
          note="Tamamlandı olarak işaretlenen işler"
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          label="Geciken"
          value={overdue}
          note="Bitiş tarihi geçmiş açık görevler"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="bg-red-50 text-red-700"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Aktif görevler</h2>
            <p className="mt-1 text-sm text-slate-500">
              Yakın tarihte ilgilenilmesi gereken işler
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {!currentTasks.length && (
              <p className="p-5 text-sm text-slate-500">
                Açık görev bulunmuyor.
              </p>
            )}
            {currentTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-blue-600">
                    {task.code}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-slate-900">
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

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Aktif proje
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">
                {project.name}
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {project.progress}%
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {project.description}
          </p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
            <div>
              <dt className="text-slate-500">Hedef tarih</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {project.dueDate || "Belirlenmedi"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Ekip</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {project.memberCount} kişi
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
