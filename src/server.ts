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
 app.post("/bookaccommodation", (req, res)=>{
    const accID = req.body.accID;
    const npeople = req.body.npeople;
    const thedate = req.body.thedate;
    const  stmt = db.prepare("INSERT INTO acc_bookings (accID, thedate, userID, npeople) VALUES (?, ?, 1, ?)")
    stmt.run(accID, thedate, npeople);
    
    const stmt2 = db.prepare("UPDATE acc_dates SET availability = availability - ? WHERE accID = ? AND thedate = ?");
    stmt2.run(npeople, accID, thedate);
    res.json({message: "booking successful"});
 });