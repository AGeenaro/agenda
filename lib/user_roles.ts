export const USER_ROLE = Object.freeze({
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  STAFF: "staff",
});

export type User_Role = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLE));

export const USER_ROLE_LABEL: Record<User_Role, string> = Object.freeze({
  [USER_ROLE.ADMIN]: "Admin",
  [USER_ROLE.RECEPTIONIST]: "Recepção",
  [USER_ROLE.STAFF]: "Atendente",
});
