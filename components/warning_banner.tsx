import { appointments_for_warning } from "@/lib/appointment_warnings";
import { appointment_person_name } from "@/lib/appointment_person_name";
import type { Appointment_Row, Profile_Row } from "@/lib/data/row_types";
import { format_display_time } from "@/lib/sao_paulo_date";

export function Warning_Banner({
  profile,
  appointments,
}: {
  profile: Profile_Row;
  appointments: Appointment_Row[];
}) {
  const warnings = appointments_for_warning(
    appointments,
    profile.id,
    new Date(),
  );
  if (warnings.length === 0) {
    return null;
  }
  return (
    <aside className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">Você tem agendamentos hoje</p>
      <ul className="mt-1 space-y-1">
        {warnings.map((appointment) => (
          <li key={appointment.id}>
            {format_display_time(new Date(appointment.starts_at))} ·{" "}
            {appointment_person_name(appointment)}
          </li>
        ))}
      </ul>
    </aside>
  );
}
