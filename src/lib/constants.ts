import type { TaskPriority, TaskStatus } from "@/lib/types";

export const statusLabels: Record<TaskStatus, string> = {
  todo: "Planlandı",
  in_progress: "Devam ediyor",
  review: "Kontrol",
  done: "Tamamlandı",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

export const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-blue-50 text-blue-700 ring-blue-200",
  review: "bg-amber-50 text-amber-700 ring-amber-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-orange-50 text-orange-700",
  high: "bg-red-50 text-red-700",
};
