import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Search, SearchX, MapPin, Navigation2, Layers, Eye, RotateCw, CloudOff } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card';
import { WeatherIcon } from '@/components/WeatherIcon';
import { Spinner } from '@/components/Spinner';
import { Skeleton } from '@/components/Skeleton';
import { RadioGroup } from '@/components/RadioGroup';
import { useToast } from '@/hooks/useToast';
import { useApp } from '@/hooks/useApp';
import { useSettings } from '@/hooks/useSettings';
import { useWeather } from '@/hooks/useWeather';
import { CITIES, CITIES_COORDS } from '@/constants/cities';
import { WEATHER_LAYERS, getLayerConfig } from '@/constants/weatherLayers';
import { useTranslation } from '@/hooks/useTranslation';
import { convertWindSpeed, windLabelFor } from '@/utils/units';

const MapComponent = lazy(() => import('@/components/MapComponent'));

export default function MapsPage() {
  const { selectedCity, setSelectedCity } = useApp();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: weatherData, loading: weatherLoading, error: weatherError, isMock, refetch } = useWeather(selectedCity, {
    autoRefresh: settings.autoRefresh,
    refreshInterval: settings.refreshInterval,
  });
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [weatherLayer, setWeatherLayer] = useState('temperature');
  const [mapZoom, setMapZoom] = useState(4);
  const [recentSearches, setRecentSearches] = useState(['London', 'Tokyo']);
  const [locating, setLocating] = useState(false);

  const prevErrorRef = useRef(null);
  useEffect(() => {
    if (weatherError && prevErrorRef.current !== weatherError) {
      toast.error(t('maps.weatherLoadError'), t('maps.retryFailed'));
    }
    prevErrorRef.current = weatherError;
  }, [weatherError, toast, t]);

  const windLabel = windLabelFor(settings.windUnit)
  const windDisplay = convertWindSpeed(weatherData?.current?.windSpeed, settings.windUnit)

  const cityCoords = CITIES_COORDS[selectedCity] || CITIES_COORDS['Mogadishu'];
  const activeLayerConfig = getLayerConfig(weatherLayer);
  const query = searchValue.trim();
  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );
  const showSearchResults = query.length > 0 && !searchLoading && filteredCities.length > 0;

  useEffect(() => {
    const id = setTimeout(() => setSearchLoading(false), 150);
    return () => clearTimeout(id);
  }, [searchValue]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchValue('');
    setActiveIndex(-1);
    setSearchLoading(false);
    if (!recentSearches.includes(city)) {
      setRecentSearches([city, ...recentSearches].slice(0, 5));
      toast.success(t('maps.citySelected'), city);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setActiveIndex(0);
    setSearchLoading(true);
  };

  const handleSearchKeyDown = (e) => {
    if (filteredCities.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % filteredCities.length;
      setActiveIndex(nextIndex);
      document.getElementById(`city-option-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = (activeIndex - 1 + filteredCities.length) % filteredCities.length;
      setActiveIndex(nextIndex);
      document.getElementById(`city-option-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const city = filteredCities[activeIndex] ?? filteredCities[0];
      handleCitySelect(city);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchValue('');
      setActiveIndex(-1);
      setSearchLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!settings.gpsEnabled) return
    if (locating) return
    if (!('geolocation' in navigator)) {
      toast.error(t('maps.geoNotSupported'));
      return
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const entries = Object.entries(CITIES_COORDS);
        let best = { city: entries[0][0], lat: entries[0][1].lat, lng: entries[0][1].lng };
        let bestDist = Math.hypot(best.lat - latitude, best.lng - longitude);
        for (let i = 1; i < entries.length; i++) {
          const [city, { lat, lng }] = entries[i];
          const dist = Math.hypot(lat - latitude, lng - longitude);
          if (dist < bestDist) { bestDist = dist; best = { city, lat, lng }; }
        }
        setSelectedCity(best.city);
        setLocating(false);
        toast.success(t('maps.locationFound'), best.city);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) return
        toast.error(t('maps.geoError'))
      }
    );
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('maps.title')}</h1>
          <p className="text-muted-foreground">{t('maps.subtitle')}</p>
          {isMock && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-center">
              <p className="text-sm text-amber-400 font-medium">{t('dashboard.demoData')}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-4 order-2 lg:order-none">
            <Card>
              <CardHeader><CardTitle>{t('maps.searchCities')}</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder={t('maps.searchPlaceholder')}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={query.length > 0 && !searchLoading}
                    aria-controls="city-listbox"
                    aria-activedescendant={showSearchResults && activeIndex >= 0 ? `city-option-${activeIndex}` : undefined}
                    aria-autocomplete="list"
                    aria-label={t('maps.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {query.length > 0 && searchLoading && (
                  <div className="mt-3 flex items-center justify-center gap-2 py-3" role="status">
                    <Spinner className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{t('maps.searching')}</span>
                  </div>
                )}

                {query.length > 0 && !searchLoading && filteredCities.length === 0 && (
                  <div className="mt-3 text-center py-4 rounded-lg bg-secondary/50 border border-border" role="status">
                    <SearchX size={20} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t('maps.noCitiesFound')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('maps.noCitiesHint')}</p>
                  </div>
                )}

                {showSearchResults && (
                  <ul id="city-listbox" role="listbox" aria-label={t('maps.searchCities')} className="mt-3 space-y-2 fade-in">
                    {filteredCities.map((city, index) => (
                      <li
                        key={city}
                        id={`city-option-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                          index === activeIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
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
                {locating ? (
                  <Spinner className="w-[18px] h-[18px]" />
                ) : (
                  <Navigation2 size={18} />
                )}
                {locating ? t('maps.locating') : t('maps.useMyLocation')}
              </Button>
            ) : (
              <div className="p-4 bg-secondary/50 border border-border rounded-xl text-center">
                <Navigation2 size={20} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">{t('maps.gpsDisabled')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('maps.gpsDisabledHint')}</p>
              </div>
            )}

            {WEATHER_LAYERS.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Layers size={18} /> {t('maps.weatherLayer')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup label={t('maps.weatherLayer')} className="space-y-2">
                    {WEATHER_LAYERS.map((layer) => (
                      <button key={layer} role="radio" aria-checked={weatherLayer === layer} onClick={() => setWeatherLayer(layer)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm capitalize ${
                          weatherLayer === layer ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}>{t('maps.layer' + layer.charAt(0).toUpperCase() + layer.slice(1))}</button>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {activeLayerConfig && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Eye size={18} /> {t('maps.legend')}</CardTitle>
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
                    <button key={city} onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground flex items-center gap-2">
                      <MapPin size={14} /> {city}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4 order-1 lg:order-none">
            <Suspense fallback={
              <div className="h-[340px] sm:h-[480px] lg:h-[600px] bg-secondary rounded-2xl flex items-center justify-center animate-pulse" role="status">
                <div className="text-center">
                  <div className="animate-spin mb-4"><MapPin size={40} className="text-primary" /></div>
                  <p className="text-muted-foreground">{t('maps.loadingMap')}</p>
                </div>
              </div>
            }>
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
                <CardTitle className="flex items-center gap-2"><MapPin size={20} className="text-primary" /> {selectedCity}</CardTitle>
                <CardDescription>{cityCoords.lat.toFixed(4)}°, {cityCoords.lng.toFixed(4)}°</CardDescription>
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
                    <CloudOff size={24} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">{t('maps.noData')}</p>
                    <Button variant="secondary" size="sm" onClick={handleRetry} className="mx-auto">
                      <RotateCw size={16} aria-hidden="true" /> {t('maps.retry')}
                    </Button>
                  </div>
                ) : !weatherData ? (
                  <div className="text-center py-6">
                    <CloudOff size={24} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t('maps.noData')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
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
