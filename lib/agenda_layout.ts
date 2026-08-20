import { SLOT_MINUTES, SLOTS_PER_DAY } from "@/lib/time_grid";
import { minutes_from_midnight_sao_paulo } from "@/lib/sao_paulo_date";

export const SLOT_PIXELS = 18;
export const GRID_HEIGHT = SLOTS_PER_DAY * SLOT_PIXELS;

export function top_from_instant(instant: Date): number {
  return (minutes_from_midnight_sao_paulo(instant) / SLOT_MINUTES) * SLOT_PIXELS;
}

export function height_from_minutes(duration_minutes: number): number {
  return (duration_minutes / SLOT_MINUTES) * SLOT_PIXELS;
}

export function pad_two(value: number): string {
  return String(value).padStart(2, "0");
}
