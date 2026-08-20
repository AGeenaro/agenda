"use client";

import { create_team_user } from "@/lib/actions/create_team_user";
import { USER_ROLE, USER_ROLE_LABEL } from "@/lib/user_roles";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Team_User_Form() {
  const router = useRouter();
  const [error_message, set_error_message] = useState("");
  const [done, set_done] = useState(false);
  return (
    <form
      className="grid max-w-lg gap-3 rounded-xl border border-line bg-card p-4"
      action={async (form_data) => {
        const result = await create_team_user(form_data);
        if (result.error) {
          set_error_message(result.error);
          set_done(false);
          return;
        }
        set_error_message("");
        set_done(true);
        router.refresh();
      }}
    >
      <label className="text-sm">
        Nome
        <input name="full_name" required className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        E-mail
        <input name="email" type="email" required className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        Senha
        <input name="password" type="password" minLength={6} required className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        Papel
        <select name="role" defaultValue={USER_ROLE.STAFF} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {Object.values(USER_ROLE).map((role) => (
            <option key={role} value={role}>
              {USER_ROLE_LABEL[role]}
            </option>
          ))}
        </select>
      </label>
      {error_message ? <p className="text-sm text-danger">{error_message}</p> : null}
      {done ? <p className="text-sm text-emerald-700">Usuário criado.</p> : null}
      <button type="submit" className="w-fit rounded-md bg-ink px-4 py-2 text-white">
        Criar login
      </button>
    </form>
  );
}
