import { useMemo } from 'react'
import { useLanguage } from './useLanguage'
import { translations } from '../translations'

const LANG_TO_TABLE = { english: 'en', somali: 'so' }

export function useTranslation() {
  const lang = useLanguage()

  return useMemo(() => {
    const table = translations[LANG_TO_TABLE[lang] || 'en']
    function t(key) {
      return table?.[key] ?? translations.en[key] ?? key
    }
    return { t, lang }
  }, [lang])
}
