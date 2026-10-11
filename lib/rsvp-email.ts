import nodemailer from "nodemailer";

type Rsvp = {
  name: string;
  message: string;
  attendance: string;
  side: string;
  guests: number | "";
};

export function rsvpEmail(rsvp: Rsvp, env = process.env) {
  const groom = rsvp.side === "Khách mời Chú Rể";
  const recipient = groom ? env.GROOM_EMAIL : env.BRIDE_EMAIL;
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD || !recipient)
    throw new Error("Missing Gmail SMTP configuration");
  return {
    from: { name: "Thiệp cưới Thanh Bình & Thu Hằng", address: env.GMAIL_USER },
    to: recipient,
    subject: `Xác nhận tham dự — Khách ${groom ? "chú rể" : "cô dâu"}`,
    text: [
      `Tên khách: ${rsvp.name}`,
      `Khách của: ${groom ? "Chú rể" : "Cô dâu"}`,
      `Tham dự: ${rsvp.attendance}`,
      `Số người: ${rsvp.guests}`,
      "",
      "Lời nhắn:",
      rsvp.message || "(Không có lời nhắn)",
    ].join("\n"),
  };
}

export async function sendRsvpEmail(rsvp: Rsvp) {
  // Email is opt-in until the local/Vercel environment is configured.
  if (process.env.RSVP_EMAIL_ENABLED !== "true") return "disabled" as const;
  const mail = rsvpEmail(rsvp);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ""),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    const result = await transporter.sendMail(mail);
    if (!result.accepted.length || result.rejected.length)
      throw new Error("SMTP rejected recipient");
    return "sent" as const;
  } finally {
    transporter.close();
  }
}
