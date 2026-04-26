import type { Request, Response } from 'express';
import xss from 'xss';
import AccommodationDao from '../dao/accommodationDao.js';
import BetterSqlite3 from 'better-sqlite3';

export default class AccommodationController {
    dao: AccommodationDao;

    constructor(db: BetterSqlite3.Database) {
        this.dao = new AccommodationDao(db);
    }
    findByLocation(req: Request, res: Response) {
        try {
            const location = xss(req.params.location);
            const results = this.dao.findByLocation(location);
            res.json(results);
        } catch(e) {
            res.status(500).json({ error: e });
        }
    }
    findByTypeAndLocation(req: Request, res: Response) {
        try {
            const type = xss(req.params.type);
            const location = xss(req.params.location);
            const results = this.dao.findByTypeAndLocation(type, location);
            res.json(results);
        } catch(e) {
            res.status(500).json({ error: e });
        }
    }

    book(req: Request, res: Response) {
        try {
            const accID = req.body.accID;
            const npeople = req.body.npeople;
            const thedate = req.body.thedate;

            if (!accID || !npeople || !thedate) {
                res.status(400).json({ error: "Missing accommodation or num of people or date" });
                return;
            }

            const today = new Date();
            const year = today.getFullYear() % 100;
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayNum = parseInt(`${year}${month}${day}`);

            if (thedate < todayNum) {
                res.status(400).json({ error: "Cannot book a date in the past" });
                return;
            }

            const availRow = this.dao.checkAvailability(accID, thedate);

            if (!availRow) {
                res.status(400).json({ error: "No availability found for that date" });
                return;
            }

            if (availRow.availability < npeople) {
                res.status(400).json({ error: `Not enough availability. Only ${availRow.availability} places left` });
                return;
            }

            this.dao.addBooking(accID, thedate, 1, npeople);
            this.dao.reduceAvailability(accID, thedate, npeople);

            res.json({ message: "Booking successful" });
        } catch(e) {
            res.status(500).json({ error: e });
        }
    }
}