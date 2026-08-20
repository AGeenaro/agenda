import { describe, expect, it } from "vitest";
import { APPOINTMENT_STATUS } from "@/lib/appointment_status";
import { appointments_for_warning } from "@/lib/appointment_warnings";

describe("appointments_for_warning", () => {
  it("returns remaining scheduled appointments for today for that staff", () => {
    const now = new Date("2026-08-20T12:00:00.000-03:00");
    const warnings = appointments_for_warning(
      [
        {
          id: "1",
          staff_id: "staff-1",
          starts_at: "2026-08-20T15:00:00.000-03:00",
          duration_minutes: 30,
          status: APPOINTMENT_STATUS.SCHEDULED,
        },
        {
          id: "2",
          staff_id: "staff-1",
          starts_at: "2026-08-20T09:00:00.000-03:00",
          duration_minutes: 30,
          status: APPOINTMENT_STATUS.SCHEDULED,
        },
        {
          id: "3",
          staff_id: "staff-2",
          starts_at: "2026-08-20T15:00:00.000-03:00",
          duration_minutes: 30,
          status: APPOINTMENT_STATUS.SCHEDULED,
        },
      ],
      "staff-1",
      now,
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].id).toBe("1");
  });
});
