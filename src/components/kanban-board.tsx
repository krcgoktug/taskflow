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
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { changeTaskStatus } from "@/app/(workspace)/tasks/actions";

const columns: Array<{
  status: TaskStatus;
  dotColor: string;
  borderColor: string;
}> = [
  { status: "todo", dotColor: "bg-slate-400", borderColor: "border-slate-300" },
  {
    status: "in_progress",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-300",
  },
  {
    status: "review",
    dotColor: "bg-amber-500",
    borderColor: "border-amber-300",
  },
  {
    status: "done",
    dotColor: "bg-emerald-500",
    borderColor: "border-emerald-300",
  },
];

function KanbanCard({ task, disabled }: { task: Task; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, disabled });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition ${
        isDragging ? "z-20 opacity-70 shadow-xl" : "hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600">{task.code}</p>
          <h3 className="mt-1 text-sm font-semibold leading-5 text-slate-900">
            {task.title}
          </h3>
        </div>
        <button
          type="button"
          disabled={disabled}
          aria-label={`${task.title} görevini taşı`}
          className="cursor-grab rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
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
          {task.dueDate
            ? new Intl.DateTimeFormat("tr-TR", {
                day: "2-digit",
                month: "short",
              }).format(new Date(`${task.dueDate}T12:00:00`))
            : "Tarih yok"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex gap-1">
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        {task.assignee ? (
          <span
            title={task.assignee.name}
            className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-[9px] font-semibold text-white"
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
  borderColor,
  tasks,
  disabled,
}: {
  status: TaskStatus;
  dotColor: string;
  borderColor: string;
  tasks: Task[];
  disabled: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] min-w-[280px] flex-1 rounded-2xl border bg-slate-100/70 p-3 transition ${
        isOver ? `${borderColor} ring-2 ring-blue-100` : "border-slate-200"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
          <h2 className="text-sm font-semibold text-slate-800">
            {statusLabels[status]}
          </h2>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} disabled={disabled} />
        ))}
      </div>
    </section>
  );
}

export function KanbanBoard({
  initialTasks,
  connected,
}: {
  initialTasks: Task[];
  connected: boolean;
}) {
  const router = useRouter();
  const saving = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardTasks, setBoardTasks] = useState(initialTasks);
  const [lastChange, setLastChange] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    if (saving.current) return;
    const taskId = String(event.active.id);
    const nextStatus = event.over?.id as TaskStatus | undefined;

    if (
      !nextStatus ||
      !columns.some((column) => column.status === nextStatus)
    ) {
      return;
    }

    const draggedTask = boardTasks.find((task) => task.id === taskId);
    if (!draggedTask || draggedTask.status === nextStatus) return;
    setError(null);

    setBoardTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    );
    if (connected) {
      saving.current = true;
      setPending(true);
      try {
        const result = await changeTaskStatus(taskId, nextStatus);
        if (result.error) {
          setBoardTasks(boardTasks);
          setError(result.error);
          return;
        }
        router.refresh();
      } catch {
        setBoardTasks(boardTasks);
        setError("Değişiklik kaydedilemedi; görev eski durumuna döndü.");
        return;
      } finally {
        saving.current = false;
        setPending(false);
      }
    }
    setLastChange(
      `${draggedTask.code}, “${statusLabels[nextStatus]}” sütununa taşındı.`,
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {pending && (
        <p role="status" className="mb-4 text-sm">
          Kaydediliyor...
        </p>
      )}
      {!connected && (
        <p className="mb-4 text-sm text-slate-500">
          Örnek mod: değişiklikler yalnızca bu ekranda tutulur.
        </p>
      )}
      {lastChange && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {lastChange}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            {...column}
            disabled={pending}
            tasks={boardTasks.filter((task) => task.status === column.status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
