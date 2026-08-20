export default function Configurar_Page() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-ink-soft">Agenda</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">
        Configure o banco e o login
      </h1>
      <p className="mt-4 leading-7 text-stone-700">
        Este site ainda não tem as chaves do Supabase. Crie o projeto gratuito,
        rode o SQL da pasta <code className="rounded bg-white px-1">supabase/</code>{" "}
        e coloque as variáveis no Vercel. O passo a passo está no README do
        GitHub.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-stone-700">
        <li>Abra supabase.com e crie um projeto.</li>
        <li>Cole as migrations em SQL Editor.</li>
        <li>
          No Vercel, adicione <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </li>
        <li>Faça um novo deploy.</li>
      </ol>
    </main>
  );
}
