"use server";

import type { Action_Result } from "@/lib/actions/action_result";
import { require_profile } from "@/lib/data/require_profile";
import { create_server_client } from "@/lib/supabase/server_client";
import { revalidatePath } from "next/cache";

export async function save_client(form_data: FormData): Promise<Action_Result> {
  const profile = await require_profile();
  const full_name = String(form_data.get("full_name") ?? "").trim();
  if (!full_name) {
    return { error: "Informe o nome do cliente." };
  }
  const supabase = await create_server_client();
  const payload = {
    full_name,
    phone: String(form_data.get("phone") ?? "").trim() || null,
    email: String(form_data.get("email") ?? "").trim() || null,
    notes: String(form_data.get("notes") ?? "").trim() || null,
    created_by: profile.id,
  };
  const client_id = String(form_data.get("client_id") ?? "");
  const query = client_id
    ? supabase.from("clients").update(payload).eq("id", client_id)
    : supabase.from("clients").insert(payload);
  const { error } = await query;
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/clientes");
  revalidatePath("/agenda");
  return { error: null };
}
