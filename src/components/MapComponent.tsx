import React, { useEffect } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Accommodation {
    ID: number;
    name: string;
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    description: string;
}

interface MapProps {
    results: Accommodation[];
}

export default function MapComponent({ results }: MapProps) {

    useEffect(() => {
        const map = L.map("map1");

        const attrib = "Map data copyright OpenStreetMap contributors, Open Database Licence";
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: attrib
        }).addTo(map);

        map.setView(L.latLng(51.505, -0.09), 5);

        results.forEach(acc => {
            const marker = L.marker(L.latLng(acc.latitude, acc.longitude)).addTo(map);
            
            const popupContent = `
                <b>${acc.name}</b><br>
                ${acc.description}<br><br>
                <label>Date (YYMMDD):</label><br>
                <input type="date" id="date-${acc.ID}"><br><br>
                <label>Number of people:</label><br>
                <input type="number" id="npeople-${acc.ID}" value="1" min="1"><br><br>
                <button id="book-${acc.ID}">Book</button>
                <div id="message-${acc.ID}"></div>
            `;
            
            marker.bindPopup(popupContent);

            marker.on('popupopen', () => {
                document.getElementById(`book-${acc.ID}`)!.addEventListener('click', async () => {
                    const dateInput = (document.getElementById(`date-${acc.ID}`) as HTMLInputElement).value;
                    const npeople = parseInt((document.getElementById(`npeople-${acc.ID}`) as HTMLInputElement).value);
                    const messageDiv = document.getElementById(`message-${acc.ID}`)!;

                    if (!dateInput) {
                        messageDiv.innerHTML = '<p style="color:red">Please enter a date</p>';
                        return;
                    }

                    const parts = dateInput.split('-');
                    const thedate = parseInt(`${parts[0]!.slice(2)}${parts[1]}${parts[2]}`);

                    const response = await fetch('/bookaccommodation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            accID: acc.ID,
                            npeople: npeople,
                            thedate: thedate
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        messageDiv.innerHTML = '<p style="color:green">Booking successful!</p>';
                    } else if (response.status === 401) {
                        messageDiv.innerHTML = '<p style="color:red">You must be logged in to book!</p>';
                    } else {
                        messageDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
                    }
                });
            });
        });

        return () => {
            map.remove();
        };

    }, [results]);

    return <div id="map1" style={{ width: "800px", height: "400px" }}></div>;
}