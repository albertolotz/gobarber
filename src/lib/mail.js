import NodeMailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = NodeMailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  } // end of constructor

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
} // end of mail

export default new Mail();
