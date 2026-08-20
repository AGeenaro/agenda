import type { Profile_Row } from "@/lib/data/row_types";
import { create_server_client } from "@/lib/supabase/server_client";

export async function load_staff(): Promise<Profile_Row[]> {
  const supabase = await create_server_client();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("is_active", true)
    .order("full_name");
  return (data ?? []) as Profile_Row[];
}
