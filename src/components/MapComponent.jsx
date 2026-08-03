import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '@/hooks/useTranslation';
import { BASE_TILE_CONFIG, getLayerConfig } from '@/constants/weatherLayers';

function RecenterMap({ lat, lng, zoom }) {
  const map = useMap();
  const appliedCenterRef = useRef(null);

  useEffect(() => {
    if (appliedCenterRef.current === null) {
      appliedCenterRef.current = [lat, lng];
      return;
    }

    const [prevLat, prevLng] = appliedCenterRef.current;
    if (prevLat !== lat || prevLng !== lng) {
      appliedCenterRef.current = [lat, lng];
      map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
    }
  }, [lat, lng, zoom, map]);

  return null;
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

  const overlay = useMemo(() => getLayerConfig(layer), [layer])

  return (
    <div className="h-[340px] sm:h-[480px] lg:h-[600px] rounded-2xl overflow-hidden border border-border">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="h-full w-full"
        onZoomEnd={(e) => onZoomChange(e.target.getZoom())}
        aria-label={`${t('maps.mapAriaLabel')} ${selectedCity}`}
      >
        <TileLayer
          url={BASE_TILE_CONFIG.url}
          attribution={BASE_TILE_CONFIG.attribution}
        />
        {overlay && (
          <TileLayer
            url={overlay.url}
            attribution={overlay.attribution}
            opacity={overlay.opacity}
            zIndex={10}
          />
        )}
        <RecenterMap lat={lat} lng={lng} zoom={zoom} />
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
