"use client";

import { PriorityBadge, StatusBadge } from "@/components/task-badges";
import { priorityLabels, statusLabels } from "@/lib/constants";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
});

export function TaskTable({ initialTasks }: { initialTasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<TaskPriority | "all">("all");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return initialTasks.filter((task) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        task.title.toLocaleLowerCase("tr-TR").includes(normalizedQuery) ||
        task.code.toLocaleLowerCase("tr-TR").includes(normalizedQuery);
      const matchesStatus = status === "all" || task.status === status;
      const matchesPriority =
        priority === "all" || task.priority === priority;

      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [initialTasks, priority, query, status]);

  return (
    <section className="overflow-hidden border border-[#d9d9d3] bg-white">
      <div className="grid gap-3 border-b border-[#d9d9d3] bg-[#fafaf8] p-4 md:grid-cols-[1fr_190px_170px]">
        <label className="relative">
          <span className="sr-only">Görev ara</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7c848d]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kod veya görev ara..."
            className="h-10 w-full border border-[#cfcfc8] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#245c54] focus:ring-1 focus:ring-[#245c54]"
          />
        </label>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as TaskStatus | "all")
          }
          className="h-10 border border-[#cfcfc8] bg-white px-3 text-sm outline-none focus:border-[#245c54] focus:ring-1 focus:ring-[#245c54]"
        >
          <option value="all">Tüm durumlar</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as TaskPriority | "all")
          }
          className="h-10 border border-[#cfcfc8] bg-white px-3 text-sm outline-none focus:border-[#245c54] focus:ring-1 focus:ring-[#245c54]"
        >
          <option value="all">Tüm öncelikler</option>
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[#d9d9d3] bg-[#ecece7] text-xs text-[#59626d]">
            <tr>
              <th className="px-5 py-3 font-semibold">Görev</th>
              <th className="px-5 py-3 font-semibold">Durum</th>
              <th className="px-5 py-3 font-semibold">Öncelik</th>
              <th className="px-5 py-3 font-semibold">Sorumlu</th>
              <th className="px-5 py-3 font-semibold">Bitiş</th>
              <th className="px-5 py-3 font-semibold">İlerleme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecece7]">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#f8f8f5]">
                <td className="px-5 py-4">
                  <p className="text-xs font-semibold text-[#245c54]">
                    {task.code}
                  </p>
                  <p className="mt-1 font-medium text-[#202833]">{task.title}</p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-5 py-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-5 py-4">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center bg-[#283444] text-[10px] font-semibold text-white">
                        {task.assignee.initials}
                      </span>
                      <span className="text-[#4f5965]">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Atanmadı</span>
                  )}
                </td>
                <td className="px-5 py-4 text-[#59626d]">
                  {dateFormatter.format(new Date(`${task.dueDate}T12:00:00`))}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-20 overflow-hidden bg-[#e3e3dd]">
                      <div
                        className="h-full bg-[#245c54]"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      %{task.progress}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#d9d9d3] bg-[#fafaf8] px-5 py-3 text-xs text-[#68717d]">
        {filteredTasks.length} / {initialTasks.length} görev gösteriliyor
      </div>
    </section>
  );
}
