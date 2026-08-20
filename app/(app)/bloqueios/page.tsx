import { Lock_Form, Unlock_Button } from "@/components/lock_form";
import { load_locks } from "@/lib/data/load_locks";
import { load_staff } from "@/lib/data/load_staff";
import { require_profile } from "@/lib/data/require_profile";
import { LOCK_TYPE_LABEL } from "@/lib/lock_types";
import { format_display_time } from "@/lib/sao_paulo_date";

export default async function Bloqueios_Page() {
  await require_profile();
  const staff = await load_staff();
  const locks = await load_locks();
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Bloqueios</h1>
        <p className="mt-1 text-sm text-stone-600">
          Trave o dia inteiro ou um intervalo. O que ficar aberto a recepção
          pode encaixar.
        </p>
      </div>
      <Lock_Form staff={staff} />
      <section className="rounded-xl border border-line bg-card p-4">
        <h2 className="font-medium text-ink">Bloqueios recentes</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {locks.map((calendar_lock) => {
            const owner = staff.find((row) => row.id === calendar_lock.staff_id);
            const range =
              calendar_lock.starts_at && calendar_lock.ends_at
                ? `${format_display_time(new Date(calendar_lock.starts_at))} – ${format_display_time(new Date(calendar_lock.ends_at))}`
                : `${calendar_lock.lock_date ?? ""} · dia inteiro`;
            return (
              <li key={calendar_lock.id} className="flex justify-between gap-3">
                <span>
                  {owner?.full_name ?? "Atendente"} · {LOCK_TYPE_LABEL[calendar_lock.lock_type]} · {range}
                </span>
                <Unlock_Button lock_id={calendar_lock.id} />
              </li>
            );
          })}
        </ul>
        {locks.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Nenhum bloqueio ainda.</p>
        ) : null}
      </section>
    </main>
  );
}
