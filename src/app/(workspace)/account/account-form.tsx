"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, type FormEvent } from "react";

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const buttonClass =
  "mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60";

export function AccountForm({ email }: { email: string }) {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [emailPending, setEmailPending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  async function changeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailMessage("");
    if (newEmail.trim().toLowerCase() === email.toLowerCase()) {
      setEmailMessage("Yeni e-posta adresi mevcut adresinizden farklı olmalı.");
      return;
    }
    setEmailPending(true);
    try {
      const { error } = await createClient().auth.updateUser({
        email: newEmail.trim(),
      });
      setEmailMessage(
        error
          ? `E-posta değiştirilemedi: ${error.message}`
          : "Onay bağlantısı gönderildi. Değişiklik için e-postalarınızı kontrol edin.",
      );
      if (!error) setNewEmail("");
    } catch {
      setEmailMessage("Bağlantı kurulamadı. Tekrar deneyin.");
    } finally {
      setEmailPending(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    if (newPassword.length < 6) {
      setPasswordMessage("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmation) {
      setPasswordMessage("Şifreler eşleşmiyor.");
      return;
    }
    setPasswordPending(true);
    try {
      const { error } = await createClient().auth.updateUser({
        password: newPassword,
      });
      setPasswordMessage(
        error
          ? `Şifre değiştirilemedi: ${error.message}`
          : "Şifreniz değiştirildi. Sonraki girişinizde yeni şifrenizi kullanın.",
      );
      if (!error) {
        setNewPassword("");
        setConfirmation("");
      }
    } catch {
      setPasswordMessage("Bağlantı kurulamadı. Tekrar deneyin.");
    } finally {
      setPasswordPending(false);
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">E-posta</h2>
        <p className="mt-2 text-sm text-slate-600">Şu an kullanılan: {email}</p>
        <form onSubmit={changeEmail} className="mt-5">
          <label
            htmlFor="new-email"
            className="text-sm font-medium text-slate-800"
          >
            Yeni e-posta
          </label>
          <input
            id="new-email"
            type="email"
            autoComplete="email"
            required
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            className={inputClass}
          />
          <button type="submit" disabled={emailPending} className={buttonClass}>
            {emailPending ? "Kaydediliyor..." : "E-postayı değiştir"}
          </button>
        </form>
        {emailMessage && (
          <p role="status" className="mt-3 text-sm text-slate-700">
            {emailMessage}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Şifre</h2>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-slate-800"
            >
              Yeni şifre
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-slate-800"
            >
              Yeni şifre (tekrar)
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={passwordPending}
            className={buttonClass}
          >
            {passwordPending ? "Kaydediliyor..." : "Şifreyi değiştir"}
          </button>
        </form>
        {passwordMessage && (
          <p role="status" className="mt-3 text-sm text-slate-700">
            {passwordMessage}
          </p>
        )}
      </section>
    </div>
  );
}
