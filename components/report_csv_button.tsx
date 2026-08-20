"use client";

import { appointment_person_name } from "@/lib/appointment_person_name";
import { APPOINTMENT_STATUS_LABEL } from "@/lib/appointment_status";
import type { Appointment_Row, Profile_Row } from "@/lib/data/row_types";
import { format_display_date, format_display_time } from "@/lib/sao_paulo_date";

export function Report_Csv_Button({
  appointments,
  staff,
}: {
  appointments: Appointment_Row[];
  staff: Profile_Row[];
}) {
  function download() {
    const header = [
      "Data",
      "Horário",
      "Atendente",
      "Cliente",
      "Contato",
      "Entrada",
      "Descrição",
      "Status",
    ];
    const lines = appointments.map((appointment) => {
      const owner = staff.find((row) => row.id === appointment.staff_id);
      const start = new Date(appointment.starts_at);
      return [
        format_display_date(start),
        format_display_time(start),
        owner?.full_name ?? "",
        appointment_person_name(appointment),
        appointment.contact_phone ?? appointment.walk_in_phone ?? "",
        appointment.entry_date,
        (appointment.description ?? "").replaceAll(";", ","),
        APPOINTMENT_STATUS_LABEL[appointment.status],
      ];
    });
    const csv = [header, ...lines]
      .map((row) => row.map((cell) => `"${cell}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio-agenda.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button
      type="button"
      onClick={download}
      className="rounded-md border border-line px-3 py-1.5 text-sm"
    >
      Baixar CSV
    </button>
  );
}
