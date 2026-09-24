import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Giriş",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-slate-950">TaskFlow</p>
            <p className="text-xs text-slate-500">Proje yönetimi</p>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Hesabınıza giriş yapın
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Çalışma alanına erişmek için şirket hesabınızı kullanın.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
