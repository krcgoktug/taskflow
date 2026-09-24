"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase bağlantısı henüz yapılandırılmamış." };
  }

  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Bilgileri kontrol edin.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return { error: "E-posta adresi veya şifre hatalı." };
  }

  redirect("/overview");
}
