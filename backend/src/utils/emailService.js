// backend/src/utils/emailService.js
// Safe Resend wrapper — won't crash if RESEND_API_KEY is missing.
import dotenv from "dotenv";
dotenv.config();

let resendClient = null;

async function initResend() {
  try {
    // dynamic import so this module doesn't throw on import time when key missing
    const { default: Resend } = await import("resend");
    if (process.env.RESEND_API_KEY) {
      resendClient = new Resend(process.env.RESEND_API_KEY);
      console.log("✅ Resend initialized");
    } else {
      console.warn("⚠️ RESEND_API_KEY not set — email sending is disabled (fallback mode).");
    }
  } catch (err) {
    console.warn("⚠️ Resend import failed — email sending disabled. Error:", err && err.message ? err.message : err);
  }
}

// initialize asynchronously (does not block module import)
initResend();

/**
 * sendEmail({ to, subject, html, text })
 * - If RESEND_API_KEY is present, sends using Resend.
 * - If not present, logs a fallback message and returns a mock response so callers don't crash.
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!resendClient) {
    console.log(`[mail-fallback] to=${to} subject=${subject}`);
    return { ok: true, mocked: true };
  }

  try {
    const resp = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to,
      subject,
      html,
      text,
    });
    return resp;
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    throw err;
  }
}

export function isEmailEnabled() {
  return !!resendClient;
}
