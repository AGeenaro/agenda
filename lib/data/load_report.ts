import type { Appointment_Row } from "@/lib/data/row_types";
import { start_of_day_from_calendar_date } from "@/lib/sao_paulo_date";
import { add_calendar_days } from "@/lib/sao_paulo_date";
import { create_server_client } from "@/lib/supabase/server_client";

export async function load_report(
  from_date: string,
  to_date: string,
): Promise<Appointment_Row[]> {
  const supabase = await create_server_client();
  const range_start = start_of_day_from_calendar_date(from_date);
  const range_end = start_of_day_from_calendar_date(
    add_calendar_days(to_date, 1),
  );
  const { data } = await supabase
    .from("appointments")
    .select(
      "id, staff_id, client_id, walk_in_name, walk_in_phone, description, contact_phone, entry_date, starts_at, duration_minutes, status, clients(full_name, phone)",
    )
    .gte("starts_at", range_start.toISOString())
    .lt("starts_at", range_end.toISOString())
    .order("starts_at");
  return (data ?? []) as unknown as Appointment_Row[];
}
