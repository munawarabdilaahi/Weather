import { useMemo } from 'react'
import { useApp } from './useApp'
import { translations } from '../translations'

export function useTranslation() {
  const { settings } = useApp()
  const lang = settings.language

  return useMemo(() => {
    function t(key) {
      return translations[lang]?.[key] ?? translations.en[key] ?? key
    }
    return { t, lang }
  }, [lang])
}
