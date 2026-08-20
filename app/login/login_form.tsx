"use client";

import { create_browser_client } from "@/lib/supabase/browser_client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Login_Form() {
  const router = useRouter();
  const [error_message, set_error_message] = useState("");
  const [pending, set_pending] = useState(false);

  async function handle_submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    set_pending(true);
    set_error_message("");
    const form_data = new FormData(event.currentTarget);
    const supabase = create_browser_client();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form_data.get("email") ?? ""),
      password: String(form_data.get("password") ?? ""),
    });
    set_pending(false);
    if (error) {
      set_error_message("E-mail ou senha inválidos.");
      return;
    }
    router.push("/agenda");
    router.refresh();
  }

  return (
    <form onSubmit={handle_submit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-stone-700">
        E-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-stone-700">
        Senha
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2"
        />
      </label>
      {error_message ? (
        <p className="text-sm text-danger">{error_message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-ink px-4 py-2.5 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
