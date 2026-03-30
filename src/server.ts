import express from "express";
import { db } from "./db";

const app = express();
app.use(express.json());

app.get("/accommodation/:location", (req, res)=> {
    const location = req.params.location; 
    const stmt = db.prepare("SELECT * FROM accommodation WHERE location = ?");
    const results = stmt.all(location);
    res.json(results);
});

app.get("/accommodation/:type/:location", (req, res)=> {
    const type = req.params.type;
    const location = req.params.location;
    const stmt = db.prepare("SELECT * FROM accommodation WHERE type = ? AND location = ?");
    const results = stmt.all(type,location);
    res.json(results);


})
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
});