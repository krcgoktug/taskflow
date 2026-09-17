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
  todo: "bg-slate-400",
  in_progress: "bg-[#3f718c]",
  review: "bg-[#ad7a24]",
  done: "bg-[#39705b]",
};

export const priorityStyles: Record<TaskPriority, string> = {
  low: "text-slate-500",
  medium: "text-[#8a5a24]",
  high: "text-[#a44332]",
};
