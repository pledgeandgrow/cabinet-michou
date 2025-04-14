'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ postalCode }) {
  const mapRef = useRef(null);       // to store the map instance
  const mapContainerRef = useRef(null); // to refer to the DOM element

  useEffect(() => {
    if (!postalCode || typeof window === 'undefined') return;

    // Clear the previous map instance completely
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Fetch coordinates
    fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=France&format=json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          console.error('Location not found');
          return;
        }

        const { lat, lon } = data[0];

        // Initialize new map only after cleanup
        mapRef.current = L.map(mapContainerRef.current).setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(mapRef.current);

        L.marker([lat, lon])
          .addTo(mapRef.current)
          .bindPopup(`Postal Code: ${postalCode}`)
          .openPopup();
      });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [postalCode]);

  return <div ref={mapContainerRef} style={{ height: '200px', width: '100%' }} />;
}
