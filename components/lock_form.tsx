"use client";

import { delete_lock, save_lock } from "@/lib/actions/save_lock";
import type { Profile_Row } from "@/lib/data/row_types";
import { pad_two } from "@/lib/agenda_layout";
import { LOCK_TYPE, LOCK_TYPE_LABEL } from "@/lib/lock_types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Lock_Form({ staff }: { staff: Profile_Row[] }) {
  const router = useRouter();
  const [error_message, set_error_message] = useState("");
  const hours = Array.from({ length: 24 }, (_, index) => index);
  return (
    <form
      className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-2"
      action={async (form_data) => {
        const result = await save_lock(form_data);
        if (result.error) {
          set_error_message(result.error);
          return;
        }
        set_error_message("");
        router.refresh();
      }}
    >
      <label className="text-sm">
        Atendente
        <select name="staff_id" className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {staff.map((staff_member) => (
            <option key={staff_member.id} value={staff_member.id}>
              {staff_member.full_name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Tipo
        <select name="lock_type" className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {Object.values(LOCK_TYPE).map((lock_type) => (
            <option key={lock_type} value={lock_type}>
              {LOCK_TYPE_LABEL[lock_type]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm sm:col-span-2">
        Data
        <input type="date" name="lock_date" required className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        Início (se for horário)
        <div className="mt-1 flex gap-2">
          <select name="start_hour" defaultValue={8} className="w-full rounded-md border border-line px-2 py-1.5">
            {hours.map((hour) => (
              <option key={hour} value={hour}>{pad_two(hour)}</option>
            ))}
          </select>
          <select name="start_minute" className="w-full rounded-md border border-line px-2 py-1.5">
            {[0, 15, 30, 45].map((minute) => (
              <option key={minute} value={minute}>{pad_two(minute)}</option>
            ))}
          </select>
        </div>
      </label>
      <label className="text-sm">
        Fim (se for horário)
        <div className="mt-1 flex gap-2">
          <select name="end_hour" defaultValue={12} className="w-full rounded-md border border-line px-2 py-1.5">
            {hours.map((hour) => (
              <option key={hour} value={hour}>{pad_two(hour)}</option>
            ))}
          </select>
          <select name="end_minute" className="w-full rounded-md border border-line px-2 py-1.5">
            {[0, 15, 30, 45].map((minute) => (
              <option key={minute} value={minute}>{pad_two(minute)}</option>
            ))}
          </select>
        </div>
      </label>
      <label className="text-sm sm:col-span-2">
        Motivo (opcional)
        <input name="note" className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      {error_message ? <p className="text-sm text-danger">{error_message}</p> : null}
      <button type="submit" className="w-fit rounded-md bg-ink px-4 py-2 text-white">
        Travar agenda
      </button>
    </form>
  );
}

export function Unlock_Button({ lock_id }: { lock_id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm text-danger"
      onClick={async () => {
        await delete_lock(lock_id);
        router.refresh();
      }}
    >
      Liberar
    </button>
  );
}
