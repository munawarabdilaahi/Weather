export function convertTemp(celsius, unit) {
  return unit === 'F' ? Math.round(celsius * 9 / 5 + 32) : celsius
}

export function convertWindSpeed(kmh, unit) {
  const value = kmh ?? 0
  if (unit === 'ms') return Math.round(value / 3.6)
  if (unit === 'mph') return Math.round(value / 1.609)
  return kmh
}

export function windLabelFor(unit) {
  return { kmh: 'km/h', mph: 'mph', ms: 'm/s' }[unit] || 'km/h'
}

export function convertVisibility(km, unit) {
  if (unit === 'miles') return ((km ?? 0) / 1.609).toFixed(1)
  return km
}

export function visibilityLabelFor(unit) {
  return unit === 'miles' ? 'mi' : 'km'
}

export function convertPressure(hPa, unit) {
  if (unit === 'mmHg') return Math.round((hPa ?? 0) * 0.75006)
  return hPa
}

export function pressureLabelFor(unit) {
  return unit === 'mmHg' ? 'mmHg' : 'mb'
}

export function windSpeedFor(kmh, unit) {
  return { value: convertWindSpeed(kmh, unit), label: windLabelFor(unit) }
}

export function visibilityFor(km, unit) {
  return { value: convertVisibility(km, unit), label: visibilityLabelFor(unit) }
}
