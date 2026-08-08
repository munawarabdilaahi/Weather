import { CITIES_COORDS } from '../constants/cities'

/**
 * Returns the city whose coordinates are closest to the given latitude/longitude.
 */
export function findNearestCity(latitude, longitude) {
  const entries = Object.entries(CITIES_COORDS)
  let best = { city: entries[0][0], lat: entries[0][1].lat, lng: entries[0][1].lng }
  let bestDist = Math.hypot(best.lat - latitude, best.lng - longitude)

  for (let i = 1; i < entries.length; i++) {
    const [city, { lat, lng }] = entries[i]
    const dist = Math.hypot(lat - latitude, lng - longitude)
    if (dist < bestDist) {
      bestDist = dist
      best = { city, lat, lng }
    }
  }

  return best
}