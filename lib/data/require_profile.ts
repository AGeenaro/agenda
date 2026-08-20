import type { Profile_Row } from "@/lib/data/row_types";
import { create_server_client } from "@/lib/supabase/server_client";
import { redirect } from "next/navigation";

export async function require_profile(): Promise<Profile_Row> {
  const supabase = await create_server_client();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .single();
  if (error || !data || !data.is_active) {
    redirect("/login");
  }
  return data as Profile_Row;
}
