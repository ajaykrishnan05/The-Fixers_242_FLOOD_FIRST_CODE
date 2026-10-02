# FloodFirst

> **From rainfall alerts to local action.**

FloodFirst is a focused municipal early-warning dashboard demo that helps a ward-level disaster-control officer answer one question:

**"Which local hotspot needs the first disaster-response action in the next 1–3 hours?"**

Pilot area: **Gummidipundi Ward Cluster, Tamil Nadu, India** (12 illustrative demo zones).

> **DEMO MODE — NOT AN OFFICIAL WARNING.** All data is embedded mock data and every output is a *demo decision-support estimate*.

## Features

1. **Hyperlocal inundation-risk map** — interactive Leaflet map (OpenStreetMap tiles) with 12 zones coloured Low / Watch / High / Severe, asset markers (hospital/PHC, school, shelter, railway underpass, bus stand, drainage canal), hover tooltips, click popups, risk legend, and a rainfall-scenario selector (Normal / Moderate / Heavy / Extreme).
2. **Top-three hotspot ranking** — "Priority Hotspots" panel with exactly three ranked cards. Clicking one selects it, flies the map to the zone and updates the action card.
3. **Action recommendation card** — "Action required within …", explainable risk drivers, people/assets at risk, exactly three recommended actions, a simulated bilingual (English + Tamil) resident alert, and a "Mark Alert Prepared" state.

Pages: **Dashboard**, **Methodology** (formulas + disclaimer), **About** (roadmap).

## Technology stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · React Leaflet / Leaflet · Lucide React.
No backend, database, API keys or login. `localStorage` stores only the selected scenario and alert-prepared state.

## Local setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

Requires Node 20+ and internet access for the public OpenStreetMap tiles (the app otherwise works offline).

## Scoring (deterministic, no AI)

```
risk     = 100 × (0.40·rainfallFactor + 0.20·elevationRisk + 0.20·drainageRisk + 0.20·historicalFloodRisk)
priority = 100 × (0.50·risk/100 + 0.30·populationScore + 0.20·criticalAssetWeight)
```

Rainfall factor: Normal 0.15 · Moderate 0.40 · Heavy 0.75 · Extreme 1.00.
Status: 0–24 Low · 25–49 Watch · 50–74 High · 75–100 Severe.
Code: `src/lib/scoring.ts`; data: `src/data/zones.ts`.

## Demo workflow

1. Open the Dashboard.
2. Select **Extreme Rain** — zones recolour and Severe zones appear.
3. Priority Hotspots update: **#1 Canal-Side Settlement**, #2 Government Hospital Access Road, #3 Railway Underpass.
4. Click the #1 hotspot — the map focuses on it and the Action Recommendation Card updates.
5. Click **Generate Resident Alert** — English and Tamil simulated alerts appear.
6. Click **Mark Alert Prepared** — "Alert prepared for local dissemination" is shown and survives a page refresh (use **Clear** to reset).

## Disclaimer

This is a hackathon decision-support prototype. It is not an official weather or evacuation warning. Production deployment requires validation with local authorities, official meteorological data, live drainage/water-level observations, and field verification.
