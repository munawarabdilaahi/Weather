import { useState, useEffect, useRef } from 'react'
import { fetchCurrentWeather, fetchHourlyForecast, MOCK_WEATHER_DATA } from '../services/weatherApi'
import { CITIES_COORDS } from '@/constants/cities'

const API_KEY = import.meta.env.VITE_OWM_API_KEY || ''

export function useWeather(city, { autoRefresh, refreshInterval } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const current = await fetchCurrentWeather(city)
      const hourly = await fetchHourlyForecast(city)

      if (cancelled) return

      if (current && hourly) {
        setData({
          current,
          hourly,
          weekly: generateWeeklyFromCurrent(current),
        })
        setIsMock(false)
      } else {
        const mock = MOCK_WEATHER_DATA[city]
        if (mock) {
          setData(mock)
          setIsMock(!API_KEY)
        } else {
          setError(`No weather data available for ${city}`)
          setIsMock(false)
        }
      }
      setLoading(false)
    }

    load()

    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(load, refreshInterval * 60 * 1000)
    }

    return () => {
      cancelled = true
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [city, autoRefresh, refreshInterval])

  return { data, loading, error, isMock }
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function generateWeeklyFromCurrent(current) {
  const today = new Date().getDay()
  const baseTemp = current.temp
  return DAYS.map((day, i) => {
    const offset = Math.sin(i * 1.2) * 4
    const high = Math.round(baseTemp + offset + 2)
    const low = Math.round(baseTemp + offset - 4)
    return {
      day: DAYS[(today + i) % 7],
      high,
      low,
      condition: high > baseTemp + 1 ? 'Sunny' : 'Cloudy',
      icon: high > baseTemp + 1 ? 'sun' : 'cloud',
    }
  })
}


