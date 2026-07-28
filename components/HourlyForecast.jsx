import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './Card';
import { WeatherIcon } from './WeatherIcon';

export function HourlyForecast({ data, unit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>24-Hour Forecast</span>
          <ChevronRight size={20} className="text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 px-6">
          {data.hourly.map((hour, idx) => (
            <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-secondary min-w-[80px] hover:bg-secondary/80 transition">
              <span className="text-xs text-muted-foreground font-medium">{hour.hour}</span>
              <WeatherIcon type={hour.icon} size={24} />
              <span className="text-sm font-bold text-foreground">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
