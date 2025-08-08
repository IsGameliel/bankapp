export const dynamic = 'force-dynamic'; // Opt out of Edge Runtime

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'mailtrap', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Banking App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is:</p><h2>${otp}</h2><p>This code expires in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
