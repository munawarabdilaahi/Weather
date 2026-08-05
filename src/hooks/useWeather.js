import { useState, useEffect, useRef, useCallback } from 'react'
import {
  fetchCurrentWeather,
  fetchHourlyForecast,
  saveLastRealWeather,
  getLastRealWeather,
  MOCK_WEATHER_DATA,
} from '../services/weatherApi'
import { generateWeeklyFromCurrent } from '../utils/forecast'

function buildPayload(current, hourly) {
  return {
    current,
    hourly,
    weekly: generateWeeklyFromCurrent(current),
  }
}

function buildFromCached(cached) {
  return buildPayload(cached.current, cached.hourly)
}

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
    const handleOnline = () => setIsOffline(false)

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

      // Offline: never hit the network. Prefer the last successful real
      // payload; fall back to mock ONLY when no real data was ever persisted.
      if (isOffline) {
        const cached = getLastRealWeather(city)
        if (cached) {
          setData(buildFromCached(cached))
          setIsMock(false)
          setLastUpdated(new Date(cached.storedAt))
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
        return
      }

      const [current, hourly] = await Promise.all([
        fetchCurrentWeather(city),
        fetchHourlyForecast(city),
      ])

      if (cancelled) return

      if (current && hourly) {
        setData(buildPayload(current, hourly))
        setIsMock(false)
        setLastUpdated(new Date())
        saveLastRealWeather(city, current, hourly)
      } else {
        // Fetch failed while online. Never replace real data with mock;
        // fall back to the last real snapshot if we have one.
        const cached = getLastRealWeather(city)
        if (cached) {
          setData(buildFromCached(cached))
          setIsMock(false)
          setLastUpdated(new Date(cached.storedAt))
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
      }
      setLoading(false)
    }

    load()

    // Auto-refresh is intentionally NOT started while offline. Toggling
    // back online changes `isOffline`, re-running this effect, which
    // re-fetches and restarts the interval automatically.
    if (!isOffline && autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(load, refreshInterval * 60 * 1000)
    }

    return () => {
      cancelled = true
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      loadRef.current = null
    }
  }, [city, autoRefresh, refreshInterval, isOffline])

  const refetch = useCallback(() => {
    loadRef.current?.()
  }, [])

  return { data, loading, error, isMock, refetch, lastUpdated, isOffline }
}


