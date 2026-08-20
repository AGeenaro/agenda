import type { Can_Book_Input, Can_Book_Result } from "@/lib/booking_types";
import {
  appointment_blocks_range,
  lock_blocks_range,
} from "@/lib/slot_conflicts";
import {
  add_minutes,
  is_aligned_to_grid,
  is_valid_duration_minutes,
} from "@/lib/time_grid";

export function can_book(input: Can_Book_Input): Can_Book_Result {
  if (!is_valid_duration_minutes(input.duration_minutes)) {
    return {
      allowed: false,
      reason: "A duração deve ser múltipla de 15 minutos.",
    };
  }
  if (!is_aligned_to_grid(input.starts_at)) {
    return {
      allowed: false,
      reason: "O horário deve cair na grade de 15 minutos.",
    };
  }
  const range_end = add_minutes(input.starts_at, input.duration_minutes);
  return check_conflicts(input, range_end);
}

function check_conflicts(
  input: Can_Book_Input,
  range_end: Date,
): Can_Book_Result {
  const locked = input.locks.some((calendar_lock) =>
    lock_blocks_range(
      calendar_lock,
      input.staff_id,
      input.starts_at,
      range_end,
      input.calendar_date,
    ),
  );
  if (locked) {
    return { allowed: false, reason: "Este horário está travado." };
  }
  const booked = input.appointments.some((appointment) =>
    appointment_blocks_range(
      appointment,
      input.staff_id,
      input.starts_at,
      range_end,
      input.exclude_appointment_id,
    ),
  );
  if (booked) {
    return { allowed: false, reason: "Já existe um atendimento neste horário." };
  }
  return { allowed: true };
}
