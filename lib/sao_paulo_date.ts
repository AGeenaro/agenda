export const TIMEZONE = "America/Sao_Paulo";

export function format_calendar_date(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

export function format_display_date(instant: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(instant);
}

export function format_display_time(instant: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
}

export function add_calendar_days(calendar_date: string, days: number): string {
  const [year, month, day] = calendar_date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  const iso = shifted.toISOString().slice(0, 10);
  return iso;
}

export function start_of_day_from_calendar_date(calendar_date: string): Date {
  return new Date(`${calendar_date}T00:00:00-03:00`);
}

export function instant_from_calendar_slot(
  calendar_date: string,
  hour: number,
  minute: number,
): Date {
  const hour_text = String(hour).padStart(2, "0");
  const minute_text = String(minute).padStart(2, "0");
  return new Date(`${calendar_date}T${hour_text}:${minute_text}:00-03:00`);
}

export function minutes_from_midnight_sao_paulo(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  return hour * 60 + minute;
}
