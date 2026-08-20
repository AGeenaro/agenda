# Agenda

Internal team calendar: register clients (or book a walk-in), place them on staff agendas, lock a full day or a time range, see appointment warnings, and export a date-filtered report. Login is email and password created in advance. There is no public signup.

## How to install

```bash
git clone https://github.com/AGeenaro/agenda.git
cd agenda
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Supabase URL and anon key, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

- **Agenda** — day view for the whole team (00:00–24:00, 15-minute grid). Click a free slot to book. Duration is chosen per appointment.
- **Clientes** — optional pre-registration. You can also book a walk-in with only a name.
- **Bloqueios** — lock a full day or a time range so reception cannot fit anyone there.
- **Relatório** — filter by date range and download CSV.
- **Equipe** — admin can create logins if `SUPABASE_SERVICE_ROLE_KEY` is set.

Demo emails (create them in Supabase Auth, then run `supabase/seed_demo_roles.sql`):

- `admin@example.com` — Admin
- `recepcao@example.com` — Recepção
- `atendente@example.com` — Atendente

Choose your own passwords in the Supabase dashboard. Do not commit passwords.

## Requirements

- Node.js 20+
- A free [Supabase](https://supabase.com) project (Postgres + Auth)
- A free [Vercel](https://vercel.com) account linked to GitHub (for the public URL)

## Dependencies

- Next.js, React
- Tailwind CSS
- `@supabase/ssr` and `@supabase/supabase-js`
- Vitest (booking and lock rules)

## Hosting (zero cost) — do this once

You do this in the browser. I cannot log into your Vercel or Supabase. When you finish, send me the two public keys if anything fails.

### A) Supabase (database + login)

1. Go to [https://supabase.com](https://supabase.com) and sign in with GitHub.
2. **New project**. Name: `agenda`. Password: generate and save it (database password, not app login). Region: South America (São Paulo) if listed.
3. Wait until the project is ready.
4. Open **SQL Editor** → New query. Paste the entire file [`supabase/setup.sql`](supabase/setup.sql) → **Run**.
5. **Authentication → Providers → Email**: enable Email. Turn **off** “Confirm email” for this internal tool.
6. **Authentication → Sign Up / URL configuration**: disable public sign-ups if the toggle exists (Settings → Auth → disable “Allow new users to sign up”).
7. **Authentication → Users → Add user** (create three users, auto-confirm):
   - `admin@example.com`
   - `recepcao@example.com`
   - `atendente@example.com`
   - Set a password you will remember for each.
8. SQL Editor again: paste [`supabase/seed_demo_roles.sql`](supabase/seed_demo_roles.sql) → **Run**.
9. **Project Settings → API**. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (secret; only for creating users from the Equipe screen)

### B) Vercel (site + URL)

1. Go to [https://vercel.com](https://vercel.com) → **Continue with GitHub**.
2. **Add New… → Project** → import `AGeenaro/agenda`.
3. Framework: Next.js (detected).
4. **Environment Variables** (Production, Preview, Development):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (optional) |

5. **Deploy**.
6. **Settings → Domains**: add `savaris-adv.vercel.app` if it is free. If it is taken, pick another `something.vercel.app`.
7. Open the URL, log in with `admin@example.com` and the password you set.

After this, every push to `main` on GitHub updates the live site.

### What you send me if it breaks

- The live URL
- Screenshot of the Vercel build log if the deploy is red
- Confirm the SQL ran without errors

Never send the `service_role` key in a public chat if you can avoid it; it bypasses security.

## Tests

```bash
npm test
npm run lint
```
