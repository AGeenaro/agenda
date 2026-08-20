export const APPOINTMENT_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  DONE: "done",
  CANCELLED: "cancelled",
});

export type Appointment_Status =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_STATUS_LABEL: Record<Appointment_Status, string> =
  Object.freeze({
    [APPOINTMENT_STATUS.SCHEDULED]: "Agendado",
    [APPOINTMENT_STATUS.DONE]: "Concluído",
    [APPOINTMENT_STATUS.CANCELLED]: "Cancelado",
  });
