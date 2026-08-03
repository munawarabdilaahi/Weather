import { useContext } from 'react'
import { LanguageContext } from '../context/context'

export function useLanguage() {
  const lang = useContext(LanguageContext)
  if (lang === null) throw new Error('useLanguage must be used within AppProvider')
  return lang
}
