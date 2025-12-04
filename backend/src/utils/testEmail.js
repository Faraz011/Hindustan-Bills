import {Resend} from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTestEmail = async () => {
  try {
    const email = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: "your_email@gmail.com",
      subject: "Test Email from Hindustan Bills",
      html: "<h1>Hello from Resend!</h1><p>This is a test email.</p>",
    });

    console.log("✅ Email sent:", email);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

sendTestEmail();
