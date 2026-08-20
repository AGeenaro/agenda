"use client";

import { Staff_Column } from "@/components/agenda/staff_column";
import { Time_Gutter } from "@/components/agenda/time_gutter";
import { Appointment_Dialog } from "@/components/appointment_dialog";
import type {
  Appointment_Row,
  Client_Row,
  Lock_Row,
  Profile_Row,
} from "@/lib/data/row_types";
import { useState } from "react";

type Draft = {
  appointment?: Appointment_Row;
  staff_id: string;
  hour: number;
  minute: number;
};

export function Agenda_Board({
  calendar_date,
  staff,
  appointments,
  locks,
  clients,
}: {
  calendar_date: string;
  staff: Profile_Row[];
  appointments: Appointment_Row[];
  locks: Lock_Row[];
  clients: Client_Row[];
}) {
  const [draft, set_draft] = useState<Draft | null>(null);
  return (
    <>
      <div className="overflow-auto rounded-xl border border-line bg-card">
        <div className="flex min-w-max">
          <Time_Gutter />
          {staff.map((staff_member) => (
            <Staff_Column
              key={staff_member.id}
              staff_member={staff_member}
              appointments={appointments.filter(
                (appointment) => appointment.staff_id === staff_member.id,
              )}
              locks={locks.filter(
                (calendar_lock) => calendar_lock.staff_id === staff_member.id,
              )}
              on_slot={(staff_id, hour, minute) =>
                set_draft({ staff_id, hour, minute })
              }
              on_appointment={(appointment) => {
                const start = new Date(appointment.starts_at);
                set_draft({
                  appointment,
                  staff_id: appointment.staff_id,
                  hour: start.getHours(),
                  minute: start.getMinutes(),
                });
              }}
            />
          ))}
        </div>
      </div>
      {draft ? (
        <Appointment_Dialog
          calendar_date={calendar_date}
          staff={staff}
          clients={clients}
          draft={draft}
          on_close={() => set_draft(null)}
        />
      ) : null}
    </>
  );
}
