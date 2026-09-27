"use client";
import { useActionState } from "react";
import { createProject } from "@/app/(workspace)/tasks/actions";

export function CreateProjectForm() {
  const [state, action, pending] = useActionState(createProject, {
    error: null,
  });
  return (
    <form action={action} className="rounded-xl border bg-white p-6 space-y-4">
      <h2 className="font-semibold">İlk projenizi oluşturun</h2>
      <label className="block text-sm">
        Proje adı
        <input
          name="name"
          required
          minLength={3}
          maxLength={100}
          className="mt-2 block w-full rounded border p-2"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Oluşturuluyor..." : "Proje oluştur"}
      </button>
    </form>
  );
}
