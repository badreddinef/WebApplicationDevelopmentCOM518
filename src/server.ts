import express from "express";
import { db } from "./db.js";
import ViteExpress from 'vite-express';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import Database from 'better-sqlite3';


const sessDb = new Database('session.db');
const SqliteStore = betterSqlite3Session(expressSession, sessDb);

const app = express();
app.use(express.json());

app.use(expressSession({
    store: new SqliteStore(),
    secret: 'placestostaysecret',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    proxy: true,
    cookie: {
        maxAge: 600000,
        httpOnly: false
    }
}));
app.use((req, res, next) => {
    if(req.method === 'POST' && req.path === '/bookaccommodation') {
        if(req.session.username) {
            next();
        } else {
            res.status(401).json({ error: 'You must be logged in to book accommodation!' });
        }
    } else {
        next();
    }
});

app.get("/accommodation/:location", (req, res) => {
    const location = req.params.location;
    const stmt = db.prepare("SELECT * FROM accommodation WHERE location = ?");
    const results = stmt.all(location);
    res.json(results);
});

app.get("/accommodation/:type/:location", (req, res) => {
    const type = req.params.type;
    const location = req.params.location;
    const stmt = db.prepare("SELECT * FROM accommodation WHERE type = ? AND location = ?");
    const results = stmt.all(type, location);
    res.json(results);
});

app.post("/bookaccommodation", (req, res) => {
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


    const availStmt = db.prepare("SELECT availability FROM acc_dates WHERE accID = ? AND thedate = ?");
    const availRow = availStmt.get(accID, thedate) as { availability: number } | undefined;

    if (!availRow) {
        res.status(400).json({ error: "No availability found for that date" });
        return;
    }

    if (availRow.availability < npeople) {
        res.status(400).json({ error: `Not enough availability. Only ${availRow.availability} places left` });
        return;
    }

    const stmt = db.prepare("INSERT INTO acc_bookings (accID, thedate, userID, npeople) VALUES (?, ?, 1, ?)");
    stmt.run(accID, thedate, npeople);

    const stmt2 = db.prepare("UPDATE acc_dates SET availability = availability - ? WHERE accID = ? AND thedate = ?");
    stmt2.run(npeople, accID, thedate);

    res.json({ message: "Booking successful" });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const stmt = db.prepare('SELECT * FROM acc_users WHERE username = ? AND password = ?');
    const user = stmt.get(username, password);

    if (user) {
        req.session.username = username;
        res.json({ username: username });
    } else {
        res.status(401).json({ error: 'Incorrect username or password!' });
    }
});

app.get('/login', (req, res) => {
    res.json({ username: req.session.username || null });
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ loggedout: true });
    });
});

ViteExpress.listen(app, 3000, () => console.log("Server running on http://localhost:3000"));