import type { Request, Response } from 'express';
import UsersDao from '../dao/usersDao.js';
import BetterSqlite3 from 'better-sqlite3';
import xss from 'xss';

export default class UsersController {
    dao: UsersDao;

    constructor(db: BetterSqlite3.Database) {
        this.dao = new UsersDao(db);
    }
    login(req: Request, res: Response) {
    try {
        const username = xss(req.body.username);
        const password = xss(req.body.password);

        const user = this.dao.findByUsernameAndPassword(username, password);

        if (user) {
            req.session.username = username;
            res.json({ username: username });
        } else {
            res.status(401).json({ error: 'Incorrect username or password!' });
        }
    } catch(e) {
        res.status(500).json({ error: e });
    }
}

    getLogin(req: Request, res: Response) {
        res.json({ username: req.session.username || null });
    }

    logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.json({ loggedout: true });
        });
    }
}