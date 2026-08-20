"use server";

import { create_server_client } from "@/lib/supabase/server_client";
import { redirect } from "next/navigation";

export async function sign_out(): Promise<void> {
  const supabase = await create_server_client();
  await supabase.auth.signOut();
  redirect("/login");
}
