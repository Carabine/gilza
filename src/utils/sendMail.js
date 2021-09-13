const nodemailer = require('nodemailer');

const sendMail = async (recipient, body, title) => {

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        },
        tls: {rejectUnauthorized: false}
    });
      
      
    await transporter.sendMail({
        from: `"Gilza" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: "Gilza",
        text: title,
        html: body
    })

}

module.exports = sendMail