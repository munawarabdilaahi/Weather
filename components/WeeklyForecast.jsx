import { Card, CardHeader, CardTitle } from './Card';
import { WeatherIcon } from './WeatherIcon';

export function WeeklyForecast({ data, unit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-sm">
          <tbody className="px-6">
            {data.weekly.map((day, idx) => (
              <tr key={idx} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition">
                <td className="py-3 px-4 font-medium text-foreground w-20">{day.day}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <WeatherIcon type={day.icon} size={20} />
                    <span className="text-muted-foreground">{day.condition}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${(day.high / 30) * 100}px` }} />
                    <div className="flex gap-2 min-w-[80px] justify-end">
                      <span className="font-bold text-foreground">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
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
}
