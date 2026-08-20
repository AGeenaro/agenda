import { APPOINTMENT_STATUS } from "@/lib/appointment_status";
import type { Booking_Appointment, Booking_Lock } from "@/lib/booking_types";
import { LOCK_TYPE } from "@/lib/lock_types";
import { add_minutes } from "@/lib/time_grid";
import { ranges_overlap } from "@/lib/time_range_overlap";

export function lock_blocks_range(
  calendar_lock: Booking_Lock,
  staff_id: string,
  range_start: Date,
  range_end: Date,
  calendar_date: string,
): boolean {
  if (calendar_lock.staff_id !== staff_id) {
    return false;
  }
  if (calendar_lock.lock_type === LOCK_TYPE.FULL_DAY) {
    return calendar_lock.lock_date === calendar_date;
  }
  if (!calendar_lock.starts_at || !calendar_lock.ends_at) {
    return false;
  }
  return ranges_overlap(
    range_start,
    range_end,
    new Date(calendar_lock.starts_at),
    new Date(calendar_lock.ends_at),
  );
}

export function appointment_blocks_range(
  appointment: Booking_Appointment,
  staff_id: string,
  range_start: Date,
  range_end: Date,
  exclude_appointment_id?: string,
): boolean {
  if (appointment.staff_id !== staff_id) {
    return false;
  }
  if (appointment.id === exclude_appointment_id) {
    return false;
  }
  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    return false;
  }
  const appointment_start = new Date(appointment.starts_at);
  const appointment_end = add_minutes(
    appointment_start,
    appointment.duration_minutes,
  );
  return ranges_overlap(
    range_start,
    range_end,
    appointment_start,
    appointment_end,
  );
}
