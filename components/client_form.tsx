"use client";

import { save_client } from "@/lib/actions/save_client";
import type { Client_Row } from "@/lib/data/row_types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Client_Form({ client }: { client?: Client_Row }) {
  const router = useRouter();
  const [error_message, set_error_message] = useState("");
  return (
    <form
      className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-2"
      action={async (form_data) => {
        const result = await save_client(form_data);
        if (result.error) {
          set_error_message(result.error);
          return;
        }
        set_error_message("");
        router.refresh();
      }}
    >
      <input type="hidden" name="client_id" value={client?.id ?? ""} />
      <label className="text-sm sm:col-span-2">
        Nome
        <input
          name="full_name"
          required
          defaultValue={client?.full_name ?? ""}
          className="mt-1 w-full rounded-md border border-line px-2 py-1.5"
        />
      </label>
      <label className="text-sm">
        Telefone
        <input
          name="phone"
          defaultValue={client?.phone ?? ""}
          className="mt-1 w-full rounded-md border border-line px-2 py-1.5"
        />
      </label>
      <label className="text-sm">
        E-mail
        <input
          name="email"
          type="email"
          defaultValue={client?.email ?? ""}
          className="mt-1 w-full rounded-md border border-line px-2 py-1.5"
        />
      </label>
      <label className="text-sm sm:col-span-2">
        Observações
        <textarea
          name="notes"
          rows={2}
          defaultValue={client?.notes ?? ""}
          className="mt-1 w-full rounded-md border border-line px-2 py-1.5"
        />
      </label>
      {error_message ? <p className="text-sm text-danger">{error_message}</p> : null}
      <button type="submit" className="w-fit rounded-md bg-ink px-4 py-2 text-white">
        {client ? "Salvar" : "Cadastrar cliente"}
      </button>
    </form>
  );
}
