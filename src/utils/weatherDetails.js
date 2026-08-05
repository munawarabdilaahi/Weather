const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
]

const AQI_LEVELS = [
  { max: 50, key: 'aqi.good', className: 'text-emerald-600 dark:text-emerald-400' },
  { max: 100, key: 'aqi.moderate', className: 'text-yellow-600 dark:text-yellow-400' },
  { max: 150, key: 'aqi.unhealthySensitive', className: 'text-orange-600 dark:text-orange-400' },
  { max: 200, key: 'aqi.unhealthy', className: 'text-red-600 dark:text-red-400' },
  { max: Infinity, key: 'aqi.veryUnhealthy', className: 'text-purple-600 dark:text-purple-400' },
]

const COMPASS_SEGMENTS = 16
const DEGREES_PER_SEGMENT = 360 / COMPASS_SEGMENTS

const SUNRISE_START_MINUTES = 5 * 60 // 05:00
const SUNRISE_SPAN_MINUTES = 120 // up to 07:00
const SUNSET_START_MINUTES = 18 * 60 // 18:00
const SUNSET_SPAN_MINUTES = 120 // up to 20:00
const AQI_MIN = 20
const AQI_SPAN = 130
const RAIN_JITTER_SPAN = 25
const RAIN_BASE = { rain: 60, snow: 35, cloud: 12 }

function createSeededRandom(seed) {
  let state = seed >>> 0
  return function () {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function windDirectionLabel(degrees) {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.floor(normalized / DEGREES_PER_SEGMENT + 0.5) % COMPASS_POINTS.length
  return COMPASS_POINTS[index]
}

export function aqiLevel(aqi) {
  return AQI_LEVELS.find((level) => aqi <= level.max)
}

export function formatMinutesAsTime(minutes, locale) {
  const hours = (Math.floor(minutes / 60) + 24) % 24
  const date = new Date(2000, 0, 1, hours, minutes % 60)
  return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })
}

export function deriveWeatherDetails(current) {
  const seed = Math.round(
    (current.temp ?? 0) * 997 +
    (current.humidity ?? 0) * 13 +
    (current.windSpeed ?? 0) * 51 +
    (current.pressure ?? 0)
  )
  const rand = createSeededRandom(seed)

  const sunriseMinutes = Math.floor(SUNRISE_START_MINUTES + rand() * SUNRISE_SPAN_MINUTES)
  const sunsetMinutes = Math.floor(SUNSET_START_MINUTES + rand() * SUNSET_SPAN_MINUTES)
  const windDeg = Math.floor(rand() * 360)
  const aqi = Math.floor(AQI_MIN + rand() * AQI_SPAN)

  const baseRain = RAIN_BASE[current.icon] ?? 2
  const rainProbability = Math.min(95, Math.max(0, baseRain + Math.floor(rand() * RAIN_JITTER_SPAN)))

  return {
    sunriseMinutes,
    sunsetMinutes,
    windDeg,
    windDirection: windDirectionLabel(windDeg),
    aqi,
    rainProbability,
  }
}