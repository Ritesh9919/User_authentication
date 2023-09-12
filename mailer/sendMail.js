const nodemailer = require('nodemailer');
const sendEmail = async function(name, email, origin, token) {
    const testAccount = nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'madge.shanahan81@ethereal.email',
          pass: 'svb6175XrDw92ytfx4'
      }
  });
      const resetUrl = `${origin}/users/reset-password/${token}`;
      const message = `<p>Please reset password by clicking on the following link : <a href="${resetUrl}">Reset Password</a></p>`;

    await transporter.sendMail({ // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        html: `<h4>Hello, ${name}</h4> ${message} `, // html body
      });
}


module.exports = sendEmail;