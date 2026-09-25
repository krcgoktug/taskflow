"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { taskFormSchema } from "@/lib/validations/task";

const idSchema = z.string().uuid();
const statusSchema = z.enum(["todo", "in_progress", "review", "done"]);

async function session() {
  if (!isSupabaseConfigured()) throw new Error("Bağlantı henüz hazır değil.");
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Oturum açmanız gerekiyor.");
  return { supabase, user };
}

function refresh() {
  for (const path of [
    "/tasks",
    "/overview",
    "/board",
    "/timeline",
    "/requests",
  ])
    revalidatePath(path);
}

export async function saveTask(
  projectId: string,
  taskId: string | null,
  values: unknown,
) {
  const parsed = taskFormSchema.safeParse(values);
  if (
    !idSchema.safeParse(projectId).success ||
    (taskId !== null && !idSchema.safeParse(taskId).success) ||
    !parsed.success
  )
    return { error: "Görev bilgilerini kontrol edin." };
  const fields = parsed.data;
  if (!idSchema.safeParse(fields.assigneeId).success)
    return { error: "Geçerli bir sorumlu seçin." };
  try {
    const { supabase, user } = await session();
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("owner_id")
      .eq("id", projectId)
      .single();
    if (projectError || !project)
      return { error: "Proje bulunamadı veya erişim izniniz yok." };
    if (fields.assigneeId !== project.owner_id) {
      const { data: member, error } = await supabase
        .from("project_members")
        .select("user_id")
        .eq("project_id", projectId)
        .eq("user_id", fields.assigneeId)
        .maybeSingle();
      if (error || !member)
        return { error: "Sorumlu bu projenin üyesi olmalı." };
    }
    const payload = {
      title: fields.title,
      description: fields.description,
      priority: fields.priority,
      assignee_id: fields.assigneeId,
      start_date: fields.startDate,
      due_date: fields.dueDate,
    };
    const result = taskId
      ? await supabase
          .from("tasks")
          .update(payload)
          .eq("id", taskId)
          .eq("project_id", projectId)
          .select("id")
          .single()
      : await supabase
          .from("tasks")
          .insert({
            ...payload,
            project_id: projectId,
            created_by: user.id,
            code: `TF-${randomUUID().slice(0, 8).toUpperCase()}`,
          })
          .select("id")
          .single();
    if (result.error || !result.data)
      return {
        error: "Görev kaydedilemedi. Yetkinizi ve bağlantınızı kontrol edin.",
      };
    refresh();
    return { error: null };
  } catch {
    return {
      error: "İşlem tamamlanamadı. Oturumunuzu ve bağlantınızı kontrol edin.",
    };
  }
}

export async function changeTaskStatus(taskId: string, status: string) {
  if (
    !idSchema.safeParse(taskId).success ||
    !statusSchema.safeParse(status).success
  )
    return { error: "Geçersiz görev veya durum." };
  try {
    const { supabase } = await session();
    const { data: task, error: readError } = await supabase
      .from("tasks")
      .select("progress")
      .eq("id", taskId)
      .single();
    if (readError || !task)
      return { error: "Görev bulunamadı veya erişim izniniz yok." };
    const progress =
      status === "done"
        ? 100
        : status === "todo"
          ? 0
          : Math.min(task.progress, 99);
    const { data, error } = await supabase
      .from("tasks")
      .update({ status, progress })
      .eq("id", taskId)
      .select("id")
      .single();
    if (error || !data) return { error: "Görev durumu kaydedilemedi." };
    refresh();
    return { error: null };
  } catch {
    return { error: "Görev durumu kaydedilemedi. Tekrar deneyin." };
  }
}

export async function deleteTask(taskId: string) {
  if (!idSchema.safeParse(taskId).success) return { error: "Geçersiz görev." };
  try {
    const { supabase } = await session();
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .select("id")
      .single();
    if (error || !data)
      return {
        error: "Görev silinemedi. Yalnızca proje sahibi görev silebilir.",
      };
    refresh();
    return { error: null };
  } catch {
    return { error: "Görev silinemedi. Tekrar deneyin." };
  }
}

export async function createProject(
  _state: { error: string | null },
  formData: FormData,
) {
  const name = z
    .string()
    .trim()
    .min(3)
    .max(100)
    .safeParse(formData.get("name"));
  if (!name.success) return { error: "Proje adı 3–100 karakter olmalı." };
  try {
    const { supabase, user } = await session();
    const { error } = await supabase
      .from("projects")
      .insert({ name: name.data, owner_id: user.id });
    if (error) return { error: "Proje oluşturulamadı." };
    refresh();
    return { error: null };
  } catch {
    return { error: "Proje oluşturulamadı. Oturumunuzu kontrol edin." };
  }
}
