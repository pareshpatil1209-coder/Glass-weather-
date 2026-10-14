# Glass Weather 🌦️

A mobile-first weather web application featuring a **"Google × Liquid Glass"** aesthetic: minimal, fluid, and premium. Built with React, TypeScript, Tailwind CSS, Motion (framer-motion), and Leaflet.

Designed for a 390px-wide phone first, centered in a max-width 430px column on desktop with an ambient atmospheric backdrop.

---

## 🌟 Key Features

### 1. Zero API Keys Required
- **Weather Forecasts**: Powered by the Open-Meteo API (current weather, 24-hour hourly forecast, and 7-day extended forecast with sunrise/sunset).
- **City Search**: Fast Open-Meteo Geocoding API with 300ms debounce and responsive suggestions.
- **Precipitation Radar**: Live radar overlay powered by RainViewer public tile API, with graceful fallback to CartoDB Positron soft pastel base map.
- **Geolocation**: Browser Geolocation API on first launch with graceful fallback to Tokyo and gentle permission prompt.

### 2. "Google × Liquid Glass" Visual Design System
- **Dynamic Weather Moods (800ms crossfade)**:
  - ☀️ **Sunny**: Sky blue `#B7D9F6` → `#D9EAFB` → Warm cream `#FBEACB` with golden accents.
  - 🌧️ **Rainy**: Slate blue `#3F5A7C` → Cool gray `#5B7089` → Muted cyan `#4A8693`.
  - 🌙 **Night**: Midnight navy `#0E1538` → `#1D1B4F` → Deep violet `#3A2A6B`.
  - 🌅 **Sunset**: Peach `#FFD9BC` → Coral `#FFA78E` → Dusty purple `#C4ABD3`.
- **Soft 3D Weather Illustrations**: Layered SVG elements (sun, clouds, rain clouds, moon and stars) with radial & linear gradients, floating gently (translateY ±10px, 7s loop). Fully respects `prefers-reduced-motion`.
- **Specular Glass Cards**:
  - `backdrop-filter: blur(24px) saturate(1.6)`
  - 1px crisp top specular highlight (`inset 0 1px 0 rgba(255,255,255,0.95)`)
  - Smooth 28–34px border radii and soft colored drop shadows
- **Typography Hierarchy**:
  - **Outfit** (weights 200–300) for large numbers, with a 136–140px hero temperature (`letter-spacing: -6px`).
  - **Figtree** (weights 400–700) for clean, legible interface text.
  - 13px uppercase section headers with `0.08em` letter-spacing.
- **Vector Stroke Icons**: 100% custom inline SVGs with `1.8` stroke width and rounded caps (zero emoji or icon fonts).

---

## 📱 Navigation & Screens

1. **Weather Screen**:
   - Floating header with GPS location status, last updated time, pull/tap refresh, search trigger, and unit settings.
   - Hero visual centerpiece with animated 3D weather illustration, giant temperature, condition label, and liquid glass pills.
   - Horizontal hourly strip with snap scrolling and "Now" illuminated capsule.
   - 2-column details grid: Humidity (with Dew Point), Wind (with rotating compass arrow and gusts), UV Index (with color gradient marker), Precipitation chance, Visibility, Barometric Pressure, and Lunar Phase.
   - 7-day forecast list with 56px rows, hairline dividers, low/high temperatures, and range bars plotted against the week's min/max (with a current temperature dot on Today).
2. **Map Screen**:
   - Full-bleed Leaflet map with CartoDB Positron base layer.
   - RainViewer radar tiles with timeline scrubber (`Now`, `+2h`, `+4h`, `+6h`), play/pause animation, and Light → Heavy gradient legend.
   - Interactive glass city markers displaying live temperatures and a pulsing dot for device location.
   - Layer selector chips (Rain, Temp, Wind, Clouds).
3. **Saved Locations Screen**:
   - Glass city cards tinted by their current weather condition (gold for sunny, slate for rainy, violet for night).
   - "My location" badge on device location card.
   - Swipe-to-remove gesture and quick remove action.
   - Persistent storage in `localStorage`.
4. **Bottom Sheets**:
   - **Search Sheet**: Debounced city autocomplete with country & region, quick picks, and instant save action.
   - **Settings Sheet**: Toggle units for Temperature (°C / °F), Wind Speed (km/h / mph), Pressure (hPa / inHg), and in-app PWA install trigger.
5. **Progressive Web App (PWA) & Offline Mode**:
   - Web App Manifest: `name: "Glass Weather"`, `short_name: "Weather"`, `display: "standalone"`, `orientation: "portrait"`.
   - Sunny gradient theme & background color (`#B7D9F6`).
   - 192px, 512px and maskable icons generated from the soft 3D sun-and-cloud illustration.
   - Workbox service worker caching app shell and Open-Meteo forecasts with offline storage fallback.
   - iOS meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`) and `apple-touch-icon`.
   - Edge-to-edge safe area clearance (`env(safe-area-inset-*)`) on iPhone Dynamic Island and home indicators.
   - In-app install button with iOS Safari step-by-step guidance.

---

## 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Typecheck and build for production
npm run build
```
