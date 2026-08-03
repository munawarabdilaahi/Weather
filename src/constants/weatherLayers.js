const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY || ''
const OWM_TILE_BASE = 'https://tile.openweathermap.org/map'

const overlayUrl = (name) =>
  `${OWM_TILE_BASE}/${name}_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`

export const BASE_TILE_CONFIG = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
}

export const LAYER_CONFIG = OWM_API_KEY
  ? {
      temperature: {
        url: overlayUrl('temp'),
        attribution: '&copy; OpenWeatherMap contributors',
        opacity: 0.8,
        legend: [
          { color: 'bg-blue-600', labelKey: 'maps.legendVeryCold' },
          { color: 'bg-cyan-400', labelKey: 'maps.legendCold' },
          { color: 'bg-green-500', labelKey: 'maps.legendMild' },
          { color: 'bg-yellow-500', labelKey: 'maps.legendWarm' },
          { color: 'bg-red-600', labelKey: 'maps.legendHot' },
        ],
      },
      rain: {
        url: overlayUrl('precipitation'),
        attribution: '&copy; OpenWeatherMap contributors',
        opacity: 0.85,
        legend: [
          { color: 'bg-sky-300', labelKey: 'maps.legendRainLight' },
          { color: 'bg-blue-500', labelKey: 'maps.legendRainModerate' },
          { color: 'bg-blue-700', labelKey: 'maps.legendRainHeavy' },
          { color: 'bg-indigo-700', labelKey: 'maps.legendRainExtreme' },
        ],
      },
      wind: {
        url: overlayUrl('wind'),
        attribution: '&copy; OpenWeatherMap contributors',
        opacity: 0.8,
        legend: [
          { color: 'bg-sky-300', labelKey: 'maps.legendWindLight' },
          { color: 'bg-green-400', labelKey: 'maps.legendWindModerate' },
          { color: 'bg-yellow-400', labelKey: 'maps.legendWindStrong' },
          { color: 'bg-red-500', labelKey: 'maps.legendWindExtreme' },
        ],
      },
      clouds: {
        url: overlayUrl('clouds'),
        attribution: '&copy; OpenWeatherMap contributors',
        opacity: 0.8,
        legend: [
          { color: 'bg-slate-300', labelKey: 'maps.legendCloudFew' },
          { color: 'bg-slate-400', labelKey: 'maps.legendCloudScattered' },
          { color: 'bg-slate-500', labelKey: 'maps.legendCloudBroken' },
          { color: 'bg-slate-600', labelKey: 'maps.legendCloudOvercast' },
        ],
      },
      pressure: {
        url: overlayUrl('pressure'),
        attribution: '&copy; OpenWeatherMap contributors',
        opacity: 0.8,
        legend: [
          { color: 'bg-blue-400', labelKey: 'maps.legendPressureLow' },
          { color: 'bg-green-400', labelKey: 'maps.legendPressureNormal' },
          { color: 'bg-orange-400', labelKey: 'maps.legendPressureHigh' },
          { color: 'bg-red-500', labelKey: 'maps.legendPressureVeryHigh' },
        ],
      },
    }
  : {}

export const WEATHER_LAYERS = Object.keys(LAYER_CONFIG)

export function getLayerConfig(layer) {
  return LAYER_CONFIG[layer] ?? null
}
