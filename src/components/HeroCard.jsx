import { memo } from 'react';
import { Cloud, Droplets, Wind, Eye, Zap } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { windSpeedFor, visibilityFor } from '@/utils/units';

const HeroCard = memo(function HeroCard({ data, unit, windUnit = 'kmh', visibilityUnit = 'km' }) {
  const { t } = useTranslation();
  const temp = unit === 'C' ? data.current.temp : data.current.tempF;
  const feelsLike = unit === 'C' ? data.current.feelsLike : data.current.feelsLikeF;

  const wind = windSpeedFor(data.current.windSpeed, windUnit)
  const visibility = visibilityFor(data.current.visibility, visibilityUnit)

  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white overflow-hidden relative">
      {/* Contrast overlay: keeps white text >= 4.5:1 on the primary/accent gradient */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <Cloud size={300} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-white mb-2">{t('hero.currentWeather')}</p>
            <h2 className="text-5xl font-bold">{temp}°</h2>
            <p className="text-white mt-2">{data.current.condition}</p>
          </div>
          <div className="text-right">
            <WeatherIcon type={data.current.icon} size={80} />
            <p className="text-sm text-white mt-2">{t('hero.feelsLike')} {feelsLike}°</p>
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={18} />
              <span className="text-sm text-white">{t('hero.humidity')}</span>
            </div>
            <p className="text-2xl font-bold">{data.current.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind size={18} />
              <span className="text-sm text-white">{t('hero.wind')}</span>
            </div>
            <p className="text-2xl font-bold">{wind.value} {wind.label}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} />
              <span className="text-sm text-white">{t('hero.uvIndex')}</span>
            </div>
            <p className="text-2xl font-bold">{data.current.uv}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={18} />
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
