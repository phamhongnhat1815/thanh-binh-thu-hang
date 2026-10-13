import { readFile } from "node:fs/promises";
import path from "node:path";
import HomeCover from "../components/HomeCover";
export default async function Page() {
  const html = await readFile(
    path.join(process.cwd(), "lib/cover.html"),
    "utf8",
  );
  return (
    <>
      <link rel="stylesheet" href="/cover.css" />
      <HomeCover html={html} />
    </>
  );
}
