import { Login_Form } from "@/app/login/login_form";
import { is_supabase_configured } from "@/lib/env";
import { redirect } from "next/navigation";

export default function Login_Page() {
  if (!is_supabase_configured()) {
    redirect("/configurar");
  }
  return (
    <main className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-ink-soft">Acesso da equipe</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">Agenda</h1>
        <p className="mt-2 text-sm text-stone-600">
          Use o e-mail e a senha que já foram cadastrados.
        </p>
        <Login_Form />
      </div>
    </main>
  );
}
