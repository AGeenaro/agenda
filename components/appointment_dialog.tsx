"use client";

import {
  delete_appointment,
  save_appointment,
} from "@/lib/actions/save_appointment";
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABEL } from "@/lib/appointment_status";
import type { Appointment_Row, Client_Row, Profile_Row } from "@/lib/data/row_types";
import { pad_two } from "@/lib/agenda_layout";
import { minutes_from_midnight_sao_paulo } from "@/lib/sao_paulo_date";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Draft = {
  appointment?: Appointment_Row;
  staff_id: string;
  hour: number;
  minute: number;
};

const DURATIONS = [15, 30, 45, 60, 90, 120, 180];

export function Appointment_Dialog({
  calendar_date,
  staff,
  clients,
  draft,
  on_close,
}: {
  calendar_date: string;
  staff: Profile_Row[];
  clients: Client_Row[];
  draft: Draft;
  on_close: () => void;
}) {
  const router = useRouter();
  const [error_message, set_error_message] = useState("");
  const appointment = draft.appointment;
  const start_minutes = appointment
    ? minutes_from_midnight_sao_paulo(new Date(appointment.starts_at))
    : draft.hour * 60 + draft.minute;
  const hour = Math.floor(start_minutes / 60);
  const minute = start_minutes % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4">
      <form
        className="w-full max-w-lg rounded-xl bg-card p-5 shadow-xl"
        action={async (form_data) => {
          const result = await save_appointment(form_data);
          if (result.error) {
            set_error_message(result.error);
            return;
          }
          on_close();
          router.refresh();
        }}
      >
        <h2 className="text-lg font-semibold text-ink">
          {appointment ? "Editar atendimento" : "Novo atendimento"}
        </h2>
        <input type="hidden" name="appointment_id" value={appointment?.id ?? ""} />
        <input type="hidden" name="calendar_date" value={calendar_date} />
        <Appointment_Fields
          staff={staff}
          clients={clients}
          appointment={appointment}
          default_staff_id={draft.staff_id}
          hour={hour}
          minute={minute}
          calendar_date={calendar_date}
        />
        {error_message ? (
          <p className="mt-3 text-sm text-danger">{error_message}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="submit" className="rounded-md bg-ink px-4 py-2 text-white">
            Salvar
          </button>
          <button type="button" onClick={on_close} className="rounded-md border border-line px-4 py-2">
            Cancelar
          </button>
          {appointment ? (
            <button
              type="button"
              className="ml-auto text-sm text-danger"
              onClick={async () => {
                await delete_appointment(appointment.id);
                on_close();
                router.refresh();
              }}
            >
              Excluir
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function Appointment_Fields({
  staff,
  clients,
  appointment,
  default_staff_id,
  hour,
  minute,
  calendar_date,
}: {
  staff: Profile_Row[];
  clients: Client_Row[];
  appointment?: Appointment_Row;
  default_staff_id: string;
  hour: number;
  minute: number;
  calendar_date: string;
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="text-sm">
        Quem atende
        <select name="staff_id" defaultValue={default_staff_id} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {staff.map((staff_member) => (
            <option key={staff_member.id} value={staff_member.id}>
              {staff_member.full_name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Cliente cadastrado
        <select name="client_id" defaultValue={appointment?.client_id ?? ""} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          <option value="">Encaixe sem cadastro</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.full_name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm sm:col-span-2">
        Nome do encaixe (se não houver cadastro)
        <input name="walk_in_name" defaultValue={appointment?.walk_in_name ?? ""} className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        Telefone de contato
        <input name="contact_phone" defaultValue={appointment?.contact_phone ?? appointment?.walk_in_phone ?? ""} className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        Data de entrada
        <input type="date" name="entry_date" defaultValue={appointment?.entry_date ?? calendar_date} className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
      <label className="text-sm">
        Hora
        <select name="hour" defaultValue={hour} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {Array.from({ length: 24 }, (_, index) => (
            <option key={index} value={index}>{pad_two(index)}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Minuto
        <select name="minute" defaultValue={minute} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {[0, 15, 30, 45].map((value) => (
            <option key={value} value={value}>{pad_two(value)}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Duração
        <select name="duration_minutes" defaultValue={appointment?.duration_minutes ?? 30} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {DURATIONS.map((value) => (
            <option key={value} value={value}>{value} min</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Status
        <select name="status" defaultValue={appointment?.status ?? APPOINTMENT_STATUS.SCHEDULED} className="mt-1 w-full rounded-md border border-line px-2 py-1.5">
          {Object.values(APPOINTMENT_STATUS).map((status) => (
            <option key={status} value={status}>{APPOINTMENT_STATUS_LABEL[status]}</option>
          ))}
        </select>
      </label>
      <label className="text-sm sm:col-span-2">
        Descrição do atendimento (opcional)
        <textarea name="description" rows={3} defaultValue={appointment?.description ?? ""} className="mt-1 w-full rounded-md border border-line px-2 py-1.5" />
      </label>
    </div>
  );
}
