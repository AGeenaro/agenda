import type { Client_Row } from "@/lib/data/row_types";
import { create_server_client } from "@/lib/supabase/server_client";

export async function load_clients(): Promise<Client_Row[]> {
  const supabase = await create_server_client();
  const { data } = await supabase
    .from("clients")
    .select("id, full_name, phone, email, notes")
    .order("full_name");
  return (data ?? []) as Client_Row[];
}
