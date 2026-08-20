"use client";

import { appointment_person_name } from "@/lib/appointment_person_name";
import { APPOINTMENT_STATUS } from "@/lib/appointment_status";
import type { Appointment_Row } from "@/lib/data/row_types";
import { height_from_minutes, top_from_instant } from "@/lib/agenda_layout";
import { format_display_time } from "@/lib/sao_paulo_date";

export function Appointment_Block({
  appointment,
  on_click,
}: {
  appointment: Appointment_Row;
  on_click: (appointment: Appointment_Row) => void;
}) {
  const start = new Date(appointment.starts_at);
  const cancelled = appointment.status === APPOINTMENT_STATUS.CANCELLED;
  return (
    <button
      type="button"
      onClick={() => on_click(appointment)}
      className={`absolute right-1 left-1 z-20 overflow-hidden rounded px-1.5 py-0.5 text-left text-xs text-white ${
        cancelled ? "bg-stone-400 line-through" : "bg-booked"
      }`}
      style={{
        top: top_from_instant(start),
        height: Math.max(height_from_minutes(appointment.duration_minutes), 16),
      }}
    >
      <span className="block truncate font-medium">
        {appointment_person_name(appointment)}
      </span>
      <span className="block truncate opacity-80">
        {format_display_time(start)}
      </span>
    </button>
  );
}
