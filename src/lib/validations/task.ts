import { z } from "zod";

export const taskFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Başlık en az 3 karakter olmalı.")
      .max(80, "Başlık en fazla 80 karakter olabilir."),
    description: z
      .string()
      .trim()
      .min(10, "Açıklama en az 10 karakter olmalı.")
      .max(500, "Açıklama en fazla 500 karakter olabilir."),
    priority: z.enum(["low", "medium", "high"]),
    assigneeId: z.string().min(1, "Bir sorumlu seçmelisin."),
    startDate: z.string().min(1, "Başlangıç tarihi gerekli."),
    dueDate: z.string().min(1, "Bitiş tarihi gerekli."),
  })
  .refine((data) => data.dueDate >= data.startDate, {
    message: "Bitiş tarihi başlangıç tarihinden önce olamaz.",
    path: ["dueDate"],
  });

export type TaskFormValues = z.infer<typeof taskFormSchema>;
