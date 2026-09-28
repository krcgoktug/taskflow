import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "./account-form";

export const metadata = { title: "Hesap ayarları" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-950">Hesap ayarları</h1>
      <p className="mt-2 text-sm text-slate-600">Giriş bilgileriniz</p>
      <AccountForm email={user?.email ?? ""} />
    </div>
  );
}
