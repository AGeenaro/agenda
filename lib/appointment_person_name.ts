export function appointment_person_name(row: {
  walk_in_name: string | null;
  clients: { full_name: string } | { full_name: string }[] | null;
}): string {
  if (Array.isArray(row.clients) && row.clients[0]?.full_name) {
    return row.clients[0].full_name;
  }
  if (row.clients && !Array.isArray(row.clients) && row.clients.full_name) {
    return row.clients.full_name;
  }
  return row.walk_in_name ?? "Sem cadastro";
}
