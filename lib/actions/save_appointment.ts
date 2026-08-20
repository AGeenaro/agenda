"use server";

import type { Action_Result } from "@/lib/actions/action_result";
import {
  parse_appointment_form,
  type Parsed_Appointment,
} from "@/lib/actions/parse_appointment_form";
import { can_book } from "@/lib/booking_rules";
import { load_day_agenda } from "@/lib/data/load_day_agenda";
import { require_profile } from "@/lib/data/require_profile";
import { instant_from_calendar_slot } from "@/lib/sao_paulo_date";
import { create_server_client } from "@/lib/supabase/server_client";
import { revalidatePath } from "next/cache";

export async function save_appointment(
  form_data: FormData,
): Promise<Action_Result> {
  const profile = await require_profile();
  const parsed = parse_appointment_form(form_data);
  if ("error" in parsed) {
    return parsed;
  }
  const appointment = parsed;
  const agenda = await load_day_agenda(appointment.calendar_date);
  const starts_at = instant_from_calendar_slot(
    appointment.calendar_date,
    appointment.hour,
    appointment.minute,
  );
  const decision = can_book({
    staff_id: appointment.staff_id,
    starts_at,
    duration_minutes: appointment.duration_minutes,
    calendar_date: appointment.calendar_date,
    locks: agenda.locks,
    appointments: agenda.appointments,
    exclude_appointment_id: appointment.appointment_id,
  });
  if (!decision.allowed) {
    return { error: decision.reason };
  }
  return persist_appointment(appointment, starts_at, profile.id);
}

async function persist_appointment(
  parsed: Parsed_Appointment,
  starts_at: Date,
  created_by: string,
): Promise<Action_Result> {
  const supabase = await create_server_client();
  const payload = {
    staff_id: parsed.staff_id,
    client_id: parsed.client_id,
    walk_in_name: parsed.walk_in_name,
    walk_in_phone: parsed.walk_in_phone,
    description: parsed.description,
    contact_phone: parsed.contact_phone,
    entry_date: parsed.entry_date,
    starts_at: starts_at.toISOString(),
    duration_minutes: parsed.duration_minutes,
    status: parsed.status,
    created_by,
  };
  const query = parsed.appointment_id
    ? supabase.from("appointments").update(payload).eq("id", parsed.appointment_id)
    : supabase.from("appointments").insert(payload);
  const { error } = await query;
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/agenda");
  revalidatePath("/relatorio");
  return { error: null };
}

export async function delete_appointment(
  appointment_id: string,
): Promise<Action_Result> {
  await require_profile();
  const supabase = await create_server_client();
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointment_id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/agenda");
  revalidatePath("/relatorio");
  return { error: null };
}
