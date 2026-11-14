# Places to Stay — Full-Stack Web Application (COM518)

A university web application project for exploring accommodation listings and user interactions, with a React frontend and an Express backend.

## Technology stack
- **Frontend:** React, TypeScript, Vite, Leaflet
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite with `better-sqlite3`
- **Sessions:** `express-session` and SQLite session storage

## Architecture
- `src/components/`: map and search UI components.
- `src/routes/`: accommodation and user HTTP routes.
- `src/controllers/`: request handlers.
- `src/dao/`: database-access logic.
- `src/db.ts`: database connection.
- `src/server.ts`: Express application and session configuration.

## Local setup
```bash
npm install
npm start
```
The server is configured for `http://localhost:3000`. A local SQLite database is used; check the existing database and schema before starting.

## Important security and maintenance notes
This is coursework, **not a production-ready deployment**. The current source includes a hard-coded session secret and session-cookie settings that need review. Move secrets to environment variables, enable appropriate cookie protections, and audit the checked-in `.db` files for personal data before making this repository public. The current `npm test` script is a placeholder, not an automated test suite.

## Planned improvements
- Add screenshots and a sample workflow.
- Add automated API tests and input validation checks.
- Provide a sanitized sample database or database setup script.
- Remove tracked dependencies (`node_modules`) and duplicate report files after review.

## Project status
University coursework / learning project. Features and setup instructions reflect the repository at the time of review; some exercises may be incomplete.

## Author
[badreddinef](https://github.com/badreddinef) · Solent University
