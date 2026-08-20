"use server";

import type { Action_Result } from "@/lib/actions/action_result";
import { require_profile } from "@/lib/data/require_profile";
import { USER_ROLE } from "@/lib/user_roles";
import { createClient } from "@supabase/supabase-js";

export async function create_team_user(
  form_data: FormData,
): Promise<Action_Result> {
  const profile = await require_profile();
  if (profile.role !== USER_ROLE.ADMIN) {
    return { error: "Só o admin pode criar logins." };
  }
  const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!service_role || !url) {
    return {
      error:
        "Falta SUPABASE_SERVICE_ROLE_KEY. Crie o usuário no painel do Supabase.",
    };
  }
  const email = String(form_data.get("email") ?? "").trim();
  const password = String(form_data.get("password") ?? "");
  const full_name = String(form_data.get("full_name") ?? "").trim();
  const role = String(form_data.get("role") ?? "staff");
  if (!email || !password || !full_name) {
    return { error: "Preencha nome, e-mail e senha." };
  }
  const admin = createClient(url, service_role, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}
