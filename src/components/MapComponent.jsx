import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '@/hooks/useTranslation';

const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY || ''

const LAYER_CONFIG = {
  temperature: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  rain: {
    url: OWM_API_KEY
      ? `https://tile.openweathermap.org/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenWeatherMap contributors',
  },
  wind: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  clouds: {
    url: OWM_API_KEY
      ? `https://tile.openweathermap.org/clouds_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenWeatherMap contributors',
  },
  pressure: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
}

export default function MapComponent({
  selectedCity,
  lat,
  lng,
  zoom,
  onZoomChange,
  layer = 'temperature',
}) {
  const { t } = useTranslation();

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  const tileConfig = useMemo(() => {
    return LAYER_CONFIG[layer] || LAYER_CONFIG.temperature
  }, [layer])

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="h-full w-full"
        onZoomEnd={(e) => onZoomChange(e.target.getZoom())}
      >
        <TileLayer
          url={tileConfig.url}
          attribution={tileConfig.attribution}
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="p-2">
              <p className="font-bold">{selectedCity}</p>
              <p className="text-sm text-gray-600">{t('mapPopup.clickToClose')}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
