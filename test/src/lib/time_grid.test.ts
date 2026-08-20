import { describe, expect, it } from "vitest";
import {
  build_day_slots,
  is_aligned_to_grid,
  is_valid_duration_minutes,
  SLOT_MINUTES,
  SLOTS_PER_DAY,
} from "@/lib/time_grid";

describe("time_grid", () => {
  it("accepts durations that are multiples of 15 minutes", () => {
    expect(is_valid_duration_minutes(15)).toBe(true);
    expect(is_valid_duration_minutes(45)).toBe(true);
    expect(is_valid_duration_minutes(10)).toBe(false);
    expect(is_valid_duration_minutes(0)).toBe(false);
  });

  it("aligns instants to the 15-minute grid", () => {
    expect(is_aligned_to_grid(new Date("2026-08-20T10:00:00.000Z"))).toBe(true);
    expect(is_aligned_to_grid(new Date("2026-08-20T10:07:00.000Z"))).toBe(
      false,
    );
  });

  it("builds 96 slots for a 24-hour day", () => {
    expect(SLOT_MINUTES).toBe(15);
    expect(build_day_slots()).toHaveLength(SLOTS_PER_DAY);
    expect(SLOTS_PER_DAY).toBe(96);
  });
});
