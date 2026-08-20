export const SLOT_MINUTES = 15;
export const HOURS_PER_DAY = 24;
export const SLOTS_PER_DAY = (HOURS_PER_DAY * 60) / SLOT_MINUTES;

export function is_valid_duration_minutes(duration_minutes: number): boolean {
  return (
    Number.isInteger(duration_minutes) &&
    duration_minutes >= SLOT_MINUTES &&
    duration_minutes % SLOT_MINUTES === 0
  );
}

export function is_aligned_to_grid(instant: Date): boolean {
  return (
    instant.getUTCSeconds() === 0 &&
    instant.getUTCMilliseconds() === 0 &&
    instant.getUTCMinutes() % SLOT_MINUTES === 0
  );
}

export function add_minutes(instant: Date, minutes: number): Date {
  return new Date(instant.getTime() + minutes * 60 * 1000);
}

export function build_day_slots(): Array<{ hour: number; minute: number }> {
  const slots = [];
  for (let index = 0; index < SLOTS_PER_DAY; index += 1) {
    const total_minutes = index * SLOT_MINUTES;
    slots.push({
      hour: Math.floor(total_minutes / 60),
      minute: total_minutes % 60,
    });
  }
  return slots;
}
