import { useState, useCallback, useEffect, useMemo } from 'react'
import { AppContext, SettingsContext, LanguageContext } from './context'

const ACCENT_PALETTE = {
  blue:   { primary: '#3b82f6', accent: '#06b6d4' },
  cyan:   { primary: '#06b6d4', accent: '#3b82f6' },
  green:  { primary: '#16a34a', accent: '#22c55e' },
  purple: { primary: '#9333ea', accent: '#a855f7' },
  red:    { primary: '#dc2626', accent: '#ef4444' },
  orange: { primary: '#ea580c', accent: '#f97316' },
}

const DEFAULT_CITY = 'Mogadishu'

const DEFAULT_SETTINGS = {
  appearance: 'dark',
  accentColor: 'blue',
  tempUnit: 'C',
  windUnit: 'kmh',
  pressureUnit: 'hPa',
  visibilityUnit: 'km',
  language: 'english',
  gpsEnabled: true,
  defaultCity: DEFAULT_CITY,
  notificationsEnabled: false,
  autoRefresh: true,
  refreshInterval: 10,
}

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('weather-sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('weather-sidebar-collapsed', JSON.stringify(sidebarCollapsed))
    } catch {}
  }, [sidebarCollapsed])

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('weather-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [selectedCity, setSelectedCity] = useState(() => settings.defaultCity || DEFAULT_CITY)

  useEffect(() => {
    try {
      localStorage.setItem('weather-settings', JSON.stringify(settings))
    } catch {}
  }, [settings])

  useEffect(() => {
    const root = document.documentElement

    function applyTheme(isDark) {
      root.classList.toggle('dark', isDark)
      root.classList.toggle('light', !isDark)
      root.style.colorScheme = isDark ? 'dark' : 'light'
    }

    if (settings.appearance === 'dark') {
      applyTheme(true)
      return
    }

    if (settings.appearance === 'light') {
      applyTheme(false)
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    applyTheme(mq.matches)

    const handler = (e) => applyTheme(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings.appearance])

  useEffect(() => {
    const colors = ACCENT_PALETTE[settings.accentColor] || ACCENT_PALETTE.blue
    const root = document.documentElement
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--ring', colors.primary)
    root.style.setProperty('--sidebar-primary', colors.primary)
    root.style.setProperty('--sidebar-ring', colors.primary)
    root.style.setProperty('--chart-1', colors.primary)
    root.style.setProperty('--chart-2', colors.accent)
  }, [settings.accentColor])

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    if (key === 'defaultCity') setSelectedCity(value)
  }, [])

  const toggleSetting = useCallback((key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setSelectedCity(DEFAULT_CITY)
  }, [])

  const appValue = useMemo(() => ({
    selectedCity,
    setSelectedCity,
    sidebarCollapsed,
    setSidebarCollapsed,
  }), [selectedCity, sidebarCollapsed])

  const settingsValue = useMemo(() => ({
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
  }), [settings, updateSetting, toggleSetting, resetSettings])

  return (
    <AppContext.Provider value={appValue}>
      <SettingsContext.Provider value={settingsValue}>
        <LanguageContext.Provider value={settings.language}>
          {children}
        </LanguageContext.Provider>
      </SettingsContext.Provider>
    </AppContext.Provider>
  )
}
