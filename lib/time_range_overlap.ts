export function ranges_overlap(
  first_start: Date,
  first_end: Date,
  second_start: Date,
  second_end: Date,
): boolean {
  return first_start < second_end && second_start < first_end;
}
