"use client";

import { PriorityBadge } from "@/components/task-badges";
import { statusLabels } from "@/lib/constants";
import type { Task, TaskStatus } from "@/lib/types";
import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical } from "lucide-react";
import { useState } from "react";

const columns: Array<{
  status: TaskStatus;
  dotColor: string;
}> = [
  { status: "todo", dotColor: "bg-slate-400" },
  {
    status: "in_progress",
    dotColor: "bg-[#3f718c]",
  },
  {
    status: "review",
    dotColor: "bg-[#ad7a24]",
  },
  {
    status: "done",
    dotColor: "bg-[#39705b]",
  },
];

function KanbanCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`border border-[#d5d5cf] bg-white p-4 transition ${
        isDragging ? "z-20 opacity-70 shadow-lg" : "hover:border-[#9ba19f]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#245c54]">{task.code}</p>
          <h3 className="mt-1 text-sm font-semibold leading-5 text-[#202833]">
            {task.title}
          </h3>
        </div>
        <button
          type="button"
          aria-label={`${task.title} görevini taşı`}
          className="cursor-grab p-1 text-slate-400 hover:bg-[#f0f0ec] hover:text-slate-700 active:cursor-grabbing"
          style={{ touchAction: "none" }}
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "short",
          }).format(new Date(`${task.dueDate}T12:00:00`))}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#ecece7] pt-3">
        <div className="flex gap-1">
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="border border-[#deded8] bg-[#f5f5f2] px-1.5 py-0.5 text-[10px] font-medium text-[#59626d]"
            >
              {tag}
            </span>
          ))}
        </div>
        {task.assignee ? (
          <span
            title={task.assignee.name}
            className="grid h-7 w-7 place-items-center bg-[#283444] text-[9px] font-semibold text-white"
          >
            {task.assignee.initials}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400">Atanmadı</span>
        )}
      </div>
    </article>
  );
}

function KanbanColumn({
  status,
  dotColor,
  tasks,
}: {
  status: TaskStatus;
  dotColor: string;
  tasks: Task[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] min-w-[280px] flex-1 border-t-2 bg-[#e9e9e4] p-3 transition ${
        isOver ? "border-[#245c54] bg-[#e2ebe8]" : "border-[#aeb2b0]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <h2 className="text-sm font-semibold text-[#303944]">
            {statusLabels[status]}
          </h2>
        </div>
        <span className="border-b border-[#7d858c] px-1 text-xs font-semibold text-[#59626d]">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [boardTasks, setBoardTasks] = useState(initialTasks);
  const [lastChange, setLastChange] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const nextStatus = event.over?.id as TaskStatus | undefined;

    if (!nextStatus || !columns.some((column) => column.status === nextStatus)) {
      return;
    }

    const draggedTask = boardTasks.find((task) => task.id === taskId);
    if (!draggedTask || draggedTask.status === nextStatus) return;

    setBoardTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    );
    setLastChange(
      `${draggedTask.code}, “${statusLabels[nextStatus]}” sütununa taşındı.`,
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {lastChange && (
        <div className="mb-4 border-l-4 border-[#245c54] bg-white px-4 py-3 text-sm text-[#245c54]">
          {lastChange}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            {...column}
            tasks={boardTasks.filter((task) => task.status === column.status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
