import React, { useState } from 'react';

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

    async function search() {
        const response = await fetch(`/accommodation/${location}`);
        const data = await response.json();
        setResults(data);
    }

async function book(accID: number) {
    const response = await fetch('/bookaccommodation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accID: accID,
            npeople: 1,
            thedate: 260601
        })
    });
    const data = await response.json();
    alert(data.message);
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
            <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter location..."
            />
            <button onClick={search}>Search</button>
            <div>{resultsList}</div>
        </div>
    );
}