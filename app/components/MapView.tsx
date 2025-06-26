'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Déclaration pour TypeScript
interface MapViewProps {
  postalCode: string;
}

// Déclaration pour l'extension de HTMLElement avec _leaflet_id
declare global {
  interface HTMLElement {
    _leaflet_id?: number;
  }
}

export default function MapView({ postalCode }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);       // to store the map instance
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // to refer to the DOM element

  useEffect(() => {
    if (!postalCode || typeof window === 'undefined' || !mapContainerRef.current) return;

    // Vérifier si l'élément a déjà une carte initialisée
    if (mapContainerRef.current._leaflet_id) {
      console.log('Map container already has a map, cleaning up...');
    }

    // Nettoyer complètement la carte précédente
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Attendre que le DOM soit complètement prêt
    setTimeout(() => {
      // Fetch coordinates
      fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=France&format=json`)
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.length === 0) {
            console.error('Location not found');
            return;
          }

          const { lat, lon } = data[0];

          // Vérifier à nouveau que la carte n'existe pas déjà
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }

          // S'assurer que le conteneur existe toujours
          if (!mapContainerRef.current) return;

          // Initialiser la nouvelle carte
          try {
            mapRef.current = L.map(mapContainerRef.current).setView([lat, lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
            }).addTo(mapRef.current);

            L.marker([lat, lon])
              .addTo(mapRef.current)
              .bindPopup(`Postal Code: ${postalCode}`)
              .openPopup();
          } catch (error) {
            console.error('Error initializing map:', error);
          }
        });
    }, 0);

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
