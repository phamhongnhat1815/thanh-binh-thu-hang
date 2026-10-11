import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { rsvpEmail, sendRsvpEmail } from "../lib/rsvp-email.ts";

const env = {
  GMAIL_USER: "sender@example.com",
  GMAIL_APP_PASSWORD: "test-only",
  GROOM_EMAIL: "groom@example.com",
  BRIDE_EMAIL: "bride@example.com",
};
const rsvp = {
  name: "Khách thử",
  message: "<script>test</script>\nLời chúc thử",
  attendance: "Tôi chắc chắn sẽ đến",
  guests: 2,
};
const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
for (const [side, recipient, label] of [
  ["Khách mời Chú Rể", env.GROOM_EMAIL, "chú rể"],
  ["Khách mời Cô Dâu", env.BRIDE_EMAIL, "cô dâu"],
]) {
  const mail = rsvpEmail({ ...rsvp, side }, env);
  assert.equal(mail.to, recipient);
  assert.ok(mail.subject.includes(label));
  assert.ok(mail.text.includes("Số người: 2"));
  const result = await transport.sendMail(mail);
  assert.deepEqual(result.envelope.to, [recipient]);
  assert.ok(result.message.toString().includes("Content-Type: text/plain"));
}
assert.throws(() => rsvpEmail({ ...rsvp, side: "Khách mời Cô Dâu" }, {}));
const previous = process.env.RSVP_EMAIL_ENABLED;
process.env.RSVP_EMAIL_ENABLED = "false";
assert.equal(await sendRsvpEmail({ ...rsvp, side: "Khách mời Chú Rể" }), "disabled");
if (previous === undefined) delete process.env.RSVP_EMAIL_ENABLED;
else process.env.RSVP_EMAIL_ENABLED = previous;
console.log("PASS recipient routing, email content, missing configuration and disabled mode; no email sent.");
