import type {
  Appointment_Row,
  Lock_Row,
  Profile_Row,
} from "@/lib/data/row_types";
import {
  add_calendar_days,
  start_of_day_from_calendar_date,
} from "@/lib/sao_paulo_date";
import { create_server_client } from "@/lib/supabase/server_client";

export type Day_Agenda = {
  staff: Profile_Row[];
  appointments: Appointment_Row[];
  locks: Lock_Row[];
};

export async function load_day_agenda(
  calendar_date: string,
): Promise<Day_Agenda> {
  const supabase = await create_server_client();
  const day_start = start_of_day_from_calendar_date(calendar_date);
  const next_day = start_of_day_from_calendar_date(
    add_calendar_days(calendar_date, 1),
  );
  const staff_result = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("is_active", true)
    .order("full_name");
  const appointment_result = await supabase
    .from("appointments")
    .select(
      "id, staff_id, client_id, walk_in_name, walk_in_phone, description, contact_phone, entry_date, starts_at, duration_minutes, status, clients(full_name, phone)",
    )
    .gte("starts_at", day_start.toISOString())
    .lt("starts_at", next_day.toISOString());
  const lock_result = await load_day_locks(calendar_date, day_start, next_day);
  return {
    staff: (staff_result.data ?? []) as Profile_Row[],
    appointments: (appointment_result.data ?? []) as unknown as Appointment_Row[],
    locks: lock_result,
  };
}

async function load_day_locks(
  calendar_date: string,
  day_start: Date,
  next_day: Date,
): Promise<Lock_Row[]> {
  const supabase = await create_server_client();
  const { data } = await supabase
    .from("calendar_locks")
    .select("id, staff_id, lock_type, lock_date, starts_at, ends_at, note")
    .or(
      `lock_date.eq.${calendar_date},and(starts_at.lt.${next_day.toISOString()},ends_at.gt.${day_start.toISOString()})`,
    );
  return (data ?? []) as Lock_Row[];
}
