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
  "mt-1.5 h-11 w-full border border-[#cfcfc8] bg-white px-3 text-sm text-[#202833] outline-none transition placeholder:text-slate-400 focus:border-[#245c54] focus:ring-1 focus:ring-[#245c54]";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-[#a44332]">{message}</p>;
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
        className="border border-[#d9d9d3] bg-white p-5 sm:p-6"
        noValidate
      >
        {submittedTitle && (
          <div className="mb-5 flex gap-3 border-l-4 border-[#39705b] bg-[#f1f5f2] p-4 text-sm text-[#315e4d]">
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

        <div className="mt-6 flex items-center justify-end border-t border-[#ecece7] pt-5">
          <button
            type="submit"
            className="bg-[#245c54] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#19483f] focus:outline-none focus:ring-2 focus:ring-[#9abbb4] focus:ring-offset-2"
          >
            Formu kontrol et
          </button>
        </div>
      </form>
  );
}
