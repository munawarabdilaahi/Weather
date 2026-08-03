import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './Card';
import { WeatherIcon } from './WeatherIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { convertTemp } from '@/utils/units';

const HourlyForecast = memo(function HourlyForecast({ data, unit }) {
  const { t } = useTranslation();

  if (!data || !data.hourly) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('hourly.title')}</span>
          <ChevronRight size={20} className="text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 px-6">
          {data.hourly.map((hour) => (
            <div key={hour.hour} className="flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-secondary min-w-[80px] hover:bg-secondary/80 transition">
              <span className="text-xs text-muted-foreground font-medium">{hour.hour}</span>
              <WeatherIcon type={hour.icon} size={24} />
              <span className="text-sm font-bold text-foreground">{convertTemp(hour.temp, unit)}°</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
});

export { HourlyForecast }
