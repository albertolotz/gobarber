import { Router } from 'express';
import multer from 'multer';
import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/fileController';
import ProviderController from './app/controllers/providerController';
import scheduleController from './app/controllers/scheduleController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/schedule', scheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
