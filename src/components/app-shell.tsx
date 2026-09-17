"use client";

import {
  CalendarRange,
  ClipboardList,
  Columns3,
  FilePlus2,
  LayoutDashboard,
  PanelsTopLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/overview", label: "Genel bakış", icon: LayoutDashboard },
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
        className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition ${
          isActive
            ? "border-[#c7784d] bg-white/10 font-semibold text-white"
            : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
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
    <div className="min-h-screen bg-[#f3f3ef]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 bg-[#18212f] px-5 py-6 lg:block">
        <Link href="/overview" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-white/20 bg-white/5 text-[#e5ad88]">
            <PanelsTopLeft className="h-5 w-5" />
          </span>
          <span>
            <strong className="block text-base tracking-wide text-white">TaskFlow</strong>
            <span className="text-xs text-slate-400">İş takip sistemi</span>
          </span>
        </Link>

        <nav className="mt-10 space-y-1">
          <NavigationLinks />
        </nav>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-10 border-b border-[#d9d9d3] bg-[#f3f3ef]/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-[#202833]">Ürün geliştirme</p>
              <p className="text-xs text-[#68717d]">28 Eylül · teslim planı</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center bg-[#245c54] text-[11px] font-semibold text-white">
                AY
              </span>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-[#d9d9d3] bg-[#18212f] px-4 py-2 lg:hidden">
            <NavigationLinks />
          </nav>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
