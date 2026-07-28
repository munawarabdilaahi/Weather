'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Navigation2, Layers, Eye } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card';
import { WeatherIcon } from '@/components/WeatherIcon';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  loading: () => (
    <div className="h-[600px] bg-secondary rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <MapPin size={40} className="text-blue-500" />
        </div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
  ssr: false,
});

const citiesData = {
  'Mogadishu': { lat: 2.0469, lng: 45.3182, temp: 32, condition: 'Sunny', humidity: 65, windSpeed: 12 },
  'London': { lat: 51.5074, lng: -0.1278, temp: 15, condition: 'Cloudy', humidity: 70, windSpeed: 15 },
  'New York': { lat: 40.7128, lng: -74.0060, temp: 12, condition: 'Partly Cloudy', humidity: 72, windSpeed: 10 },
  'Tokyo': { lat: 35.6762, lng: 139.6503, temp: 18, condition: 'Partly Cloudy', humidity: 72, windSpeed: 10 },
};

export default function MapsPage() {
  const [selectedCity, setSelectedCity] = useState('Mogadishu');
  const [searchValue, setSearchValue] = useState('');
  const [weatherLayer, setWeatherLayer] = useState('temperature');
  const [mapZoom, setMapZoom] = useState(4);
  const [recentSearches, setRecentSearches] = useState(['London', 'Tokyo']);

  const cityCoords = citiesData[selectedCity];
  const filteredCities = Object.keys(citiesData).filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchValue('');
    if (!recentSearches.includes(city)) {
      setRecentSearches([city, ...recentSearches].slice(0, 5));
    }
  };

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find closest city
          const closest = Object.entries(citiesData).reduce((prev, [city, { lat, lng }]) => {
            const prevDist = Math.hypot(prev.lat - latitude, prev.lng - longitude);
            const currDist = Math.hypot(lat - latitude, lng - longitude);
            return currDist < prevDist ? { city, lat, lng } : prev;
          });
          setSelectedCity(closest.city);
        },
        () => alert('Unable to access your location')
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Weather Maps</h1>
          <p className="text-muted-foreground">Explore weather conditions around the globe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {searchValue && filteredCities.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Use My Location */}
            <Button
              onClick={handleUseMyLocation}
              className="w-full"
              variant="primary"
            >
              <Navigation2 size={18} />
              Use My Location
            </Button>

            {/* Weather Layers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers size={18} />
                  Weather Layer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['temperature', 'rain', 'wind', 'clouds', 'pressure'].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setWeatherLayer(layer)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm capitalize ${
                      weatherLayer === layer
                        ? 'bg-blue-600 text-white'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye size={18} />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600" />
                  <span>Very Cold (-10 to 0°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-400" />
                  <span>Cold (0 to 10°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>Mild (10 to 20°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span>Warm (20 to 30°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-600" />
                  <span>Hot (30°C+)</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recently Searched</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentSearches.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground flex items-center gap-2"
                    >
                      <MapPin size={14} />
                      {city}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Map */}
            <MapComponent
              selectedCity={selectedCity}
              lat={cityCoords.lat}
              lng={cityCoords.lng}
              zoom={mapZoom}
              onZoomChange={setMapZoom}
              layer={weatherLayer}
            />

            {/* Selected City Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" />
                  {selectedCity}
                </CardTitle>
                <CardDescription>
                  {cityCoords.lat.toFixed(4)}°, {cityCoords.lng.toFixed(4)}°
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <WeatherIcon type={cityCoords.condition === 'Sunny' ? 'sun' : 'cloud'} size={32} />
                    </div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-bold text-foreground">{cityCoords.condition}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500 mb-1">{cityCoords.temp}°</p>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400 mb-1">{cityCoords.humidity}%</p>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400 mb-1">{cityCoords.windSpeed}</p>
                    <p className="text-sm text-muted-foreground">Wind (km/h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
