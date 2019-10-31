import File from '../models/file';

class FileController {
  async store(req, res) {
    const { originalname: nome, filename: path } = req.file;

    const file = await File.create({
      nome,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
