import type { Lock_Row } from "@/lib/data/row_types";
import { create_server_client } from "@/lib/supabase/server_client";

export async function load_locks(): Promise<Lock_Row[]> {
  const supabase = await create_server_client();
  const { data } = await supabase
    .from("calendar_locks")
    .select("id, staff_id, lock_type, lock_date, starts_at, ends_at, note")
    .order("created_at", { ascending: false })
    .limit(80);
  return (data ?? []) as Lock_Row[];
}
