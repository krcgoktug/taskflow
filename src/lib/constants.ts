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
  todo: "text-slate-500",
  in_progress: "text-blue-700",
  review: "text-amber-700",
  done: "text-emerald-700",
};

export const priorityStyles: Record<TaskPriority, string> = {
  low: "text-slate-500",
  medium: "text-amber-700",
  high: "text-red-700",
};
