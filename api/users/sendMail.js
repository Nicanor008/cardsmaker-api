const nodemailer = require("nodemailer");

const from = '"CardsMaker" <cardsmaker.com>';

function setup() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

exports.sendConfirmEmail = (data) => {
  const transport = setup();
  const userEmail = data.email;
  const generateConfirmationUrl = `http://localhost:4001/auth/verify/${userEmail}`;

  const msg = {
    from,
    to: userEmail,
    subject: "Activate your account",
    text: `
    Welcome to Cards Makers inc. We are very happy to have you here. Activate your account.
    `,
    html: `
      <h2 style="display: flex; align-items: center;">Welcome to Cards Maker Inc</h2>
        <p>Please activate your account using <a href=${generateConfirmationUrl}>this link</a>
         🎊 🎉 🚀</p>
    `,
  };
  transport.sendMail(msg);
};

// password reset
exports.emailPasswordResetLink = (data) => {
  const transport = setup();
  const userEmail = data.email;
  const generateConfirmationUrl = `http://localhost:4001/auth/password-reset/${userEmail}`;

  const msg = {
    from,
    to: userEmail,
    subject: "Reset password",
    text: `
    Welcome to Cards Makers inc. We are very happy to have you here. Reset password.
    `,
    html: `
      <h2 style="display: flex; align-items: center;">Welcome to Cards Maker Inc</h2>
        <p>Please Reset password using <a href=${generateConfirmationUrl}>this link</a>
         🎊 🎉 🚀</p>
    `,
  };
  return transport.sendMail(msg);
};
