import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { LocationItem, UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { formatTemp } from '../utils/units';
import {
  SearchIcon,
  LayersIcon,
  PlayIcon,
  PauseIcon,
  LocationPinIcon,
  CloseIcon,
} from './WeatherIcons';

interface MapViewProps {
  currentLocation: LocationItem | null;
  activeLocation: LocationItem;
  savedLocations: LocationItem[];
  onSelectLocation: (loc: LocationItem) => void;
  onOpenSearch: () => void;
  mood: WeatherMood;
  unitSettings: UnitSettings;
}

type LayerType = 'rain' | 'temp' | 'wind' | 'clouds';

interface RadarFrame {
  time: number;
  path: string;
}

export function MapView({
  currentLocation,
  activeLocation,
  savedLocations,
  onSelectLocation,
  onOpenSearch,
  mood,
  unitSettings,
}: MapViewProps) {
  const theme = MOOD_THEMES[mood];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<LayerType>('rain');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [radarHost, setRadarHost] = useState<string>('https://tilecache.rainviewer.com');
  const [radarError, setRadarError] = useState<boolean>(false);

  // Selected marker for mini preview card
  const [selectedMarkerCity, setSelectedMarkerCity] = useState<{
    location: LocationItem;
    temp?: number;
  } | null>(null);

  // City temperatures cache for markers
  const [cityTemps, setCityTemps] = useState<Record<string, number>>({});

  const [satelliteFrames, setSatelliteFrames] = useState<RadarFrame[]>([]);

  // 1. Fetch RainViewer radar & satellite metadata (100% keyless public API)
  useEffect(() => {
    let isMounted = true;
    async function fetchRadar() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!res.ok) throw new Error('Radar service error');
        const data = await res.json();
        if (isMounted) {
          setRadarHost(data.host || 'https://tilecache.rainviewer.com');
          if (data.radar) {
            const past = data.radar.past || [];
            const nowcast = data.radar.nowcast || [];
            const allFrames = [...past, ...nowcast];
            setRadarFrames(allFrames);
            if (allFrames.length > 0) {
              const defaultIndex = Math.max(0, past.length - 1);
              setCurrentFrameIndex(defaultIndex);
            }
          }
          if (data.satellite && data.satellite.infrared) {
            setSatelliteFrames(data.satellite.infrared);
          }
          setRadarError(false);
        }
      } catch (err) {
        console.warn('RainViewer unavailable:', err);
        if (isMounted) setRadarError(true);
      }
    }

    fetchRadar();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch temperatures for saved cities
  useEffect(() => {
    const list = [...savedLocations];
    if (activeLocation && !list.some((l) => l.id === activeLocation.id)) {
      list.push(activeLocation);
    }
    if (currentLocation && !list.some((l) => l.id === currentLocation.id)) {
      list.push(currentLocation);
    }

    list.forEach(async (city) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m`
        );
        if (!res.ok) return;
        const d = await res.json();
        setCityTemps((prev) => ({
          ...prev,
          [city.id]: d.current.temperature_2m,
        }));
      } catch {
        // ignore
      }
    });
  }, [savedLocations, activeLocation, currentLocation]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = activeLocation.latitude || 35.6762;
    const initialLon = activeLocation.longitude || 139.6503;

    // Create map without default zoom control
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 6,
      zoomControl: false,
      attributionControl: true,
    });

    // CartoDB Positron Light base tiles (free and keyless)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeLocation.latitude, activeLocation.longitude]);

  // 4. Update Radar / Satellite Tile Layer when frame changes or activeLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
      radarLayerRef.current = null;
    }

    if (activeLayer === 'rain' && radarFrames.length > 0 && !radarError) {
      const frame = radarFrames[currentFrameIndex];
      if (frame) {
        // RainViewer Tile URL: {host}{path}/256/{z}/{x}/{y}/2/1_1.png (keyless public tile)
        const tileUrl = `${radarHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
        const layer = L.tileLayer(tileUrl, {
          opacity: 0.72,
          zIndex: 10,
        }).addTo(map);
        radarLayerRef.current = layer;
      }
    } else if (activeLayer === 'clouds' && satelliteFrames.length > 0 && !radarError) {
      // RainViewer satellite infrared cloud tile (100% keyless public tile)
      const latestSat = satelliteFrames[satelliteFrames.length - 1];
      if (latestSat) {
        const tileUrl = `${radarHost}${latestSat.path}/256/{z}/{x}/{y}/0/1_1.png`;
        const layer = L.tileLayer(tileUrl, {
          opacity: 0.65,
          zIndex: 10,
        }).addTo(map);
        radarLayerRef.current = layer;
      }
    }
  }, [activeLayer, radarFrames, satelliteFrames, currentFrameIndex, radarHost, radarError]);

  // 5. Update Map Center when activeLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([activeLocation.latitude, activeLocation.longitude], 7, {
      duration: 1.2,
    });
  }, [activeLocation]);

  // 6. Render Glass City Markers & User Location Marker
  useEffect(() => {
    const group = markersLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    // Render User Pulsing Location Marker if available
    if (currentLocation) {
      const pulseHtml = `
        <div class="relative w-8 h-8 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-blue-500 opacity-40 pulse-location"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
        </div>
      `;
      const pulseIcon = L.divIcon({
        className: 'custom-user-marker',
        html: pulseHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userMarker = L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: pulseIcon,
        zIndexOffset: 1000,
      });

      userMarker.on('click', () => {
        setSelectedMarkerCity({
          location: currentLocation,
          temp: cityTemps[currentLocation.id],
        });
      });

      group.addLayer(userMarker);
    }

    // Render Glass Markers for saved cities & active city
    const citiesToMark = [...savedLocations];
    if (activeLocation && !citiesToMark.some((c) => c.id === activeLocation.id)) {
      citiesToMark.push(activeLocation);
    }

    citiesToMark.forEach((city) => {
      const tempVal = cityTemps[city.id];
      const tempFormatted = tempVal !== undefined ? formatTemp(tempVal, unitSettings.temp) : '';

      const markerHtml = `
        <div class="cursor-pointer group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-800 backdrop-blur-md shadow-lg border border-white/80 transition-transform active:scale-90"
             style="background: linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.65)); box-shadow: 0 4px 14px rgba(15,23,42,0.18);">
          <span class="max-w-[70px] truncate text-[11px] font-semibold text-slate-700">${city.name}</span>
          ${tempFormatted ? `<span class="font-outfit text-[12px] font-bold text-blue-600">${tempFormatted}</span>` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-glass-marker',
        html: markerHtml,
        iconSize: [100, 30],
        iconAnchor: [50, 15],
      });

      const marker = L.marker([city.latitude, city.longitude], { icon: customIcon });

      marker.on('click', () => {
        setSelectedMarkerCity({
          location: city,
          temp: tempVal,
        });
      });

      group.addLayer(marker);
    });
  }, [savedLocations, activeLocation, currentLocation, cityTemps, unitSettings.temp]);

  // 7. Radar Timeline Animation Play/Pause
  useEffect(() => {
    if (!isPlaying || radarFrames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % radarFrames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, radarFrames.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const timelineLabels = ['Now', '+2h', '+4h', '+6h'];

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col overflow-hidden">
      {/* Full-bleed Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Top Floating Glass Controls */}
      <div
        className="relative z-30 px-4 flex items-center justify-between gap-3"
        style={{ paddingTop: 'max(16px, calc(10px + env(safe-area-inset-top, 0px)))' }}
      >
        {/* Search Pill */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex-1 px-4 py-2.5 rounded-full backdrop-blur-[24px] saturate-[160%] shadow-lg flex items-center gap-2.5 text-left transition-transform active:scale-95 text-slate-800"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))',
            borderColor: 'rgba(255,255,255,0.9)',
            borderWidth: '1px',
            boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
          }}
        >
          <SearchIcon size={18} className="text-slate-600" />
          <span className="text-sm font-semibold truncate">
            {activeLocation.name} · Radar
          </span>
        </button>

        {/* Layers toggle button */}
        <button
          type="button"
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          aria-label="Toggle map layers"
          className="w-11 h-11 rounded-full backdrop-blur-[24px] saturate-[160%] shadow-lg flex items-center justify-center transition-transform active:scale-95 text-slate-800"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.60))',
            borderColor: 'rgba(255,255,255,0.95)',
            borderWidth: '1px',
          }}
        >
          <LayersIcon size={20} />
        </button>
      </div>

      {/* Layer selector chips row */}
      <div className="relative z-30 px-4 mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(['rain', 'temp', 'wind', 'clouds'] as LayerType[]).map((layer) => {
          const isActive = activeLayer === layer;
          const label = layer === 'rain' ? 'Rain' : layer === 'temp' ? 'Temp' : layer === 'wind' ? 'Wind' : 'Clouds';

          return (
            <button
              key={layer}
              type="button"
              onClick={() => setActiveLayer(layer)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                isActive
                  ? 'text-white shadow-blue-500/25 scale-[1.03]'
                  : 'text-slate-700 bg-white/80 hover:bg-white backdrop-blur-md'
              }`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                  : undefined,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Radar Unavailable Chip if API error */}
      {radarError && (
        <div className="relative z-30 self-center mt-3 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 backdrop-blur-md bg-white/70 border border-white/80 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Radar unavailable (showing base map)
        </div>
      )}

      {/* Selected Marker Mini Glass Card */}
      {selectedMarkerCity && (
        <div className="absolute top-24 left-4 right-4 z-40">
          <div
            className="p-4 rounded-[28px] backdrop-blur-[24px] saturate-[170%] shadow-2xl flex items-center justify-between text-slate-900 border border-white/90"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                <LocationPinIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-base leading-tight">
                  {selectedMarkerCity.location.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {[selectedMarkerCity.location.admin1, selectedMarkerCity.location.country].filter(Boolean).join(', ')}
                </p>
                {selectedMarkerCity.temp !== undefined && (
                  <span className="font-outfit text-sm font-semibold text-blue-600">
                    {formatTemp(selectedMarkerCity.temp, unitSettings.temp)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectLocation(selectedMarkerCity.location);
                  setSelectedMarkerCity(null);
                }}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => setSelectedMarkerCity(null)}
                aria-label="Close preview"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to push timeline above bottom nav */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom Glass Timeline Card pinned above the bottom nav */}
      <div
        className="relative z-30 px-4"
        style={{ paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div
          className="p-4 rounded-[30px] backdrop-blur-[24px] saturate-[160%] shadow-xl flex flex-col gap-3 text-slate-900 border border-white/80"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.58) 100%)',
            boxShadow: '0 12px 36px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          {/* Top row: Play/Pause button + Scrubber */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause radar animation' : 'Play radar animation'}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-md active:scale-90 transition-transform flex-shrink-0"
            >
              {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            </button>

            {/* Scrubber slider */}
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={Math.max(radarFrames.length - 1, 0)}
                value={currentFrameIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentFrameIndex(parseInt(e.target.value, 10));
                }}
                className="w-full accent-blue-600 h-1.5 bg-slate-300 rounded-lg cursor-pointer"
              />

              {/* Scrubber labels: Now / +2h / +4h / +6h */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 px-0.5">
                {timelineLabels.map((lbl, idx) => (
                  <span key={idx}>{lbl}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row: Light → Heavy precipitation legend */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-1 border-t border-slate-200/60">
            <span>Light</span>
            <div
              className="w-36 h-2 rounded-full mx-2"
              style={{
                background: 'linear-gradient(90deg, #93C5FD 0%, #3B82F6 30%, #10B981 50%, #F59E0B 75%, #EF4444 100%)',
              }}
            />
            <span>Heavy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
