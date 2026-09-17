import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
} from "@/lib/constants";
import type { TaskPriority, TaskStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  );
}
