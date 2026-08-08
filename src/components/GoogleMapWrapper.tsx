import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GoogleMapWrapperProps {
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  markers?: Array<{
    id: string;
    title: string;
    lat: number;
    lng: number;
    description?: string;
    isEmergency?: boolean;
  }>;
  selectedMarkerId?: string;
  onMarkerSelect?: (id: string) => void;
}

export const GoogleMapWrapper: React.FC<GoogleMapWrapperProps> = ({
  center,
  zoom = 12,
  height = '350px',
  markers = [],
  selectedMarkerId,
  onMarkerSelect,
}) => {
  const { t } = useTranslation();

  const apiKey =
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
    (process.env as any).GOOGLE_MAPS_PLATFORM_KEY ||
    (process.env as any).VITE_GOOGLE_MAPS_API_KEY ||
    '';

  const hasValidKey = Boolean(apiKey) && apiKey !== 'YOUR_API_KEY';

  if (!hasValidKey) {
    return (
      <div
        className="w-full bg-[#131C1E] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden"
        style={{ height }}
      >
        <div className="w-12 h-12 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center shrink-0 border border-slate-700">
          <MapPin className="w-6 h-6 text-teal-400" />
        </div>

        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-extrabold text-white">
            {t('facilities.mapUnavailable', 'Map preview unavailable — add a Google Maps API key')}
          </h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {t('facilities.mapUnavailableDesc', 'Showing location distance based on device Geolocation or sample coordinates.')}
          </p>
        </div>

        {/* Display selected location coordinates summary */}
        <div className="bg-[#0B0F0E] px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-teal-300 flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-teal-400" />
          <span>Coordinates: {center.lat.toFixed(4)}°N, {center.lng.toFixed(4)}°E</span>
        </div>

        <p className="text-[10px] text-slate-500 italic">
          To enable live Google Maps: Add VITE_GOOGLE_MAPS_API_KEY in Settings → Secrets
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-800 relative" style={{ height }}>
      <APIProvider apiKey={apiKey} version="weekly">
        <Map
          defaultCenter={center}
          center={center}
          defaultZoom={zoom}
          zoom={zoom}
          mapId="MEDIHIVI_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {markers.map((m) => (
            <React.Fragment key={m.id}>
              <AdvancedMarker
                position={{ lat: m.lat, lng: m.lng }}
                title={m.title}
                onClick={() => onMarkerSelect && onMarkerSelect(m.id)}
              >
                <Pin
                  background={m.isEmergency ? '#e11d48' : '#0d9488'}
                  glyphColor="#ffffff"
                  borderColor={m.isEmergency ? '#881337' : '#115e59'}
                />
              </AdvancedMarker>

              {selectedMarkerId === m.id && (
                <InfoWindow position={{ lat: m.lat, lng: m.lng }}>
                  <div className="p-1 text-slate-900 text-xs space-y-1">
                    <p className="font-extrabold">{m.title}</p>
                    {m.description && <p className="text-[10px] text-slate-600">{m.description}</p>}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};
