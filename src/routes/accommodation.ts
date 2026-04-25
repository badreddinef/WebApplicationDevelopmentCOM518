import express from 'express';
import { db } from '../db.js';
import AccommodationController from '../controllers/accommodationController.js';

const accommodationRouter = express.Router();
const controller = new AccommodationController(db);

accommodationRouter.get('/:location', controller.findByLocation.bind(controller));
accommodationRouter.get('/:type/:location', controller.findByTypeAndLocation.bind(controller));
accommodationRouter.post('/book', controller.book.bind(controller));

export default accommodationRouter;