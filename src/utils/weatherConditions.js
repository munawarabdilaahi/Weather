const WEATHER_CONDITION_KEYS = {
  'Clear': 'weather.clear',
  'Clouds': 'weather.clouds',
  'Rain': 'weather.rain',
  'Drizzle': 'weather.drizzle',
  'Mist': 'weather.mist',
  'Snow': 'weather.snow',
  'Thunderstorm': 'weather.thunderstorm',
  'Fog': 'weather.fog',
  'Smoke': 'weather.smoke',
  'Haze': 'weather.haze',
  'Dust': 'weather.dust',
  'Sand': 'weather.sand',
  'Ash': 'weather.ash',
  'Squall': 'weather.squall',
  'Tornado': 'weather.tornado',
  'Sunny': 'weather.sunny',
  'Cloudy': 'weather.cloudy',
  'Rainy': 'weather.rainy',
  'Partly Cloudy': 'weather.partlyCloudy',
}

export function weatherConditionKey(condition) {
  if (!condition) return 'weather.clear'
  return WEATHER_CONDITION_KEYS[condition.trim()] ?? condition
}
