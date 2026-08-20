import type { Lock_Row } from "@/lib/data/row_types";
import { height_from_minutes, top_from_instant } from "@/lib/agenda_layout";

export function Lock_Block({ calendar_lock }: { calendar_lock: Lock_Row }) {
  if (!calendar_lock.starts_at || !calendar_lock.ends_at) {
    return null;
  }
  const start = new Date(calendar_lock.starts_at);
  const end = new Date(calendar_lock.ends_at);
  const duration_minutes = (end.getTime() - start.getTime()) / 60000;
  return (
    <div
      className="absolute right-0 left-0 z-10 bg-lock/90"
      style={{
        top: top_from_instant(start),
        height: height_from_minutes(duration_minutes),
      }}
      title={calendar_lock.note ?? "Horário travado"}
    />
  );
}
