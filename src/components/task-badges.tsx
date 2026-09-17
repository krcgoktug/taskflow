import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
} from "@/lib/constants";
import type { TaskPriority, TaskStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-slate-700">
      <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[status]}`} />
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide ${priorityStyles[priority]}`}
    >
      <span className="h-px w-2 bg-current" />
      {priorityLabels[priority]}
    </span>
  );
}
