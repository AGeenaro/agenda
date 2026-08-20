import { GRID_HEIGHT, SLOT_PIXELS } from "@/lib/agenda_layout";
import { build_day_slots } from "@/lib/time_grid";
import { pad_two } from "@/lib/agenda_layout";

export function Time_Gutter() {
  const slots = build_day_slots();
  return (
    <div className="relative w-16 shrink-0" style={{ height: GRID_HEIGHT }}>
      {slots.map((slot) =>
        slot.minute === 0 ? (
          <div
            key={`${slot.hour}-${slot.minute}`}
            className="absolute right-2 -translate-y-2 text-xs text-stone-500"
            style={{ top: (slot.hour * 60) / 15 * SLOT_PIXELS }}
          >
            {pad_two(slot.hour)}:00
          </div>
        ) : null,
      )}
    </div>
  );
}
