export const LOCK_TYPE = Object.freeze({
  FULL_DAY: "full_day",
  TIME_SLOT: "time_slot",
});

export type Lock_Type = (typeof LOCK_TYPE)[keyof typeof LOCK_TYPE];

export const LOCK_TYPE_LABEL: Record<Lock_Type, string> = Object.freeze({
  [LOCK_TYPE.FULL_DAY]: "Dia inteiro",
  [LOCK_TYPE.TIME_SLOT]: "Horário",
});
