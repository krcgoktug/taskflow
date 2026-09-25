"use client";

import type { Task } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

function toGanttTasks(tasks: Task[]) {
  return tasks
    .filter((task) => task.startDate && task.dueDate)
    .map((task) => ({
      id: task.id,
      name: `${task.code} · ${task.title}`.replace(
        /[&<>"']/g,
        (char) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[char]!,
      ),
      start: task.startDate,
      end: task.dueDate,
      progress: task.progress,
      dependencies: task.dependencyIds.join(","),
      custom_class: `gantt-status-${task.status}`,
    }));
}

export function GanttChart({ tasks }: { tasks: Task[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    container.innerHTML = "";

    async function renderChart() {
      try {
        const { default: Gantt } = await import("frappe-gantt");
        if (cancelled || !container) return;

        const ganttTasks = toGanttTasks(tasks);
        if (!ganttTasks.length) return;
        new Gantt(container, ganttTasks, {
          view_mode: "Day",
          view_mode_select: true,
          language: "tr",
          readonly: true,
          scroll_to: "start",
          lines: "both",
          bar_height: 28,
          column_width: 42,
          container_height: 520,
        });
      } catch {
        if (!cancelled) {
          setError("Gantt grafiği yüklenemedi.");
        }
      }
    }

    void renderChart();

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [tasks]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="gantt-chart overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
      {!tasks.some((task) => task.startDate && task.dueDate) && (
        <p className="p-4 text-sm text-slate-500">
          Tarihleri belirlenmiş görev bulunmuyor.
        </p>
      )}
      <div ref={containerRef} className="min-w-[900px]" />
    </div>
  );
}
