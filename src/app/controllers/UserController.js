import User from '../models/User';
import File from '../models/file';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, nome, email, provider } = await User.create(req.body);
    return res.json({
      id,
      nome,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // confirma se email existe
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // verefica se senha antiga é igual a cadastrada
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not mach.' });
    }

    // atualiza dados se condições acima estivers falsa.
    await user.update(req.body);

    const { id, nome, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      nome,
      email,
      avatar,
    });
  }
}

export default new UserController();
