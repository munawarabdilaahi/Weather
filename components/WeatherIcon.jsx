import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
} from 'lucide-react';

export function WeatherIcon({ type, size = 24 }) {
  switch (type) {
    case 'sun':
      return <Sun size={size} className="text-yellow-400" />;
    case 'rain':
      return <CloudRain size={size} className="text-blue-400" />;
    case 'cloud':
      return <Cloud size={size} className="text-gray-400" />;
    case 'snow':
      return <CloudSnow size={size} className="text-blue-200" />;
    default:
      return <Sun size={size} className="text-yellow-400" />;
  }
}
