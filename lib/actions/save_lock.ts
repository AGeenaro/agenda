"use server";

import type { Action_Result } from "@/lib/actions/action_result";
import { require_profile } from "@/lib/data/require_profile";
import { LOCK_TYPE } from "@/lib/lock_types";
import { instant_from_calendar_slot } from "@/lib/sao_paulo_date";
import { create_server_client } from "@/lib/supabase/server_client";
import { revalidatePath } from "next/cache";

export async function save_lock(form_data: FormData): Promise<Action_Result> {
  const profile = await require_profile();
  const staff_id = String(form_data.get("staff_id") ?? "");
  const lock_type = String(form_data.get("lock_type") ?? "");
  const lock_date = String(form_data.get("lock_date") ?? "");
  if (!staff_id || !lock_date) {
    return { error: "Informe o atendente e a data." };
  }
  const payload = build_lock_payload(
    form_data,
    staff_id,
    lock_type,
    lock_date,
    profile.id,
  );
  if ("error" in payload) {
    return payload;
  }
  const supabase = await create_server_client();
  const { error } = await supabase.from("calendar_locks").insert(payload);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/agenda");
  revalidatePath("/bloqueios");
  return { error: null };
}

type Lock_Insert = {
  staff_id: string;
  lock_type: string;
  lock_date: string;
  starts_at: string | null;
  ends_at: string | null;
  note: string | null;
  created_by: string;
};

function build_lock_payload(
  form_data: FormData,
  staff_id: string,
  lock_type: string,
  lock_date: string,
  created_by: string,
): Lock_Insert | Action_Result {
  if (lock_type === LOCK_TYPE.FULL_DAY) {
    return {
      staff_id,
      lock_type: LOCK_TYPE.FULL_DAY,
      lock_date,
      starts_at: null,
      ends_at: null,
      note: String(form_data.get("note") ?? "").trim() || null,
      created_by,
    };
  }
  const start_hour = Number(form_data.get("start_hour"));
  const start_minute = Number(form_data.get("start_minute"));
  const end_hour = Number(form_data.get("end_hour"));
  const end_minute = Number(form_data.get("end_minute"));
  const starts_at = instant_from_calendar_slot(
    lock_date,
    start_hour,
    start_minute,
  );
  const ends_at = instant_from_calendar_slot(lock_date, end_hour, end_minute);
  if (!(ends_at > starts_at)) {
    return { error: "O fim do bloqueio deve ser depois do início." };
  }
  return {
    staff_id,
    lock_type: LOCK_TYPE.TIME_SLOT,
    lock_date,
    starts_at: starts_at.toISOString(),
    ends_at: ends_at.toISOString(),
    note: String(form_data.get("note") ?? "").trim() || null,
    created_by,
  };
}

export async function delete_lock(lock_id: string): Promise<Action_Result> {
  await require_profile();
  const supabase = await create_server_client();
  const { error } = await supabase.from("calendar_locks").delete().eq("id", lock_id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/agenda");
  revalidatePath("/bloqueios");
  return { error: null };
}
