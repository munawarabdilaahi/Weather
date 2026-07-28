import { useState, lazy, Suspense } from 'react';
import { Search, MapPin, Navigation2, Layers, Eye } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card';
import { WeatherIcon } from '@/components/WeatherIcon';
import { useApp } from '@/hooks/useApp';
import { useWeather } from '@/hooks/useWeather';
import { CITIES_COORDS } from '@/constants/cities';
import { useTranslation } from '@/hooks/useTranslation';

const MapComponent = lazy(() => import('@/components/MapComponent'));

export default function MapsPage() {
  const { cities, selectedCity, setSelectedCity, settings } = useApp();
  const { t } = useTranslation();
  const { data: weatherData, loading: weatherLoading, error: weatherError, isMock } = useWeather(selectedCity, {
    autoRefresh: settings.autoRefresh,
    refreshInterval: settings.refreshInterval,
  });
  const [searchValue, setSearchValue] = useState('');
  const [weatherLayer, setWeatherLayer] = useState('temperature');
  const [mapZoom, setMapZoom] = useState(4);
  const [recentSearches, setRecentSearches] = useState(['London', 'Tokyo']);

  const windLabel = { kmh: 'km/h', mph: 'mph', ms: 'm/s' }[settings.windUnit] || 'km/h'
  const windDisplay = settings.windUnit === 'ms'
    ? Math.round((weatherData?.current?.windSpeed ?? 0) / 3.6)
    : settings.windUnit === 'mph'
      ? Math.round((weatherData?.current?.windSpeed ?? 0) / 1.609)
      : weatherData?.current?.windSpeed

  const cityCoords = CITIES_COORDS[selectedCity] || CITIES_COORDS['Mogadishu'];
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchValue('');
    if (!recentSearches.includes(city)) {
      setRecentSearches([city, ...recentSearches].slice(0, 5));
    }
  };

  const handleUseMyLocation = () => {
    if (!settings.gpsEnabled) return
    if (!('geolocation' in navigator)) {
      alert(t('maps.geoNotSupported'));
      return
    }
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
      },
      (err) => {
        if (err.code === 1) return
        alert(t('maps.geoError'))
      }
    );
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>{t('maps.searchCities')}</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text" placeholder={t('maps.searchPlaceholder')} value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    aria-label={t('maps.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {searchValue && filteredCities.length === 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">{t('maps.noCitiesFound')}</p>
                )}
                {searchValue && filteredCities.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {filteredCities.map((city) => (
                      <button key={city} onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground">{city}</button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {settings.gpsEnabled ? (
              <Button onClick={handleUseMyLocation} className="w-full" variant="primary">
                <Navigation2 size={18} /> {t('maps.useMyLocation')}
              </Button>
            ) : (
              <div className="p-4 bg-secondary/50 border border-border rounded-xl text-center">
                <Navigation2 size={20} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">{t('maps.gpsDisabled')}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{t('maps.gpsDisabledHint')}</p>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Layers size={18} /> {t('maps.weatherLayer')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['temperature', 'rain', 'wind', 'clouds', 'pressure'].map((layer) => (
                  <button key={layer} role="radio" aria-checked={weatherLayer === layer} onClick={() => setWeatherLayer(layer)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm capitalize ${
                      weatherLayer === layer ? 'bg-blue-600 text-white' : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}>{t('maps.layer' + layer.charAt(0).toUpperCase() + layer.slice(1))}</button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Eye size={18} /> {t('maps.legend')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-600" /><span>{t('maps.legendVeryCold')}</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-cyan-400" /><span>{t('maps.legendCold')}</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500" /><span>{t('maps.legendMild')}</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-500" /><span>{t('maps.legendWarm')}</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-600" /><span>{t('maps.legendHot')}</span></div>
              </CardContent>
            </Card>

            {recentSearches.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">{t('maps.recentlySearched')}</CardTitle></CardHeader>
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

          <div className="lg:col-span-3 space-y-4">
            <Suspense fallback={
              <div className="h-[600px] bg-secondary rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin mb-4"><MapPin size={40} className="text-blue-500" /></div>
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
                <CardTitle className="flex items-center gap-2"><MapPin size={20} className="text-blue-500" /> {selectedCity}</CardTitle>
                <CardDescription>{cityCoords.lat.toFixed(4)}°, {cityCoords.lng.toFixed(4)}°</CardDescription>
              </CardHeader>
              <CardContent>
                {weatherLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="animate-spin">
                      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  </div>
                ) : weatherError || !weatherData ? (
                  <p className="text-sm text-muted-foreground text-center py-6">{t('maps.noData')}</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-2"><WeatherIcon type={weatherData.current.icon} size={32} /></div>
                      <p className="text-sm text-muted-foreground">{t('maps.condition')}</p>
                      <p className="font-bold text-foreground">{weatherData.current.condition}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500 mb-1">{settings.tempUnit === 'F' ? weatherData.current.tempF : weatherData.current.temp}°</p>
                      <p className="text-sm text-muted-foreground">{t('maps.temperature')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400 mb-1">{weatherData.current.humidity}%</p>
                      <p className="text-sm text-muted-foreground">{t('maps.humidity')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400 mb-1">{windDisplay}</p>
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
