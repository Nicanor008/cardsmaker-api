const nodemailer = require("nodemailer");

const from = '"CardsMaker" <shomancodes@gmail.com>';

function setup() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "Gmail",
    sendmail: true,
    auth: {
      user: "shomancodes@gmail.com",
      pass: "ShomanCodes@2020",
    },
    force: true,
  });
}

exports.sendConfirmEmail = async (data) => {
  const transport = setup();
  const userEmail = data.email;
  const generateConfirmationUrl = `https://todo.reachlyonline.com/verify/${userEmail}`;

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

  transport.sendMail(msg).then(res => {
    console.log(res)
  });

  await transport.sendMail(msg, function(error, info) {
    if(error) {
        console.log(data.email, 'Email couldnt be sent.\n', error.response);
    } else {
        console.log(data.email, 'Email sent: ' + info.response);
    }
  })
};

// password reset
exports.emailPasswordResetLink = (data) => {
  const transport = setup();
  const userEmail = data.email;
  const generateConfirmationUrl = `http://todo.reachlyonline.com/reset-password/${userEmail}`;
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
