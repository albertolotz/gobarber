import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.nome}<${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancelation',
      context: {
        provider: appointment.provider.nome,
        user: appointment.user.nome,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM',às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    }); // end of sendMail
  } // end of handle
} // end of class CancellationMail

export default new CancellationMail();
