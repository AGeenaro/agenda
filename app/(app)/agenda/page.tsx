import { Agenda_Board } from "@/components/agenda/agenda_board";
import { Warning_Banner } from "@/components/warning_banner";
import { load_clients } from "@/lib/data/load_clients";
import { load_day_agenda } from "@/lib/data/load_day_agenda";
import { require_profile } from "@/lib/data/require_profile";
import {
  add_calendar_days,
  format_calendar_date,
  format_display_date,
  start_of_day_from_calendar_date,
} from "@/lib/sao_paulo_date";
import Link from "next/link";

export default async function Agenda_Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const profile = await require_profile();
  const params = await searchParams;
  const calendar_date =
    params.date ?? format_calendar_date(new Date());
  const [agenda, clients] = await Promise.all([
    load_day_agenda(calendar_date),
    load_clients(),
  ]);
  const previous = add_calendar_days(calendar_date, -1);
  const next = add_calendar_days(calendar_date, 1);
  const display = format_display_date(
    start_of_day_from_calendar_date(calendar_date),
  );
  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-ink">Agenda</h1>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/agenda?date=${previous}`} className="rounded border border-line px-2 py-1">
            Anterior
          </Link>
          <span className="min-w-40 text-center font-medium capitalize">{display}</span>
          <Link href={`/agenda?date=${next}`} className="rounded border border-line px-2 py-1">
            Próximo
          </Link>
          <Link href="/agenda" className="text-ink-soft">
            Hoje
          </Link>
        </div>
      </div>
      <Warning_Banner profile={profile} appointments={agenda.appointments} />
      {agenda.staff.length === 0 ? (
        <p className="rounded-lg border border-line bg-card p-4">
          Nenhum usuário ativo. Crie logins no Supabase e rode o SQL de papéis.
        </p>
      ) : (
        <Agenda_Board
          calendar_date={calendar_date}
          staff={agenda.staff}
          appointments={agenda.appointments}
          locks={agenda.locks}
          clients={clients}
        />
      )}
    </main>
  );
}
