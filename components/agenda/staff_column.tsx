"use client";

import { Appointment_Block } from "@/components/agenda/appointment_block";
import { Lock_Block } from "@/components/agenda/lock_block";
import { Slot_Click_Layer } from "@/components/agenda/slot_click_layer";
import type { Appointment_Row, Lock_Row, Profile_Row } from "@/lib/data/row_types";
import { GRID_HEIGHT, SLOT_PIXELS } from "@/lib/agenda_layout";
import { LOCK_TYPE } from "@/lib/lock_types";

export function Staff_Column({
  staff_member,
  appointments,
  locks,
  on_slot,
  on_appointment,
}: {
  staff_member: Profile_Row;
  appointments: Appointment_Row[];
  locks: Lock_Row[];
  on_slot: (staff_id: string, hour: number, minute: number) => void;
  on_appointment: (appointment: Appointment_Row) => void;
}) {
  const full_day_locked = locks.some(
    (calendar_lock) => calendar_lock.lock_type === LOCK_TYPE.FULL_DAY,
  );
  return (
    <div className="min-w-[180px] flex-1 border-l border-line">
      <div className="sticky top-0 z-10 border-b border-line bg-card px-2 py-2 text-sm font-medium text-ink">
        {staff_member.full_name}
      </div>
      <div
        className={`relative ${full_day_locked ? "bg-lock/70" : "bg-white"}`}
        style={{ height: GRID_HEIGHT, backgroundImage: grid_lines() }}
      >
        {full_day_locked ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-danger">
            Dia travado
          </div>
        ) : null}
        {locks
          .filter((calendar_lock) => calendar_lock.lock_type === LOCK_TYPE.TIME_SLOT)
          .map((calendar_lock) => (
            <Lock_Block key={calendar_lock.id} calendar_lock={calendar_lock} />
          ))}
        {appointments.map((appointment) => (
          <Appointment_Block
            key={appointment.id}
            appointment={appointment}
            on_click={on_appointment}
          />
        ))}
        {!full_day_locked ? (
          <Slot_Click_Layer
            staff_id={staff_member.id}
            on_slot={on_slot}
          />
        ) : null}
      </div>
    </div>
  );
}

function grid_lines(): string {
  return `repeating-linear-gradient(to bottom, transparent 0, transparent ${SLOT_PIXELS - 1}px, #eee6d8 ${SLOT_PIXELS - 1}px, #eee6d8 ${SLOT_PIXELS}px)`;
}
