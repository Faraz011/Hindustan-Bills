// src/utils/emailService.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvoiceEmail = async (to, subject, text, attachmentPath) => {
  try {
    const result = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      text,
      attachments: [
        {
          filename: attachmentPath.split("/").pop(),
          path: attachmentPath,
        },
      ],
    });

    console.log(`📩 Invoice sent to ${to}`);
    return result;
  } catch (err) {
    console.error("❌ Failed to send invoice via Resend:", err);
  }
};
