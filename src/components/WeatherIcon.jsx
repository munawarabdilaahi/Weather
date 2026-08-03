import { memo } from 'react';
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
} from 'lucide-react';

const WeatherIcon = memo(function WeatherIcon({ type, size = 24 }) {
  switch (type) {
    case 'sun':
      return <Sun size={size} className="text-yellow-400" aria-hidden="true" />;
    case 'rain':
      return <CloudRain size={size} className="text-blue-400" aria-hidden="true" />;
    case 'cloud':
      return <Cloud size={size} className="text-gray-400" aria-hidden="true" />;
    case 'snow':
      return <CloudSnow size={size} className="text-blue-200" aria-hidden="true" />;
    default:
      return <Sun size={size} className="text-yellow-400" aria-hidden="true" />;
  }
});

export { WeatherIcon }
