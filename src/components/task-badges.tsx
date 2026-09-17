import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
} from "@/lib/constants";
import type { TaskPriority, TaskStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`text-xs font-medium ${priorityStyles[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  );
}
