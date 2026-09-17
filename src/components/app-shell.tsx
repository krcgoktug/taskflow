"use client";

import {
  BarChart3,
  CalendarRange,
  ClipboardList,
  Columns3,
  FilePlus2,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/tasks", label: "Görevler", icon: ClipboardList },
  { href: "/board", label: "Kanban", icon: Columns3 },
  { href: "/timeline", label: "Gantt", icon: CalendarRange },
  { href: "/requests", label: "Yeni talep", icon: FilePlus2 },
];

function NavigationLinks() {
  const pathname = usePathname();

  return navigation.map((item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  });
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/overview" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span>
            <strong className="block text-lg text-slate-950">TaskFlow</strong>
            <span className="text-xs text-slate-500">Proje yönetimi</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          <NavigationLinks />
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-slate-900">TaskFlow MVP</p>
              <p className="text-xs text-slate-500">28 Eylül hedefi</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                AY
              </span>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            <NavigationLinks />
          </nav>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
