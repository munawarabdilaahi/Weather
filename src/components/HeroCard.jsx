import { memo } from 'react';
import { Cloud, Droplets, Wind, Eye, Zap } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { windSpeedFor, visibilityFor } from '@/utils/units';
import { weatherConditionKey } from '@/utils/weatherConditions';

const HeroCard = memo(function HeroCard({ data, unit, windUnit = 'kmh', visibilityUnit = 'km' }) {
  const { t } = useTranslation();
  const temp = unit === 'C' ? data.current.temp : data.current.tempF;
  const feelsLike = unit === 'C' ? data.current.feelsLike : data.current.feelsLikeF;

  const wind = windSpeedFor(data.current.windSpeed, windUnit)
  const visibility = visibilityFor(data.current.visibility, visibilityUnit)

  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 md:p-8 text-white overflow-hidden relative animate-hero-shift">
      {/* Contrast overlay: keeps white text >= 4.5:1 on the primary/accent gradient */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />

      {/* Background decoration */}
      <div aria-hidden="true" className="absolute top-0 right-0 opacity-10">
        <Cloud size={300} />
      </div>

      {/* Soft glow orb */}
      <div aria-hidden="true" className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-accent/40 blur-3xl animate-glow" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium tracking-wide mb-4">
              {t('hero.currentWeather')}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">{temp}°</h2>
            <p className="text-white/90 mt-2">{t(weatherConditionKey(data.current.condition))}</p>
          </div>
          <div className="text-right flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
            <WeatherIcon type={data.current.icon} size={80} />
            <p className="text-sm text-white/90 mt-1">{t('hero.feelsLike')} {feelsLike}°</p>
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 transition hover:bg-white/15">
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={18} aria-hidden="true" />
              <span className="text-sm text-white">{t('hero.humidity')}</span>
            </div>
            <p className="text-2xl font-bold">{data.current.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 transition hover:bg-white/15">
            <div className="flex items-center gap-2 mb-2">
              <Wind size={18} aria-hidden="true" />
              <span className="text-sm text-white">{t('hero.wind')}</span>
            </div>
            <p className="text-2xl font-bold">{wind.value} {wind.label}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 transition hover:bg-white/15">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} aria-hidden="true" />
              <span className="text-sm text-white">{t('hero.uvIndex')}</span>
            </div>
            <p className="text-2xl font-bold">{data.current.uv > 0 ? data.current.uv : '—'}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 transition hover:bg-white/15">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={18} aria-hidden="true" />
              <span className="text-sm text-white">{t('hero.visibility')}</span>
            </div>
            <p className="text-2xl font-bold">{visibility.value} {visibility.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export { HeroCard }
