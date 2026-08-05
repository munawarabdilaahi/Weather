import { convertTemp } from '../utils/units'

const API_KEY = import.meta.env.VITE_OWM_API_KEY || ''
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const CACHE_TTL = 60_000
const cache = new Map()
const inflight = new Map()

const LAST_REAL_PREFIX = 'weather.lastReal:'

function lastRealKey(city) {
  return LAST_REAL_PREFIX + city
}

export function saveLastRealWeather(city, current, hourly) {
  try {
    localStorage.setItem(
      lastRealKey(city),
      JSON.stringify({ current, hourly, storedAt: Date.now() })
    )
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

export function getLastRealWeather(city) {
  try {
    const raw = localStorage.getItem(lastRealKey(city))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.current) return null
    return parsed
  } catch {
    return null
  }
}

function cachedFetch(key, factory) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return Promise.resolve(cached.value)
  }
  if (inflight.has(key)) return inflight.get(key)
  const promise = factory().then((value) => {
    if (value) cache.set(key, { value, fetchedAt: Date.now() })
    return value
  }).finally(() => {
    inflight.delete(key)
  })
  inflight.set(key, promise)
  return promise
}

export function fetchCurrentWeather(city) {
  if (!API_KEY) return Promise.resolve(null)
  return cachedFetch(`current:${city}`, () => fetchCurrentWeatherOnce(city))
}

async function fetchCurrentWeatherOnce(city) {
  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    )
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
    const data = await res.json()
    return {
      temp: Math.round(data.main.temp),
      tempF: convertTemp(data.main.temp, 'F'),
      condition: data.weather[0].main,
      icon: mapOpenWeatherIcon(data.weather[0].icon),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      uv: 0,
      visibility: Math.round(data.visibility / 1000),
      pressure: data.main.pressure,
      feelsLike: Math.round(data.main.feels_like),
      feelsLikeF: convertTemp(data.main.feels_like, 'F'),
    }
  } catch {
    return null
  }
}

export function fetchHourlyForecast(city) {
  if (!API_KEY) return Promise.resolve(null)
  return cachedFetch(`forecast:${city}`, () => fetchHourlyForecastOnce(city))
}

async function fetchHourlyForecastOnce(city) {
  try {
    const res = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&cnt=8&appid=${API_KEY}`
    )
    if (!res.ok) throw new Error(`Forecast API error: ${res.status}`)
    const data = await res.json()
    return data.list.map((item) => ({
      hour: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: mapOpenWeatherIcon(item.weather[0].icon),
    }))
  } catch {
    return null
  }
}

function mapOpenWeatherIcon(iconCode) {
  if (!iconCode) return 'sun'
  if (iconCode.startsWith('01')) return 'sun'
  if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return 'cloud'
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'rain'
  if (iconCode.startsWith('13')) return 'snow'
  return 'cloud'
}

function createMockData(baseTemp, condition, icon, humidity, windSpeed, uv, visibility, pressure) {
  const feelsLike = baseTemp + 3
  const tempF = convertTemp(baseTemp, 'F')
  const feelsLikeF = convertTemp(feelsLike, 'F')

  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hourTemp = Math.round(baseTemp + Math.sin((i - 6) * Math.PI / 12) * 5)
    const hourCondition = i > 6 && i < 18 ? condition : 'Clear'
    const hourIcon = hourCondition === 'Clear' ? 'sun' : icon
    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      temp: hourTemp,
      condition: hourCondition,
      icon: hourIcon,
    }
  })

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekly = DAYS.map((day, i) => {
    const offset = Math.sin(i * 1.2) * 3
    return {
      day,
      high: Math.round(baseTemp + offset + 2),
      low: Math.round(baseTemp + offset - 5),
      condition: i % 3 === 0 ? condition : i % 3 === 1 ? 'Cloudy' : 'Sunny',
      icon: i % 3 === 0 ? icon : 'cloud',
    }
  })

  return {
    current: { temp: baseTemp, tempF, condition, icon, humidity, windSpeed, uv, visibility, pressure, feelsLike, feelsLikeF },
    hourly,
    weekly,
  }
}

export const MOCK_WEATHER_DATA = {
  'Mogadishu':  createMockData(32, 'Sunny', 'sun', 65, 12, 11, 10, 1013),
  'Addis Ababa': createMockData(22, 'Partly Cloudy', 'cloud', 55, 8, 7, 10, 1015),
  'Berlin':     createMockData(16, 'Cloudy', 'cloud', 68, 14, 4, 8, 1016),
  'Bosaso':     createMockData(34, 'Sunny', 'sun', 55, 18, 11, 10, 1012),
  'Buur-cukur': createMockData(30, 'Sunny', 'sun', 60, 10, 10, 9, 1013),
  'Cairo':      createMockData(28, 'Sunny', 'sun', 40, 14, 8, 10, 1012),
  'Djibouti':   createMockData(35, 'Sunny', 'sun', 50, 16, 11, 9, 1011),
  'Doha':       createMockData(33, 'Sunny', 'sun', 45, 12, 10, 10, 1012),
  'Dubai':      createMockData(34, 'Sunny', 'sun', 50, 14, 10, 10, 1011),
  'Garowe':     createMockData(33, 'Sunny', 'sun', 55, 16, 11, 10, 1012),
  'Hargeisa':   createMockData(28, 'Sunny', 'sun', 50, 14, 10, 10, 1013),
  'Istanbul':   createMockData(20, 'Partly Cloudy', 'cloud', 65, 12, 5, 8, 1014),
  'Kismayo':    createMockData(31, 'Sunny', 'sun', 68, 14, 10, 9, 1013),
  'London':     createMockData(15, 'Cloudy', 'cloud', 70, 15, 4, 8, 1012),
  'Nairobi':    createMockData(24, 'Partly Cloudy', 'cloud', 60, 10, 8, 10, 1015),
  'New York':   createMockData(12, 'Partly Cloudy', 'cloud', 72, 10, 5, 10, 1014),
  'Paris':      createMockData(17, 'Cloudy', 'cloud', 65, 12, 4, 8, 1015),
  'Riyadh':     createMockData(36, 'Sunny', 'sun', 25, 12, 10, 10, 1010),
  'Tokyo':      createMockData(18, 'Partly Cloudy', 'cloud', 72, 10, 5, 8, 1015),
  'Toronto':    createMockData(10, 'Cloudy', 'cloud', 70, 16, 3, 10, 1016),
}
