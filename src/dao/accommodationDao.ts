import BetterSqlite3 from 'better-sqlite3';

interface Accommodation {
    ID: number;
    name: string;
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    description: string;
}

export default class AccommodationDao {
    db: BetterSqlite3.Database;

    constructor(db: BetterSqlite3.Database) {
        this.db = db;
    }

    findByLocation(location: string): Accommodation[] {
        const stmt = this.db.prepare("SELECT * FROM accommodation WHERE location = ?");
        return stmt.all(location) as Accommodation[];
    }

    findByTypeAndLocation(type: string, location: string): Accommodation[] {
        const stmt = this.db.prepare("SELECT * FROM accommodation WHERE type = ? AND location = ?");
        return stmt.all(type, location) as Accommodation[];
    }

    checkAvailability(accID: number, thedate: number): { availability: number } | undefined {
        const stmt = this.db.prepare("SELECT availability FROM acc_dates WHERE accID = ? AND thedate = ?");
        return stmt.get(accID, thedate) as { availability: number } | undefined;
    }

    addBooking(accID: number, thedate: number, userID: number, npeople: number): void {
        const stmt = this.db.prepare("INSERT INTO acc_bookings (accID, thedate, userID, npeople) VALUES (?, ?, ?, ?)");
        stmt.run(accID, thedate, userID, npeople);
    }

    reduceAvailability(accID: number, thedate: number, npeople: number): void {
        const stmt = this.db.prepare("UPDATE acc_dates SET availability = availability - ? WHERE accID = ? AND thedate = ?");
        stmt.run(npeople, accID, thedate);
    }
}