import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchCurrentWeather, fetchHourlyForecast, MOCK_WEATHER_DATA } from '../services/weatherApi'
import { generateWeeklyFromCurrent } from '../utils/forecast'

export function useWeather(city, { autoRefresh, refreshInterval } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  )
  const intervalRef = useRef(null)
  const loadRef = useRef(null)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => {
      setIsOffline(false)
      loadRef.current?.()
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      loadRef.current = load
      setLoading(true)
      setError(null)

      const [current, hourly] = await Promise.all([
        fetchCurrentWeather(city),
        fetchHourlyForecast(city),
      ])

      if (cancelled) return

      if (current && hourly) {
        setData({
          current,
          hourly,
          weekly: generateWeeklyFromCurrent(current),
        })
        setIsMock(false)
        setLastUpdated(new Date())
      } else {
        const mock = MOCK_WEATHER_DATA[city]
        if (mock) {
          setData(mock)
          setIsMock(true)
          setLastUpdated(new Date())
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
      loadRef.current = null
    }
  }, [city, autoRefresh, refreshInterval])

  const refetch = useCallback(() => {
    loadRef.current?.()
  }, [])

  return { data, loading, error, isMock, refetch, lastUpdated, isOffline }
}


