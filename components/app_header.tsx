import { sign_out } from "@/lib/actions/sign_out";
import type { Profile_Row } from "@/lib/data/row_types";
import { USER_ROLE_LABEL } from "@/lib/user_roles";
import Link from "next/link";

const LINKS = [
  { href: "/agenda", label: "Agenda" },
  { href: "/clientes", label: "Clientes" },
  { href: "/bloqueios", label: "Bloqueios" },
  { href: "/relatorio", label: "Relatório" },
  { href: "/equipe", label: "Equipe" },
];

export function App_Header({ profile }: { profile: Profile_Row }) {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/agenda" className="text-lg font-semibold text-ink">
          Agenda
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm text-stone-600">
          <span>
            {profile.full_name} · {USER_ROLE_LABEL[profile.role]}
          </span>
          <form action={sign_out}>
            <button type="submit" className="text-ink-soft hover:text-ink">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
