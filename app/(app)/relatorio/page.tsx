import { Report_Csv_Button } from "@/components/report_csv_button";
import { appointment_person_name } from "@/lib/appointment_person_name";
import { APPOINTMENT_STATUS_LABEL } from "@/lib/appointment_status";
import { load_report } from "@/lib/data/load_report";
import { load_staff } from "@/lib/data/load_staff";
import { require_profile } from "@/lib/data/require_profile";
import {
  format_calendar_date,
  format_display_time,
} from "@/lib/sao_paulo_date";

export default async function Relatorio_Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await require_profile();
  const params = await searchParams;
  const today = format_calendar_date(new Date());
  const from_date = params.from ?? today;
  const to_date = params.to ?? today;
  const [appointments, staff] = await Promise.all([
    load_report(from_date, to_date),
    load_staff(),
  ]);
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold text-ink">Relatório</h1>
      <form className="flex flex-wrap items-end gap-3" method="get">
        <label className="text-sm">
          De
          <input
            type="date"
            name="from"
            defaultValue={from_date}
            className="mt-1 block rounded-md border border-line px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Até
          <input
            type="date"
            name="to"
            defaultValue={to_date}
            className="mt-1 block rounded-md border border-line px-2 py-1.5"
          />
        </label>
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-white">
          Filtrar
        </button>
        <Report_Csv_Button appointments={appointments} staff={staff} />
      </form>
      <section className="overflow-auto rounded-xl border border-line bg-card">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-line text-stone-500">
            <tr>
              <th className="px-3 py-2">Horário</th>
              <th className="px-3 py-2">Atendente</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Contato</th>
              <th className="px-3 py-2">Descrição</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const owner = staff.find((row) => row.id === appointment.staff_id);
              const start = new Date(appointment.starts_at);
              return (
                <tr key={appointment.id} className="border-b border-line/70">
                  <td className="px-3 py-2">{format_display_time(start)}</td>
                  <td className="px-3 py-2">{owner?.full_name ?? "—"}</td>
                  <td className="px-3 py-2">
                    {appointment_person_name(appointment)}
                  </td>
                  <td className="px-3 py-2">
                    {appointment.contact_phone ?? appointment.walk_in_phone ?? "—"}
                  </td>
                  <td className="px-3 py-2">{appointment.description ?? "—"}</td>
                  <td className="px-3 py-2">
                    {APPOINTMENT_STATUS_LABEL[appointment.status]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {appointments.length === 0 ? (
          <p className="px-3 py-6 text-sm text-stone-500">
            Nenhum atendimento neste período.
          </p>
        ) : null}
      </section>
    </main>
  );
}
