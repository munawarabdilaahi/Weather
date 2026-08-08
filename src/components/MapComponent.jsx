import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '@/hooks/useTranslation';
import { Spinner } from '@/components/Spinner';
import { BASE_TILE_CONFIG, getLayerConfig } from '@/constants/weatherLayers';
import { MAP_HEIGHT_CLASS } from '@/constants/layout';

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

function OverlayLayerTile({ url, attribution, opacity }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState({ loading: false, error: false });
  const countsRef = useRef({ pending: 0, loaded: 0, errored: 0 });

  const eventHandlers = useMemo(
    () => ({
      tileloadstart: () => {
        countsRef.current.pending += 1;
        setStatus((s) => (s.loading ? s : { ...s, loading: true }));
      },
      tileload: () => {
        const c = countsRef.current;
        c.pending -= 1;
        c.loaded += 1;
        if (c.pending <= 0) {
          setStatus({ loading: false, error: c.loaded === 0 && c.errored > 0 });
        }
      },
      tileerror: () => {
        const c = countsRef.current;
        c.pending -= 1;
        c.errored += 1;
        if (c.pending <= 0) {
          setStatus({ loading: false, error: c.loaded === 0 && c.errored > 0 });
        }
      },
    }),
    []
  );

  return (
    <>
      <TileLayer
        url={url}
        attribution={attribution}
        opacity={opacity}
        zIndex={10}
        eventHandlers={eventHandlers}
      />
      {status.loading && (
        <div
          className="absolute top-2 right-2 z-[1000] flex items-center gap-2 bg-card/90 border border-border rounded-lg px-3 py-1.5"
          role="status"
        >
          <Spinner className="w-3.5 h-3.5" />
          <span className="text-xs text-muted-foreground">{t('maps.layerLoading')}</span>
        </div>
      )}
      {status.error && (
        <div
          className="absolute top-2 right-2 z-[1000] bg-card/95 border border-destructive/30 rounded-lg px-3 py-1.5"
          role="alert"
        >
          <span className="text-xs text-muted-foreground">{t('maps.layerError')}</span>
        </div>
      )}
    </>
  );
}

function MapComponentImpl({ selectedCity, lat, lng, zoom, onZoomChange, layer }) {
  const { t } = useTranslation();

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  const overlay = useMemo(() => getLayerConfig(layer), [layer]);

  return (
    <div className={`relative ${MAP_HEIGHT_CLASS} rounded-2xl overflow-hidden`}>
      <div
        role="region"
        aria-label={`${t('maps.mapAriaLabel')} ${selectedCity}`}
        className="h-full w-full"
      >
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          className="h-full w-full"
          onZoomEnd={(e) => onZoomChange(e.target.getZoom())}
        >
          <TileLayer url={BASE_TILE_CONFIG.url} attribution={BASE_TILE_CONFIG.attribution} />
          {overlay && (
            <OverlayLayerTile
              key={overlay.url}
              url={overlay.url}
              attribution={overlay.attribution}
              opacity={overlay.opacity}
            />
          )}
          <RecenterMap lat={lat} lng={lng} zoom={zoom} />
          <Marker position={[lat, lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-bold">{selectedCity}</p>
                <p className="text-sm text-muted-foreground">{t('mapPopup.clickToClose')}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

const MapComponent = memo(MapComponentImpl);

export default MapComponent;