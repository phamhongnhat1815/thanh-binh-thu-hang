import { readFile } from "node:fs/promises";
import path from "node:path";
import Wedding from "../../components/Wedding";
import events from "../../lib/invitation-events.json";
export default async function Page() {
  const html = await readFile(
    path.join(process.cwd(), "lib/invitation.html"),
    "utf8",
  );
  return (
    <>
      <link rel="stylesheet" href="/invitation.css" />
      <Wedding html={html} events={events} />
    </>
  );
}
