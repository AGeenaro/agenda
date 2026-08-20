import { describe, expect, it } from "vitest";
import { APPOINTMENT_STATUS } from "@/lib/appointment_status";
import { can_book } from "@/lib/booking_rules";
import type { Booking_Appointment, Booking_Lock } from "@/lib/booking_types";
import { LOCK_TYPE } from "@/lib/lock_types";

const staff_id = "staff-1";
const calendar_date = "2026-08-20";
const starts_at = new Date("2026-08-20T14:00:00.000-03:00");

function scheduled(): Booking_Appointment {
  return {
    id: "apt-1",
    staff_id,
    starts_at: "2026-08-20T14:00:00.000-03:00",
    duration_minutes: 30,
    status: APPOINTMENT_STATUS.SCHEDULED,
  };
}

describe("can_book", () => {
  it("allows a free unlocked slot", () => {
    const result = can_book({
      staff_id,
      starts_at,
      duration_minutes: 30,
      calendar_date,
      locks: [],
      appointments: [],
    });
    expect(result.allowed).toBe(true);
  });

  it("rejects a slot that overlaps an existing appointment", () => {
    const result = can_book({
      staff_id,
      starts_at: new Date("2026-08-20T14:15:00.000-03:00"),
      duration_minutes: 30,
      calendar_date,
      locks: [],
      appointments: [scheduled()],
    });
    expect(result.allowed).toBe(false);
  });

  it("allows booking next to an appointment that already ended", () => {
    const result = can_book({
      staff_id,
      starts_at: new Date("2026-08-20T14:30:00.000-03:00"),
      duration_minutes: 30,
      calendar_date,
      locks: [],
      appointments: [scheduled()],
    });
    expect(result.allowed).toBe(true);
  });

  it("ignores cancelled appointments", () => {
    const cancelled = {
      ...scheduled(),
      status: APPOINTMENT_STATUS.CANCELLED,
    };
    const result = can_book({
      staff_id,
      starts_at,
      duration_minutes: 30,
      calendar_date,
      locks: [],
      appointments: [cancelled],
    });
    expect(result.allowed).toBe(true);
  });
});

describe("can_book locks", () => {
  it("rejects a full-day lock for that staff", () => {
    const calendar_lock: Booking_Lock = {
      staff_id,
      lock_type: LOCK_TYPE.FULL_DAY,
      lock_date: calendar_date,
      starts_at: null,
      ends_at: null,
    };
    const result = can_book({
      staff_id,
      starts_at,
      duration_minutes: 45,
      calendar_date,
      locks: [calendar_lock],
      appointments: [],
    });
    expect(result.allowed).toBe(false);
  });

  it("rejects a time-slot lock that overlaps", () => {
    const calendar_lock: Booking_Lock = {
      staff_id,
      lock_type: LOCK_TYPE.TIME_SLOT,
      lock_date: null,
      starts_at: "2026-08-20T13:00:00.000-03:00",
      ends_at: "2026-08-20T16:00:00.000-03:00",
    };
    const result = can_book({
      staff_id,
      starts_at,
      duration_minutes: 30,
      calendar_date,
      locks: [calendar_lock],
      appointments: [],
    });
    expect(result.allowed).toBe(false);
  });

  it("allows another staff member when one agenda is locked", () => {
    const calendar_lock: Booking_Lock = {
      staff_id,
      lock_type: LOCK_TYPE.FULL_DAY,
      lock_date: calendar_date,
      starts_at: null,
      ends_at: null,
    };
    const result = can_book({
      staff_id: "staff-2",
      starts_at,
      duration_minutes: 30,
      calendar_date,
      locks: [calendar_lock],
      appointments: [],
    });
    expect(result.allowed).toBe(true);
  });
});
