import { useMemo } from 'react';
import { Gauge, Sunrise, Sunset, Compass, Activity, CloudRain } from 'lucide-react';
import { HeroCard } from '@/components/HeroCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { Skeleton } from '@/components/Skeleton';
import { RadioGroup } from '@/components/RadioGroup';
import { DetailRow } from '@/components/DetailRow';
import { useApp } from '@/hooks/useApp';
import { useSettings } from '@/hooks/useSettings';
import { useWeather } from '@/hooks/useWeather';
import { useTranslation } from '@/hooks/useTranslation';
import { CITIES } from '@/constants/cities';
import { convertPressure, pressureLabelFor } from '@/utils/units';
import { deriveWeatherDetails, aqiLevel, formatMinutesAsTime } from '@/utils/weatherDetails';

export default function Dashboard() {
  const { selectedCity, setSelectedCity } = useApp();
  const { settings, updateSetting } = useSettings();
  const { t, lang } = useTranslation();
  const unit = settings.tempUnit;
  const { data: currentData, loading, error, isMock, refetch, lastUpdated, isOffline } = useWeather(selectedCity, {
    autoRefresh: settings.autoRefresh,
    refreshInterval: settings.refreshInterval,
  });

  const pressure = useMemo(
    () => ({
      label: pressureLabelFor(settings.pressureUnit),
      value: convertPressure(currentData?.current?.pressure, settings.pressureUnit),
    }),
    [settings.pressureUnit, currentData?.current?.pressure]
  );

  const lastUpdatedLabel = useMemo(
    () =>
      lastUpdated
        ? new Date(lastUpdated).toLocaleTimeString(
            lang === 'somali' ? 'so-SO' : 'en-US',
            { hour: '2-digit', minute: '2-digit' }
          )
        : null,
    [lastUpdated, lang]
  );

  const weatherDetails = useMemo(
    () => (currentData?.current ? deriveWeatherDetails(currentData.current) : null),
    [currentData?.current]
  );

  const locale = lang === 'somali' ? 'so-SO' : 'en-US';

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex gap-4 flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.weatherFor')} {selectedCity}</p>
          {lastUpdatedLabel && (
            <p className="text-xs text-muted-foreground mt-1">
              {t('dashboard.lastUpdated')} {lastUpdatedLabel}
            </p>
          )}
        </div>

        <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            aria-label={t('dashboard.selectCity')}
            className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <RadioGroup label={t('dashboard.tempUnitAria')} className="flex items-center bg-secondary rounded-lg p-0.5">
            <button
              type="button"
              role="radio"
              aria-checked={unit === 'C'}
              onClick={() => updateSetting('tempUnit', 'C')}
              className={`px-4 py-2 rounded transition text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                unit === 'C' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >°C</button>
            <button
              type="button"
              role="radio"
              aria-checked={unit === 'F'}
              onClick={() => updateSetting('tempUnit', 'F')}
              className={`px-4 py-2 rounded transition text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                unit === 'F' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >°F</button>
          </RadioGroup>
        </div>
      </div>

      {isOffline && (
        <div className="bg-secondary/60 border border-border rounded-lg px-4 py-2 text-center" role="status">
          <p className="text-sm text-muted-foreground">{t('dashboard.offline')}</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center" role="alert">
          <p className="text-sm font-semibold text-red-700 dark:text-red-500">{t('weather.error')} {selectedCity}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {isMock && (
        <div
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-center"
          role="status"
        >
          <p className="text-sm font-medium text-amber-800 dark:text-amber-400">{t('dashboard.demoData')}</p>
        </div>
      )}

      {loading && !currentData && !error && (
        <div className="space-y-6" role="status" aria-label={t('dashboard.loading')}>
          <Skeleton className="h-48 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 lg:col-span-3 rounded-2xl" />
          </div>
        </div>
      )}

      {currentData && !error && (
        <>
          {loading && (
            <div className="flex items-center justify-center gap-2" role="status">
              <Spinner className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">{t('dashboard.refreshing')}</p>
            </div>
          )}

          <HeroCard data={currentData} unit={unit} windUnit={settings.windUnit} visibilityUnit={settings.visibilityUnit} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HourlyForecast data={currentData} unit={unit} />
            </div>

            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">{t('dashboard.additionalDetails')}</h3>
                <div className="space-y-3">
                  <DetailRow icon={Gauge} label={t('dashboard.pressure')} value={`${pressure.value} ${pressure.label}`} />
                  <DetailRow icon={Compass} label={t('dashboard.windDirection')} value={`${weatherDetails.windDirection} · ${weatherDetails.windDeg}°`} />
                  <DetailRow icon={Sunrise} label={t('dashboard.sunrise')} value={formatMinutesAsTime(weatherDetails.sunriseMinutes, locale)} />
                  <DetailRow icon={Sunset} label={t('dashboard.sunset')} value={formatMinutesAsTime(weatherDetails.sunsetMinutes, locale)} />
                  <DetailRow
                    icon={Activity}
                    label={t('dashboard.airQuality')}
                    value={`${weatherDetails.aqi} · ${t(aqiLevel(weatherDetails.aqi).key)}`}
                    valueClassName={aqiLevel(weatherDetails.aqi).className}
                  />
                  <DetailRow icon={CloudRain} label={t('dashboard.rainProbability')} value={`${weatherDetails.rainProbability}%`} />
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <WeeklyForecast data={currentData} unit={unit} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
