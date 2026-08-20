import { Client_Form } from "@/components/client_form";
import { load_clients } from "@/lib/data/load_clients";
import { require_profile } from "@/lib/data/require_profile";

export default async function Clientes_Page() {
  await require_profile();
  const clients = await load_clients();
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Clientes</h1>
      <Client_Form />
      <section className="overflow-auto rounded-xl border border-line bg-card">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-line text-stone-500">
            <tr>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">Telefone</th>
              <th className="px-3 py-2">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-line/70">
                <td className="px-3 py-2">{client.full_name}</td>
                <td className="px-3 py-2">{client.phone ?? "—"}</td>
                <td className="px-3 py-2">{client.email ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 ? (
          <p className="px-3 py-6 text-sm text-stone-500">
            Nenhum cliente ainda. Cadastre acima ou encaixe só com o nome na agenda.
          </p>
        ) : null}
      </section>
    </main>
  );
}
