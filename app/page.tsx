import { readFile } from "node:fs/promises";
import path from "node:path";
import Wedding from "../components/Wedding";
import events from "../lib/cover-events.json";
export default async function Page() {
  const html = await readFile(
    path.join(process.cwd(), "lib/cover.html"),
    "utf8",
  );
  return (
    <>
      <link rel="stylesheet" href="/cover.css?v=20261028-open-smaller" />
      <Wedding html={html} events={events} cover />
    </>
  );
}
