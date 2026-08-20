import { APPOINTMENT_STATUS } from "@/lib/appointment_status";
import type { Booking_Appointment } from "@/lib/booking_types";
import { format_calendar_date } from "@/lib/sao_paulo_date";

export function appointments_for_warning<T extends Booking_Appointment>(
  appointments: T[],
  staff_id: string,
  now: Date,
): T[] {
  const today = format_calendar_date(now);
  return appointments.filter((appointment) => {
    if (appointment.staff_id !== staff_id) {
      return false;
    }
    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      return false;
    }
    const start = new Date(appointment.starts_at);
    return format_calendar_date(start) === today && start >= now;
  });
}
