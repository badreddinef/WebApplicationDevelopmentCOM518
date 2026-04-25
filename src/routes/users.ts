import express from 'express';
import UsersController from '../controllers/usersController.js';
import { db } from '../db.js';

const usersRouter = express.Router();
const controller = new UsersController(db);

usersRouter.post('/login', controller.login.bind(controller));
usersRouter.get('/login', controller.getLogin.bind(controller));
usersRouter.post('/logout', controller.logout.bind(controller));

export default usersRouter;