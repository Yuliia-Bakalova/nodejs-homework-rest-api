const { USER_EMAIL, USER_EMAIL_PASS } = process.env;
const nodemailer = require("nodemailer");


function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

async function sendMail({ to, subject, html }) {
  const email = {
    from: "info-email@gmail.com",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: USER_EMAIL,
      pass: USER_EMAIL_PASS,
    },
  });

  await transport.sendMail(email);
}

module.exports = {
  tryCatchWrapper,
    sendMail
};