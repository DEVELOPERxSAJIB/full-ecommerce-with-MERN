import nodemailer from "nodemailer";

// send a mail with define transporter object {
const emailWithNodemailer = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
    });

    
    const mailOptions = {
      from: '"DOCCURE" <sajibshikder78971@gmail.com>',
      to: emailData.email,
      subject: emailData.subject,
      text: "DOCCURE",
      html: emailData.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(`This message from sendEmail ${error.message}`);
    throw error;
  }
};

export default emailWithNodemailer;
