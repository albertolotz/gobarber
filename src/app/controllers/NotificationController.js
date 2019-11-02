import User from '../models/User';
import Notification from '../schemas/notification';

class NotificationController {
  async index(req, res) {
    // check se provider_id é um provider

    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Apenas prestadores podem receber nofificação!' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  // atualiza status
  async update(req, res) {
    console.log(req.params.id);
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notification);
  }
} // end of NotificationController

export default new NotificationController();
