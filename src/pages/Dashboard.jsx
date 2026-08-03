import { Gauge, Droplets, Wind, Eye } from 'lucide-react';
import { HeroCard } from '@/components/HeroCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { RadioGroup } from '@/components/RadioGroup';
import { useApp } from '@/hooks/useApp';
import { useSettings } from '@/hooks/useSettings';
import { useWeather } from '@/hooks/useWeather';
import { useTranslation } from '@/hooks/useTranslation';
import { CITIES } from '@/constants/cities';
import { convertWindSpeed, windLabelFor, convertVisibility, visibilityLabelFor, convertPressure, pressureLabelFor } from '@/utils/units';

export default function Dashboard() {
  const { selectedCity, setSelectedCity } = useApp();
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation();
  const unit = settings.tempUnit;
  const { data: currentData, loading, error, isMock } = useWeather(selectedCity, {
    autoRefresh: settings.autoRefresh,
    refreshInterval: settings.refreshInterval,
  });

  const windLabel = windLabelFor(settings.windUnit)
  const visibilityLabel = visibilityLabelFor(settings.visibilityUnit)
  const pressureLabel = pressureLabelFor(settings.pressureUnit)

  const windSpeed = convertWindSpeed(currentData?.current?.windSpeed, settings.windUnit)
  const visibility = convertVisibility(currentData?.current?.visibility, settings.visibilityUnit)
  const pressure = convertPressure(currentData?.current?.pressure, settings.pressureUnit)

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex gap-4 flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.weatherFor')} {selectedCity}</p>
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
              role="radio"
              aria-checked={unit === 'C'}
              onClick={() => updateSetting('tempUnit', 'C')}
              className={`px-4 py-2 rounded transition text-sm font-medium ${
                unit === 'C' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >°C</button>
            <button
              role="radio"
              aria-checked={unit === 'F'}
              onClick={() => updateSetting('tempUnit', 'F')}
              className={`px-4 py-2 rounded transition text-sm font-medium ${
                unit === 'F' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >°F</button>
          </RadioGroup>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64" role="status">
          <div className="text-center">
            <div className="mb-4">
              <Spinner className="w-10 h-10 text-primary mx-auto" />
            </div>
            <p className="text-muted-foreground">{t('dashboard.loading')}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center" role="alert">
          <p className="text-destructive font-medium">{t('weather.error')} {selectedCity}</p>
        </div>
      )}

      {isMock && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-center">
          <p className="text-sm text-amber-400 font-medium">{t('dashboard.demoData')}</p>
        </div>
      )}

      {currentData && !loading && !error && (
        <>
          <HeroCard data={currentData} unit={unit} windUnit={settings.windUnit} visibilityUnit={settings.visibilityUnit} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HourlyForecast data={currentData} unit={unit} />
            </div>

            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">{t('dashboard.additionalDetails')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Gauge size={16} /> {t('dashboard.pressure')}</span>
                    <span className="font-bold text-foreground">{pressure} {pressureLabel}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Eye size={16} /> {t('dashboard.visibility')}</span>
                    <span className="font-bold text-foreground">{visibility} {visibilityLabel}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Droplets size={16} /> {t('dashboard.humidity')}</span>
                    <span className="font-bold text-foreground">{currentData.current.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Wind size={16} /> {t('dashboard.windSpeed')}</span>
                    <span className="font-bold text-foreground">{windSpeed} {windLabel}</span>
                  </div>
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
