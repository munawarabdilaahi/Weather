'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const layerColors = {
  temperature: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  rain: 'https://tile.openweathermap.org/precipitation_new/{z}/{x}/{y}.png',
  wind: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  clouds: 'https://tile.openweathermap.org/clouds_new/{z}/{x}/{y}.png',
  pressure: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

export default function MapComponent({
  selectedCity,
  lat,
  lng,
  zoom,
  onZoomChange,
  layer = 'temperature',
}) {
  const getTileUrl = () => {
    return layerColors[layer] || layerColors.temperature;
  };

  const getLayerAttribution = () => {
    if (layer === 'rain' || layer === 'clouds') {
      return '&copy; OpenWeatherMap contributors';
    }
    return '&copy; OpenStreetMap contributors';
  };

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          url={getTileUrl()}
          attribution={getLayerAttribution()}
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="p-2">
              <p className="font-bold">{selectedCity}</p>
              <p className="text-sm text-gray-600">Click to close</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
