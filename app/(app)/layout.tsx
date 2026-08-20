import { App_Header } from "@/components/app_header";
import { require_profile } from "@/lib/data/require_profile";

export const dynamic = "force-dynamic";

export default async function App_Shell_Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await require_profile();
  return (
    <div className="min-h-full">
      <App_Header profile={profile} />
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </div>
  );
}
