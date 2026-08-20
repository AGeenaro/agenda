"use client";

import { SLOT_PIXELS } from "@/lib/agenda_layout";
import { build_day_slots } from "@/lib/time_grid";

export function Slot_Click_Layer({
  staff_id,
  on_slot,
}: {
  staff_id: string;
  on_slot: (staff_id: string, hour: number, minute: number) => void;
}) {
  const slots = build_day_slots();
  return (
    <div className="absolute inset-0 z-0">
      {slots.map((slot) => (
        <button
          key={`${staff_id}-${slot.hour}-${slot.minute}`}
          type="button"
          aria-label={`Agendar ${slot.hour}:${slot.minute}`}
          className="absolute right-0 left-0 hover:bg-ink/5"
          style={{
            top: ((slot.hour * 60 + slot.minute) / 15) * SLOT_PIXELS,
            height: SLOT_PIXELS,
          }}
          onClick={() => on_slot(staff_id, slot.hour, slot.minute)}
        />
      ))}
    </div>
  );
}
