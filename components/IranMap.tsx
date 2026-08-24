"use client";

import { useEffect, useRef, useState } from "react";

const leafletCss = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const leafletJs = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

const activityPoints = [
  { name: "تهران", lat: 35.6892, lng: 51.389 },
  { name: "تبریز", lat: 38.0962, lng: 46.2738 },
  { name: "رشت", lat: 37.2808, lng: 49.5832 },
  { name: "ساری", lat: 36.5659, lng: 53.0586 },
  { name: "مشهد", lat: 36.2605, lng: 59.6168 },
  { name: "اصفهان", lat: 32.6546, lng: 51.668 },
  { name: "شیراز", lat: 29.5918, lng: 52.5837 },
  { name: "کرمان", lat: 30.2839, lng: 57.0834 },
  { name: "اهواز", lat: 31.3183, lng: 48.6706 },
  { name: "بندرعباس", lat: 27.1832, lng: 56.2666 },
] as const;

type LeafletApi = {
  map: (element: HTMLDivElement, options: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
  divIcon: (options: Record<string, unknown>) => unknown;
  marker: (latLng: [number, number], options: Record<string, unknown>) => { addTo: (map: LeafletMap) => { bindTooltip: (text: string, options: Record<string, unknown>) => void } };
};

type LeafletMap = {
  setView: (latLng: [number, number], zoom: number) => LeafletMap;
  remove: () => void;
};

declare global {
  interface Window {
    L?: LeafletApi;
    __leafletLoading?: Promise<void>;
  }
}

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (window.__leafletLoading) return window.__leafletLoading;

  window.__leafletLoading = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${leafletCss}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = leafletCss;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${leafletJs}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Leaflet failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = leafletJs;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.body.appendChild(script);
  });

  return window.__leafletLoading;
}

type MapProject = {
  id: number;
  order: number;
  title: string;
  description: string;
  status: string;
};

export function IranMap({ caption, projects }: { caption: string; projects: MapProject[] }) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    loadLeaflet()
      .then(() => {
        if (!active || !mapElement.current || !window.L || mapInstance.current) return;

        const map = window.L.map(mapElement.current, {
          attributionControl: true,
          scrollWheelZoom: false,
          zoomControl: true,
        }).setView([32.7, 53.7], 5);

        window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        const icon = window.L.divIcon({
          className: "leaflet-city-pin",
          html: "<span></span>",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        for (const point of activityPoints) {
          window.L
            .marker([point.lat, point.lng], { icon })
            .addTo(map)
            .bindTooltip(point.name, { direction: "top", offset: [0, -9], permanent: false });
        }

        mapInstance.current = map;
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section className="map-section">
      <div className="map-projects" aria-label="پروژه‌های کشاورزیار">
        {projects.map((project) => (
          <article className="map-project-card" key={project.id}>
            <span className="project-status">{project.status}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
      <figure className="map-wrap" aria-label="نقشه واقعی ایران با نقاط فعالیت">
        <div className="leaflet-map" ref={mapElement}>
          {failed && (
            <a href="https://www.openstreetmap.org/#map=5/32.7/53.7" target="_blank" rel="noreferrer">
              مشاهده نقشه ایران در OpenStreetMap
            </a>
          )}
        </div>
        <figcaption>{caption}</figcaption>
      </figure>
    </section>
  );
}
