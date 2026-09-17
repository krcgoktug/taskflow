"use client";

import { assignees } from "@/lib/mock-data";
import {
  taskFormSchema,
  type TaskFormValues,
} from "@/lib/validations/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const inputClassName =
  "mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export function RequestForm() {
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assigneeId: "",
      startDate: "",
      dueDate: "",
    },
  });

  function onSubmit(values: TaskFormValues) {
    setSubmittedTitle(values.title);
    reset();
  }

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        noValidate
      >
        {submittedTitle && (
          <div className="mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <strong className="block">Görev bilgileri doğrulandı</strong>
              “{submittedTitle}” kaydı oluşturulmaya hazır.
            </div>
          </div>
        )}

        <div className="grid gap-5">
          <label className="text-sm font-medium text-slate-700">
            Görev başlığı
            <input
              {...register("title")}
              placeholder="Örn. Kullanıcı giriş ekranını hazırla"
              className={inputClassName}
            />
            <FieldError message={errors.title?.message} />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Açıklama
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Görevin amacı ve kabul kriterleri..."
              className={`${inputClassName} h-auto resize-y py-3`}
            />
            <FieldError message={errors.description?.message} />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Öncelik
              <select {...register("priority")} className={inputClassName}>
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
              <FieldError message={errors.priority?.message} />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Sorumlu
              <select {...register("assigneeId")} className={inputClassName}>
                <option value="">Seçiniz</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.assigneeId?.message} />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Başlangıç tarihi
              <input
                type="date"
                {...register("startDate")}
                className={inputClassName}
              />
              <FieldError message={errors.startDate?.message} />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Bitiş tarihi
              <input
                type="date"
                {...register("dueDate")}
                className={inputClassName}
              />
              <FieldError message={errors.dueDate?.message} />
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            Formu kontrol et
          </button>
        </div>
      </form>
  );
}
