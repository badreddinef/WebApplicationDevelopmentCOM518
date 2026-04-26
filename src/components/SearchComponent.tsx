import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';

interface Accommodation {
    ID: number;
    name: string;
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    description: string;
}

export default function SearchComponent() {
    const [location, setLocation] = useState("");
    const [results, setResults] = useState<Accommodation[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [npeople, setNpeople] = useState(1);
    const [thedate, setThedate] = useState("");

    useEffect(() => {
        async function checkLogin() {
            const response = await fetch('/users/login');
            const data = await response.json();
            setUsername(data.username);
        }
        checkLogin();
    }, []);

    async function search() {
        const response = await fetch(`/accommodation/${location}`);
        const data = await response.json();
        setResults(data);
    }

    async function login() {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: loginUsername,
                password: loginPassword
            })
        });
        if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
        } else {
            alert('Incorrect username or password!');
            setUsername(null);
        }
    }

    async function logout() {
        await fetch('/users/logout', { method: 'POST' });
        setUsername(null);
    }

    async function book(accID: number) {
        if (!thedate) {
            alert('Please enter a date');
            return;
        }
        const parts = thedate.split('-');
        const convertedDate = parseInt(`${parts[0]!.slice(2)}${parts[1]}${parts[2]}`);

        const response = await fetch('/accommodation/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accID: accID,
                npeople: npeople,
                thedate: convertedDate
            })
        });
        if (response.ok) {
            alert("Booking successful!");
        } else {
            const data = await response.json();
            if (response.status === 401) {
                alert('You must be logged in to book accommodation!');
            } else {
                alert(`Booking failed: ${data.error}`);
            }
        }
    }

    const resultsList = results.map(acc => (
        <article key={acc.ID} className="accommodation-card">
            <h3>{acc.name}</h3>
            <p><strong>Type:</strong> {acc.type}</p>
            <p><strong>Location:</strong> {acc.location}</p>
            <p>{acc.description}</p>
            <div>
                <label htmlFor={`date-${acc.ID}`}>Date:</label>
                <input
                    id={`date-${acc.ID}`}
                    type="date"
                    value={thedate}
                    onChange={(e) => setThedate(e.target.value)}
                />
                <label htmlFor={`npeople-${acc.ID}`}>Number of people:</label>
                <input
                    id={`npeople-${acc.ID}`}
                    type="number"
                    min="1"
                    value={npeople}
                    onChange={(e) => setNpeople(parseInt(e.target.value))}
                />
                <button onClick={() => book(acc.ID)}>Book</button>
            </div>
        </article>
    ));

    return (
        <div>
            <section className="login-section">
                {username ? (
                    <div>
                        <p className="logged-in">Logged in as {username}</p>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button onClick={login}>Login</button>
                    </div>
                )}
            </section>

            <section className="search-section">
                <h2>Search Accommodation</h2>
                <label htmlFor="location">Location:</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location..."
                />
                <button onClick={search}>Search</button>
            </section>

            <section>
                {resultsList}
            </section>

            <section>
                <MapComponent results={results} />
            </section>
        </div>
    );
}