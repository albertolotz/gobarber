export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: false,
  default: {
    from: 'GoBarger Robot<noreplay@gobarber.com>',
  },
};

// mail trap.io
// https://mailtrap.io/inboxes#
