import multer from 'multer';
import crypto from 'crypto'; // bibioteca do node.
import { extname, resolve } from 'path'; // extname retorna a extenção do arquivo , resolve percorre caminho

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + file.originalname);
      });
    },
  }),
};
