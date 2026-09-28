import { AppShell } from "@/components/app-shell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  let userEmail: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    userEmail =
      user.email === process.env.ADMIN_LOGIN_EMAIL
        ? "admin"
        : (user.email ?? null);
  }

  return <AppShell userEmail={userEmail}>{children}</AppShell>;
}
