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
            marker.bindPopup(`<b>${acc.name}</b><br>${acc.description}`);
        });

        return () => {
            map.remove();
        };

    }, [results]);

    return <div id="map1" style={{ width: "800px", height: "400px" }}></div>;
}