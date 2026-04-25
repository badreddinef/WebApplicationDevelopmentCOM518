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
        const response = await fetch('/accommodation/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accID: accID,
                npeople: 1,
                thedate: 260601
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
        <div key={acc.ID}>
            <h3>{acc.name}</h3>
            <p>Type: {acc.type}</p>
            <p>Location: {acc.location}</p>
            <p>{acc.description}</p>
            <button onClick={() => book(acc.ID)}>Book</button>
        </div>
    ));

    return (
        <div>
            <h1>Places To Stay</h1>

            {username ? (
                <div>
                    <p>Logged in as {username}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button onClick={login}>Login</button>
                </div>
            )}

            <h2>Search</h2>
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location..."
            />
            <button onClick={search}>Search</button>
            <div>{resultsList}</div>
            <MapComponent results={results} />
        </div>
    );
}