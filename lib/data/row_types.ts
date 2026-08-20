import type { Appointment_Status } from "@/lib/appointment_status";
import type { Lock_Type } from "@/lib/lock_types";
import type { User_Role } from "@/lib/user_roles";

export type Profile_Row = {
  id: string;
  full_name: string;
  role: User_Role;
  is_active: boolean;
};

export type Client_Row = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export type Appointment_Row = {
  id: string;
  staff_id: string;
  client_id: string | null;
  walk_in_name: string | null;
  walk_in_phone: string | null;
  description: string | null;
  contact_phone: string | null;
  entry_date: string;
  starts_at: string;
  duration_minutes: number;
  status: Appointment_Status;
  clients:
    | { full_name: string; phone: string | null }
    | { full_name: string; phone: string | null }[]
    | null;
};

export type Lock_Row = {
  id: string;
  staff_id: string;
  lock_type: Lock_Type;
  lock_date: string | null;
  starts_at: string | null;
  ends_at: string | null;
  note: string | null;
};
