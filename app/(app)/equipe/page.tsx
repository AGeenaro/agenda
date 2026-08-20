import { Team_User_Form } from "@/components/team_user_form";
import { require_profile } from "@/lib/data/require_profile";
import { USER_ROLE, USER_ROLE_LABEL } from "@/lib/user_roles";
import { create_server_client } from "@/lib/supabase/server_client";

export default async function Equipe_Page() {
  const profile = await require_profile();
  const supabase = await create_server_client();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .order("full_name");
  const people = data ?? [];
  const can_create = profile.role === USER_ROLE.ADMIN;
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Equipe</h1>
      <section className="overflow-auto rounded-xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-stone-500">
            <tr>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">Papel</th>
              <th className="px-3 py-2">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b border-line/70">
                <td className="px-3 py-2">{person.full_name}</td>
                <td className="px-3 py-2">
                  {USER_ROLE_LABEL[person.role as keyof typeof USER_ROLE_LABEL]}
                </td>
                <td className="px-3 py-2">{person.is_active ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {can_create ? (
        <div>
          <h2 className="mb-3 font-medium text-ink">Novo login</h2>
          <Team_User_Form />
        </div>
      ) : (
        <p className="text-sm text-stone-600">
          Só o admin cria logins. Sem a chave service_role, crie no painel do
          Supabase (veja o README).
        </p>
      )}
    </main>
  );
}
