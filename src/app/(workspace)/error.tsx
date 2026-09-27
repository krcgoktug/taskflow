"use client";

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <h2 className="font-semibold">Çalışma alanı yüklenemedi</h2>
      <p className="my-3 text-sm text-slate-600">
        Bağlantınızı kontrol edip tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Tekrar dene
      </button>
    </section>
  );
}
