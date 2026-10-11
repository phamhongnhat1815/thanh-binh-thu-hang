import { NextResponse } from "next/server";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sendRsvpEmail } from "../../../lib/rsvp-email";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const file = path.join(
  process.env.WEDDING_DATA_DIR || path.join(process.cwd(), "data"),
  "wishes.jsonl",
);
async function wishes() {
  try {
    return (await readFile(file, "utf8"))
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .filter((w) => w.message)
      .reverse()
      .map(({ name, message }) => ({ name, message }));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
export async function GET() {
  return NextResponse.json(await wishes(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function POST(request: Request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  const {
    name,
    message,
    form_item7: attendance,
    form_item9: side,
    guests,
  } = data;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    typeof message !== "string" ||
    message.length > 2000 ||
    !["Tôi chắc chắn sẽ đến", "Xin lỗi, Tôi bận rồi!"].includes(attendance) ||
    !["Khách mời Cô Dâu", "Khách mời Chú Rể"].includes(side) ||
    (attendance !== "Xin lỗi, Tôi bận rồi!" && guests !== "" &&
      (typeof guests !== "string" ||
      (!Number.isInteger(Number(guests)) ||
        Number(guests) < 1 ||
        Number(guests) > 20)))
  )
    return NextResponse.json(
      { error: "Vui lòng kiểm tra thông tin xác nhận." },
      { status: 400 },
    );
  const guestCount = attendance === "Xin lỗi, Tôi bận rồi!" ? "" : guests ? Number(guests) : 1;
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(
    file,
    JSON.stringify({
      name: name.trim(),
      message: message.trim(),
      attendance,
      side,
      guests: guestCount,
      createdAt: new Date().toISOString(),
    }) + "\n",
  );
  let emailStatus: "sent" | "disabled" | "failed";
  try {
    emailStatus = await sendRsvpEmail({
      name: name.trim(),
      message: message.trim(),
      attendance,
      side,
      guests: guestCount,
    });
  } catch {
    // Keep the saved RSVP even when Gmail is unavailable; do not log credentials.
    console.error("RSVP saved, but email notification failed.");
    emailStatus = "failed";
  }
  return NextResponse.json({ wishes: await wishes(), emailStatus }, { status: 201 });
}
