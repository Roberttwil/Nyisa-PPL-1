const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendOTP = async (to, otp) => {
    const mailOptions = {
        from: `"Nyisa App" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Your OTP Code - Nyisa App',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #27AE60;">Your OTP Code</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="text-align: left; color: #333;">${otp}</h1>
          <p>This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>Nyisa Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
};

const sendBookingConfirmation = async (to, booking_code, total) => {
  const mailOptions = {
      from: `"Nyisa App" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Booking Confirmation - Nyisa App',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #27AE60;">Booking Confirmed</h2>
        <p>Hello,</p>
        <p>Thank you for your booking. Here are your details:</p>
        <ul>
          <li><strong>Booking Code:</strong> ${booking_code}</li>
          <li><strong>Total:</strong> Rp ${total.toLocaleString()}</li>
        </ul>
        <p>You can track your transaction in the app. Please show this code to the restaurant.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>Nyisa Team</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports =  { sendOTP, sendBookingConfirmation };