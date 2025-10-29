import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-reply", async (req, res) => {
  const { to, subject, message } = req.body;
  console.log(to);
  if (!to || !message) {
    return res.status(400).json({ error: "Recipient email and message are required." });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another provider
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS  // your app password (not your actual password)
      }
    });

    const mailOptions = {
      from: `"EasyPetpuja Support" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject || "Reply from Admin",
      text: message
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Reply sent successfully via email." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: "Failed to send reply." });
  }
});

export default router;
