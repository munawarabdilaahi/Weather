import { useMemo } from 'react'
import { useLanguage } from './useLanguage'
import { translations } from '../translations'

export function useTranslation() {
  const lang = useLanguage()

  return useMemo(() => {
    function t(key) {
      return translations[lang]?.[key] ?? translations.en[key] ?? key
    }
    return { t, lang }
  }, [lang])
}
