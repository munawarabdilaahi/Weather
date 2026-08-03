import { useContext } from 'react'
import { SettingsContext } from '../context/context'

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within AppProvider')
  return ctx
}
