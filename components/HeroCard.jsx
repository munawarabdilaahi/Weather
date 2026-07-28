import { Cloud, Droplets, Wind, Eye, Zap } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';

export function HeroCard({ data, unit }) {
  const temp = unit === 'C' ? data.current.temp : data.current.tempF;
  const feelsLike = unit === 'C' ? data.current.feelsLike : data.current.feelsLikeF;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <Cloud size={300} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-blue-100 mb-2">Current Weather</p>
            <h2 className="text-5xl font-bold">{temp}°</h2>
            <p className="text-blue-50 mt-2">{data.current.condition}</p>
          </div>
          <div className="text-right">
            <WeatherIcon type={data.current.icon} size={80} />
            <p className="text-sm text-blue-100 mt-2">Feels like {feelsLike}°</p>
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={18} />
              <span className="text-sm text-blue-100">Humidity</span>
            </div>
            <p className="text-2xl font-bold">{data.current.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind size={18} />
              <span className="text-sm text-blue-100">Wind</span>
            </div>
            <p className="text-2xl font-bold">{data.current.windSpeed} km/h</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} />
              <span className="text-sm text-blue-100">UV Index</span>
            </div>
            <p className="text-2xl font-bold">{data.current.uv}</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={18} />
              <span className="text-sm text-blue-100">Visibility</span>
            </div>
            <p className="text-2xl font-bold">{data.current.visibility} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}
