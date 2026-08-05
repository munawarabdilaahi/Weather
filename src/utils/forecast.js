const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const VARIATION_RADIANS = 1.2
const VARIATION_AMPLITUDE = 4
const HIGH_OFFSET = 2
const LOW_OFFSET = -4
const SUNNY_THRESHOLD_OFFSET = 1

export function generateWeeklyFromCurrent(current) {
  const todayIndex = new Date().getDay()
  const baseTemp = current.temp
  return WEEK_DAYS.map((day, dayIndex) => {
    const variation = Math.sin(dayIndex * VARIATION_RADIANS) * VARIATION_AMPLITUDE
    const high = Math.round(baseTemp + variation + HIGH_OFFSET)
    const low = Math.round(baseTemp + variation + LOW_OFFSET)
    const isSunny = high > baseTemp + SUNNY_THRESHOLD_OFFSET
    return {
      day: WEEK_DAYS[(todayIndex + dayIndex) % WEEK_DAYS.length],
      high,
      low,
      condition: isSunny ? 'Sunny' : 'Cloudy',
      icon: isSunny ? 'sun' : 'cloud',
    }
  })
}