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
    assigneeName: z
      .string()
      .trim()
      .min(2, "Sorumlu adı en az 2 karakter olmalı.")
      .max(80, "Sorumlu adı en fazla 80 karakter olabilir."),
    startDate: z.iso.date("Geçerli bir başlangıç tarihi girin."),
    dueDate: z.iso.date("Geçerli bir bitiş tarihi girin."),
  })
  .refine((data) => data.dueDate >= data.startDate, {
    message: "Bitiş tarihi başlangıç tarihinden önce olamaz.",
    path: ["dueDate"],
  });

export type TaskFormValues = z.infer<typeof taskFormSchema>;
