import { memo, useCallback } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/Select'

const CitySelect = memo(function CitySelect({ value, onChange, cities, labelId, labelKey, className = '' }) {
  const { t } = useTranslation()

  const handleValueChange = useCallback((val) => {
    onChange(val)
  }, [onChange])

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={cities.length === 0}>
      <SelectTrigger className={`w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}>
        <SelectValue placeholder={t('common.select')} />
      </SelectTrigger>
      <SelectContent className="min-w-[8rem]">
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

CitySelect.displayName = 'CitySelect'

const UnitSelect = memo(function UnitSelect({ value, onChange, options, labelId, labelKey, className = '' }) {
  const { t } = useTranslation()

  const handleValueChange = useCallback((val) => {
    onChange(val)
  }, [onChange])

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={options.length === 0}>
      <SelectTrigger className={`w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}>
        <SelectValue placeholder={t('common.select')} />
      </SelectTrigger>
      <SelectContent className="min-w-[8rem]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

UnitSelect.displayName = 'UnitSelect'

const LanguageSelect = memo(function LanguageSelect({ value, onChange, languages, labelKey, className = '' }) {
  const { t } = useTranslation()

  const handleValueChange = useCallback((val) => {
    onChange(val)
  }, [onChange])

  const options = languages.map(lang => ({
    value: lang,
    label: t(`settings.lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`)
  }))

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={options.length === 0}>
      <SelectTrigger className={`w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}>
        <SelectValue placeholder={t('common.select')} />
      </SelectTrigger>
      <SelectContent className="min-w-[8rem]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

LanguageSelect.displayName = 'LanguageSelect'

const RefreshIntervalSelect = memo(function RefreshIntervalSelect({ value, onChange, options, labelKey, className = '' }) {
  const { t } = useTranslation()

  const handleValueChange = useCallback((val) => {
    onChange(Number(val))
  }, [onChange])

  return (
    <Select value={String(value)} onValueChange={handleValueChange} disabled={options.length === 0}>
      <SelectTrigger className={`w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}>
        <SelectValue placeholder={t('common.select')} />
      </SelectTrigger>
      <SelectContent className="min-w-[8rem]">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

RefreshIntervalSelect.displayName = 'RefreshIntervalSelect'

export { CitySelect, UnitSelect, LanguageSelect, RefreshIntervalSelect }
