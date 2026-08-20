import type { Action_Result } from "@/lib/actions/action_result";

export type Parsed_Appointment = {
  appointment_id: string | undefined;
  staff_id: string;
  calendar_date: string;
  entry_date: string;
  hour: number;
  minute: number;
  duration_minutes: number;
  client_id: string | null;
  walk_in_name: string | null;
  walk_in_phone: string | null;
  description: string | null;
  contact_phone: string | null;
  status: string;
};

export function parse_appointment_form(
  form_data: FormData,
): Parsed_Appointment | Action_Result {
  const staff_id = String(form_data.get("staff_id") ?? "");
  const calendar_date = String(form_data.get("calendar_date") ?? "");
  const walk_in_name = String(form_data.get("walk_in_name") ?? "").trim();
  const client_id_raw = String(form_data.get("client_id") ?? "").trim();
  if (!staff_id || !calendar_date) {
    return { error: "Informe quem atende e a data." };
  }
  if (!client_id_raw && !walk_in_name) {
    return { error: "Cadastre um cliente ou informe o nome do encaixe." };
  }
  return {
    appointment_id: String(form_data.get("appointment_id") ?? "") || undefined,
    staff_id,
    calendar_date,
    entry_date: String(form_data.get("entry_date") ?? calendar_date),
    hour: Number(form_data.get("hour")),
    minute: Number(form_data.get("minute")),
    duration_minutes: Number(form_data.get("duration_minutes")),
    client_id: client_id_raw || null,
    walk_in_name: walk_in_name || null,
    walk_in_phone:
      String(form_data.get("walk_in_phone") ?? "").trim() ||
      String(form_data.get("contact_phone") ?? "").trim() ||
      null,
    description: String(form_data.get("description") ?? "").trim() || null,
    contact_phone: String(form_data.get("contact_phone") ?? "").trim() || null,
    status: String(form_data.get("status") ?? "scheduled"),
  };
}
