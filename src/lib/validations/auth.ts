import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Kullanıcı adını girin."),
  password: z.string().min(1, "Şifre alanı boş bırakılamaz."),
});
