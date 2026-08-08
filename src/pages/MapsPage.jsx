import { useState, useMemo, lazy, Suspense } from 'react';
import { MapPin, Navigation2, Layers, Eye, RotateCw, CloudOff, Clock } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card';
import { WeatherIcon } from '@/components/WeatherIcon';
import { Spinner } from '@/components/Spinner';
import { Skeleton } from '@/components/Skeleton';
import { RadioGroup } from '@/components/RadioGroup';
import { MapsSearch } from '@/components/MapsSearch';
import { useToast } from '@/hooks/useToast';
import { useApp } from '@/hooks/useApp';
import { useSettings } from '@/hooks/useSettings';
import { useWeather } from '@/hooks/useWeather';
import { CITIES_COORDS } from '@/constants/cities';
import { WEATHER_LAYERS, getLayerConfig } from '@/constants/weatherLayers';
import { MAP_HEIGHT_CLASS, DEFAULT_MAP_ZOOM } from '@/constants/layout';
import { useTranslation } from '@/hooks/useTranslation';
import { localeFor } from '@/utils/locale';
import { findNearestCity } from '@/utils/geo';
import { convertWindSpeed, windLabelFor } from '@/utils/units';

const MapComponent = lazy(() => import('@/components/MapComponent'));

const MAX_RECENT_SEARCHES = 5;
const DEFAULT_CITY = 'Mogadishu';

export default function MapsPage() {
  const { selectedCity, setSelectedCity } = useApp();
  const { settings } = useSettings();
  const { t, lang } = useTranslation();
  const { toast } = useToast();
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    isMock,
    isOffline,
    refetch,
    lastUpdated,
  } = useWeather(selectedCity, {
    autoRefresh: settings.autoRefresh,
    refreshInterval: settings.refreshInterval,
  });
  const [weatherLayer, setWeatherLayer] = useState('temperature');
  const [mapZoom, setMapZoom] = useState(() => DEFAULT_MAP_ZOOM);
  const [recentSearches, setRecentSearches] = useState(['London', 'Tokyo']);
  const [locating, setLocating] = useState(false);

  const windLabel = windLabelFor(settings.windUnit);
  const windDisplay = convertWindSpeed(weatherData?.current?.windSpeed, settings.windUnit);

  const cityCoords = CITIES_COORDS[selectedCity] || CITIES_COORDS[DEFAULT_CITY];
  const activeLayerConfig = getLayerConfig(weatherLayer);

  const lastUpdatedLabel = useMemo(
    () =>
      lastUpdated
        ? new Date(lastUpdated).toLocaleTimeString(localeFor(lang), {
            hour: '2-digit',
            minute: '2-digit',
          })
        : null,
    [lastUpdated, lang]
  );

  function handleCitySelect(city) {
    setSelectedCity(city);
    if (!recentSearches.includes(city)) {
      setRecentSearches([city, ...recentSearches].slice(0, MAX_RECENT_SEARCHES));
      toast.success(t('maps.citySelected'), city);
    }
  }

  function handleUseMyLocation() {
    if (!settings.gpsEnabled || locating) return;
    if (!('geolocation' in navigator)) {
      toast.error(t('maps.geoNotSupported'));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedCity(findNearestCity(position.coords.latitude, position.coords.longitude).city);
        setLocating(false);
        toast.success(t('maps.locationFound'));
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) return;
        toast.error(t('maps.geoError'));
      }
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('maps.title')}</h1>
          <p className="text-muted-foreground">{t('maps.subtitle')}</p>

          {isOffline && (
            <div className="mt-4 bg-secondary/60 border border-border rounded-lg px-4 py-3 text-center animate-fade-up" role="status">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CloudOff size={16} aria-hidden="true" />
                {t('maps.offline')}
              </p>
            </div>
          )}

          {isMock && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-center" role="status">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-400">{t('dashboard.demoData')}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="md:col-span-1 space-y-4 order-2 md:order-none">
            <Card>
              <CardHeader><CardTitle>{t('maps.searchCities')}</CardTitle></CardHeader>
              <CardContent>
                <MapsSearch onSelect={handleCitySelect} />
              </CardContent>
            </Card>

            {settings.gpsEnabled ? (
              <Button
                onClick={handleUseMyLocation}
                className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
                variant="primary"
                disabled={locating}
                aria-live="polite"
              >
                {locating ? <Spinner className="w-[18px] h-[18px]" /> : <Navigation2 size={18} aria-hidden="true" />}
                {locating ? t('maps.locating') : t('maps.useMyLocation')}
              </Button>
            ) : (
              <div className="p-4 bg-secondary/50 border border-border rounded-xl text-center">
                <Navigation2 size={20} className="mx-auto mb-2 text-muted-foreground opacity-50" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">{t('maps.gpsDisabled')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('maps.gpsDisabledHint')}</p>
              </div>
            )}

            {WEATHER_LAYERS.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Layers size={18} aria-hidden="true" /> {t('maps.weatherLayer')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup label={t('maps.weatherLayer')} className="space-y-2">
                    {WEATHER_LAYERS.map((layer) => (
                      <button
                        key={layer}
                        type="button"
                        role="radio"
                        aria-checked={weatherLayer === layer}
                        onClick={() => setWeatherLayer(layer)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm capitalize ${
                          weatherLayer === layer
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {t('maps.layer' + layer.charAt(0).toUpperCase() + layer.slice(1))}
                      </button>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {activeLayerConfig && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Eye size={18} aria-hidden="true" /> {t('maps.legend')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {activeLayerConfig.legend.map((item) => (
                    <div key={item.labelKey} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${item.color}`} aria-hidden="true" />
                      <span>{t(item.labelKey)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {recentSearches.length > 0 && (
              <Card className="fade-in">
                <CardHeader><CardTitle>{t('maps.recentlySearched')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {recentSearches.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground flex items-center gap-2"
                    >
                      <MapPin size={14} aria-hidden="true" /> {city}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-4 order-1 md:order-none">
            <Suspense
              fallback={
                <div className={`${MAP_HEIGHT_CLASS} bg-secondary rounded-2xl flex items-center justify-center animate-pulse`} role="status">
                  <div className="text-center">
                    <div className="animate-spin mb-4"><MapPin size={40} className="text-primary" /></div>
                    <p className="text-muted-foreground">{t('maps.loadingMap')}</p>
                  </div>
                </div>
              }
            >
              <MapComponent
                selectedCity={selectedCity}
                lat={cityCoords.lat}
                lng={cityCoords.lng}
                zoom={mapZoom}
                onZoomChange={setMapZoom}
                layer={weatherLayer}
              />
            </Suspense>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin size={20} className="text-primary" aria-hidden="true" /> {selectedCity}</CardTitle>
                <CardDescription>
                  {cityCoords.lat.toFixed(4)}°, {cityCoords.lng.toFixed(4)}°
                </CardDescription>
                {lastUpdatedLabel && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />
                    {t('maps.lastUpdated')} {lastUpdatedLabel}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {weatherLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="status" aria-live="polite">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="text-center space-y-2">
                        <Skeleton className="w-8 h-8 mx-auto rounded-full" />
                        <Skeleton className="h-4 w-16 mx-auto" />
                        <Skeleton className="h-6 w-20 mx-auto" />
                      </div>
                    ))}
                    <span className="sr-only">{t('maps.loadingWeather')}</span>
                  </div>
                ) : weatherError ? (
                  <div className="text-center py-6" role="alert">
                    <CloudOff size={24} className="mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground mb-1">{t('maps.loadFailed')} {selectedCity}</p>
                    <p className="text-xs text-muted-foreground mb-4">{t('maps.retryFailed')}</p>
                    <Button variant="primary" size="sm" onClick={refetch} className="mx-auto">
                      <RotateCw size={16} aria-hidden="true" /> {t('maps.retry')}
                    </Button>
                  </div>
                ) : !weatherData ? (
                  <div className="text-center py-6" role="status">
                    <CloudOff size={24} className="mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">{t('maps.noData')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('maps.emptyHint')}</p>
                  </div>
                ) : (
                  <div key={selectedCity} className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
                    <div className="text-center">
                      <div className="flex justify-center mb-2"><WeatherIcon type={weatherData.current.icon} size={32} /></div>
                      <p className="text-sm text-muted-foreground">{t('maps.condition')}</p>
                      <p className="font-bold text-foreground">{weatherData.current.condition}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary mb-1">{settings.tempUnit === 'F' ? weatherData.current.tempF : weatherData.current.temp}°</p>
                      <p className="text-sm text-muted-foreground">{t('maps.temperature')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent mb-1">{weatherData.current.humidity}%</p>
                      <p className="text-sm text-muted-foreground">{t('maps.humidity')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent mb-1">{windDisplay}</p>
                      <p className="text-sm text-muted-foreground">{t('maps.wind')} ({windLabel})</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}