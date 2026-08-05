import { memo, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from './Card';
import { WeatherIcon } from './WeatherIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { convertTemp } from '@/utils/units';

const CONDITION_KEYS = {
  'Sunny': 'weather.sunny',
  'Cloudy': 'weather.cloudy',
  'Rainy': 'weather.rainy',
  'Clear': 'weather.clear',
  'Partly Cloudy': 'weather.partlyCloudy',
}

const WeeklyForecast = memo(function WeeklyForecast({ data, unit }) {
  const { t } = useTranslation();

  const maxHigh = useMemo(() => {
    return Math.max(...(data?.weekly ?? []).map((d) => d.high), 1)
  }, [data?.weekly])

  if (!data || !data.weekly) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('weekly.title')}</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-sm">
          <thead className="sr-only">
            <tr>
              <th scope="col">{t('weekly.headDay')}</th>
              <th scope="col">{t('weekly.headCondition')}</th>
              <th scope="col">{t('weekly.headTemp')}</th>
            </tr>
          </thead>
          <tbody className="px-6">
            {data.weekly.map((day) => (
              <tr key={day.day} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition">
                <td className="py-3 px-4 font-medium text-foreground w-20">{t('weather.day' + day.day)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <WeatherIcon type={day.icon} size={20} />
                    <span className="text-muted-foreground">{t(CONDITION_KEYS[day.condition] || day.condition)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2 bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${(day.high / maxHigh) * 100}px` }} />
                    <div className="flex gap-2 min-w-[80px] justify-end">
                      <span className="font-bold text-foreground">{convertTemp(day.high, unit)}°</span>
                      <span className="text-muted-foreground">{convertTemp(day.low, unit)}°</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

export { WeeklyForecast }
