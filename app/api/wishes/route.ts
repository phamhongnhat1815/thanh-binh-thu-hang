import { NextResponse } from "next/server";
import { sendRsvpEmail } from "../../../lib/rsvp-email";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json([], {
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
  try {
    const emailStatus = await sendRsvpEmail({
      name: name.trim(),
      message: message.trim(),
      attendance,
      side,
      guests: guestCount,
    });
    if (emailStatus !== "sent") {
      return NextResponse.json(
        { error: "Tính năng gửi xác nhận chưa được bật. Vui lòng thử lại sau." },
        { status: 503 },
      );
    }
  } catch (error) {
    // Log only diagnostic codes; never credentials or form contents.
    const diagnostic = error as { code?: string; responseCode?: number };
    console.error("RSVP email failed", {
      code: diagnostic.code || "SMTP_CONFIGURATION_OR_DELIVERY_ERROR",
      responseCode: diagnostic.responseCode,
    });
    return NextResponse.json(
      { error: "Chưa gửi được email xác nhận. Vui lòng thử lại sau." },
      { status: 502 },
    );
  }
  return NextResponse.json({ emailStatus: "sent" }, { status: 201 });
}
