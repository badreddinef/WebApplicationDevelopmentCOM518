import express from 'express';
import ViteExpress from 'vite-express';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import Database from 'better-sqlite3';
import accommodationRouter from './routes/accommodation.js';
import usersRouter from './routes/users.js';

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
    if(req.method === 'POST' && req.path === '/accommodation/book') {
        if(req.session.username) {
            next();
        } else {
            res.status(401).json({ error: 'You must be logged in to book accommodation!' });
        }
    } else {
        next();
    }
});


app.use('/accommodation', accommodationRouter);
app.use('/users', usersRouter);

ViteExpress.listen(app, 3000, () => console.log("Server running on http://localhost:3000"));