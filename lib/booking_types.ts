import type { Appointment_Status } from "@/lib/appointment_status";
import type { Lock_Type } from "@/lib/lock_types";

export type Booking_Lock = {
  staff_id: string;
  lock_type: Lock_Type;
  lock_date: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

export type Booking_Appointment = {
  id: string;
  staff_id: string;
  starts_at: string;
  duration_minutes: number;
  status: Appointment_Status;
};

export type Can_Book_Input = {
  staff_id: string;
  starts_at: Date;
  duration_minutes: number;
  calendar_date: string;
  locks: Booking_Lock[];
  appointments: Booking_Appointment[];
  exclude_appointment_id?: string;
};

export type Can_Book_Result =
  | { allowed: true }
  | { allowed: false; reason: string };
