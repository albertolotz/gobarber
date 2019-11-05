import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Queue from '../../lib/Queue';
import User from '../models/User';
import File from '../models/file';
import Appointment from '../models/appointment';
import Notification from '../schemas/notification';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  // metodo index = listgem
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'nome'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: [('id', 'path', 'url')],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  // metodo store = inclui
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'dados inválidos!' });
    }

    const { provider_id, date } = req.body;

    // check se provider_id é um provider

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Agendamento apenas possivl com prestador!' });
    }

    // verificação de data informada não é anterios a atual.
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Data Passada não é permitida!' });
    }

    // verifica se já existe alguma agenda para o horário
    const checkAvalability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvalability) {
      return res
        .status(400)
        .json({ error: 'Já existe agendamento para este horário!' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    // notificar prestador de serviço
    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia' dd 'de' MMMM',às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.nome} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  // metodo delete para cancelar um agendamento
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nome'],
        },
        {
          model: User,
          as: 'provider',
          attributes: ['nome', 'email'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Agendamento não pertence ao usuário logado' });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'Cancelamento não é possivel, limite 2h exedido' });
    }

    appointment.canceled_at = new Date();
    await appointment.save();
    await Queue.add(CancellationMail.key, {
      appointment,
    });
    return res.json(appointment);
  } // end of delete metodo
} // end of class AppointmentController

export default new AppointmentController();
