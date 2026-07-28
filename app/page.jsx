'use client';

import { useState } from 'react';
import { Gauge, Droplets, Wind, Eye } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroCard } from '@/components/HeroCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { Card } from '@/components/Card';

// Mock weather data for cities
const weatherData = {
  'Mogadishu': {
    current: {
      temp: 32,
      tempF: 90,
      condition: 'Sunny',
      icon: 'sun',
      humidity: 65,
      windSpeed: 12,
      uv: 11,
      visibility: 10,
      pressure: 1013,
      feelsLike: 35,
      feelsLikeF: 95,
    },
    hourly: [
      { hour: '00:00', temp: 28, condition: 'Clear', icon: 'sun' },
      { hour: '01:00', temp: 27, condition: 'Clear', icon: 'sun' },
      { hour: '02:00', temp: 26, condition: 'Clear', icon: 'sun' },
      { hour: '03:00', temp: 25, condition: 'Cloudy', icon: 'cloud' },
      { hour: '04:00', temp: 25, condition: 'Cloudy', icon: 'cloud' },
      { hour: '05:00', temp: 26, condition: 'Clear', icon: 'sun' },
      { hour: '06:00', temp: 28, condition: 'Clear', icon: 'sun' },
      { hour: '07:00', temp: 30, condition: 'Clear', icon: 'sun' },
      { hour: '08:00', temp: 32, condition: 'Sunny', icon: 'sun' },
      { hour: '09:00', temp: 34, condition: 'Sunny', icon: 'sun' },
      { hour: '10:00', temp: 35, condition: 'Sunny', icon: 'sun' },
      { hour: '11:00', temp: 36, condition: 'Sunny', icon: 'sun' },
      { hour: '12:00', temp: 36, condition: 'Sunny', icon: 'sun' },
      { hour: '13:00', temp: 35, condition: 'Sunny', icon: 'sun' },
      { hour: '14:00', temp: 34, condition: 'Sunny', icon: 'sun' },
      { hour: '15:00', temp: 33, condition: 'Sunny', icon: 'sun' },
      { hour: '16:00', temp: 32, condition: 'Clear', icon: 'sun' },
      { hour: '17:00', temp: 31, condition: 'Clear', icon: 'sun' },
      { hour: '18:00', temp: 29, condition: 'Clear', icon: 'sun' },
      { hour: '19:00', temp: 28, condition: 'Clear', icon: 'sun' },
      { hour: '20:00', temp: 27, condition: 'Clear', icon: 'sun' },
      { hour: '21:00', temp: 26, condition: 'Cloudy', icon: 'cloud' },
      { hour: '22:00', temp: 25, condition: 'Cloudy', icon: 'cloud' },
      { hour: '23:00', temp: 24, condition: 'Cloudy', icon: 'cloud' },
    ],
    weekly: [
      { day: 'Mon', high: 35, low: 24, condition: 'Sunny', icon: 'sun' },
      { day: 'Tue', high: 34, low: 23, condition: 'Sunny', icon: 'sun' },
      { day: 'Wed', high: 30, low: 22, condition: 'Rainy', icon: 'rain' },
      { day: 'Thu', high: 28, low: 20, condition: 'Rainy', icon: 'rain' },
      { day: 'Fri', high: 32, low: 22, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Sat', high: 36, low: 25, condition: 'Sunny', icon: 'sun' },
      { day: 'Sun', high: 35, low: 24, condition: 'Sunny', icon: 'sun' },
    ],
  },
  'London': {
    current: {
      temp: 15,
      tempF: 59,
      condition: 'Cloudy',
      icon: 'cloud',
      humidity: 70,
      windSpeed: 15,
      uv: 4,
      visibility: 8,
      pressure: 1012,
      feelsLike: 13,
      feelsLikeF: 55,
    },
    hourly: [
      { hour: '00:00', temp: 14, condition: 'Cloudy', icon: 'cloud' },
      { hour: '01:00', temp: 13, condition: 'Cloudy', icon: 'cloud' },
      { hour: '02:00', temp: 13, condition: 'Cloudy', icon: 'cloud' },
      { hour: '03:00', temp: 12, condition: 'Rainy', icon: 'rain' },
      { hour: '04:00', temp: 12, condition: 'Rainy', icon: 'rain' },
      { hour: '05:00', temp: 12, condition: 'Cloudy', icon: 'cloud' },
      { hour: '06:00', temp: 13, condition: 'Cloudy', icon: 'cloud' },
      { hour: '07:00', temp: 14, condition: 'Cloudy', icon: 'cloud' },
      { hour: '08:00', temp: 14, condition: 'Cloudy', icon: 'cloud' },
      { hour: '09:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '10:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '11:00', temp: 16, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '12:00', temp: 16, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '13:00', temp: 16, condition: 'Cloudy', icon: 'cloud' },
      { hour: '14:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '15:00', temp: 15, condition: 'Rainy', icon: 'rain' },
      { hour: '16:00', temp: 14, condition: 'Rainy', icon: 'rain' },
      { hour: '17:00', temp: 14, condition: 'Rainy', icon: 'rain' },
      { hour: '18:00', temp: 13, condition: 'Cloudy', icon: 'cloud' },
      { hour: '19:00', temp: 13, condition: 'Cloudy', icon: 'cloud' },
      { hour: '20:00', temp: 12, condition: 'Clear', icon: 'sun' },
      { hour: '21:00', temp: 12, condition: 'Clear', icon: 'sun' },
      { hour: '22:00', temp: 11, condition: 'Clear', icon: 'sun' },
      { hour: '23:00', temp: 11, condition: 'Cloudy', icon: 'cloud' },
    ],
    weekly: [
      { day: 'Mon', high: 16, low: 12, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Tue', high: 15, low: 11, condition: 'Rainy', icon: 'rain' },
      { day: 'Wed', high: 14, low: 10, condition: 'Rainy', icon: 'rain' },
      { day: 'Thu', high: 15, low: 11, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Fri', high: 16, low: 12, condition: 'Partly Cloudy', icon: 'cloud' },
      { day: 'Sat', high: 17, low: 13, condition: 'Sunny', icon: 'sun' },
      { day: 'Sun', high: 16, low: 12, condition: 'Sunny', icon: 'sun' },
    ],
  },
  'New York': {
    current: {
      temp: 12,
      tempF: 54,
      condition: 'Partly Cloudy',
      icon: 'cloud',
      humidity: 72,
      windSpeed: 10,
      uv: 5,
      visibility: 10,
      pressure: 1014,
      feelsLike: 10,
      feelsLikeF: 50,
    },
    hourly: [
      { hour: '00:00', temp: 10, condition: 'Clear', icon: 'sun' },
      { hour: '01:00', temp: 9, condition: 'Clear', icon: 'sun' },
      { hour: '02:00', temp: 9, condition: 'Clear', icon: 'sun' },
      { hour: '03:00', temp: 8, condition: 'Clear', icon: 'sun' },
      { hour: '04:00', temp: 8, condition: 'Cloudy', icon: 'cloud' },
      { hour: '05:00', temp: 9, condition: 'Cloudy', icon: 'cloud' },
      { hour: '06:00', temp: 10, condition: 'Cloudy', icon: 'cloud' },
      { hour: '07:00', temp: 11, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '08:00', temp: 12, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '09:00', temp: 13, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '10:00', temp: 14, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '11:00', temp: 14, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '12:00', temp: 14, condition: 'Sunny', icon: 'sun' },
      { hour: '13:00', temp: 14, condition: 'Sunny', icon: 'sun' },
      { hour: '14:00', temp: 13, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '15:00', temp: 12, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '16:00', temp: 11, condition: 'Cloudy', icon: 'cloud' },
      { hour: '17:00', temp: 10, condition: 'Cloudy', icon: 'cloud' },
      { hour: '18:00', temp: 9, condition: 'Cloudy', icon: 'cloud' },
      { hour: '19:00', temp: 8, condition: 'Clear', icon: 'sun' },
      { hour: '20:00', temp: 8, condition: 'Clear', icon: 'sun' },
      { hour: '21:00', temp: 8, condition: 'Clear', icon: 'sun' },
      { hour: '22:00', temp: 8, condition: 'Clear', icon: 'sun' },
      { hour: '23:00', temp: 9, condition: 'Cloudy', icon: 'cloud' },
    ],
    weekly: [
      { day: 'Mon', high: 14, low: 8, condition: 'Partly Cloudy', icon: 'cloud' },
      { day: 'Tue', high: 13, low: 7, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Wed', high: 12, low: 6, condition: 'Rainy', icon: 'rain' },
      { day: 'Thu', high: 11, low: 5, condition: 'Rainy', icon: 'rain' },
      { day: 'Fri', high: 13, low: 7, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Sat', high: 15, low: 9, condition: 'Sunny', icon: 'sun' },
      { day: 'Sun', high: 14, low: 8, condition: 'Sunny', icon: 'sun' },
    ],
  },
  'Tokyo': {
    current: {
      temp: 18,
      tempF: 64,
      condition: 'Partly Cloudy',
      icon: 'cloud',
      humidity: 72,
      windSpeed: 10,
      uv: 5,
      visibility: 8,
      pressure: 1015,
      feelsLike: 17,
      feelsLikeF: 63,
    },
    hourly: [
      { hour: '00:00', temp: 16, condition: 'Cloudy', icon: 'cloud' },
      { hour: '01:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '02:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '03:00', temp: 14, condition: 'Clear', icon: 'sun' },
      { hour: '04:00', temp: 14, condition: 'Clear', icon: 'sun' },
      { hour: '05:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '06:00', temp: 16, condition: 'Cloudy', icon: 'cloud' },
      { hour: '07:00', temp: 17, condition: 'Cloudy', icon: 'cloud' },
      { hour: '08:00', temp: 18, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '09:00', temp: 19, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '10:00', temp: 19, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '11:00', temp: 20, condition: 'Sunny', icon: 'sun' },
      { hour: '12:00', temp: 20, condition: 'Sunny', icon: 'sun' },
      { hour: '13:00', temp: 19, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '14:00', temp: 18, condition: 'Partly Cloudy', icon: 'cloud' },
      { hour: '15:00', temp: 17, condition: 'Cloudy', icon: 'cloud' },
      { hour: '16:00', temp: 17, condition: 'Cloudy', icon: 'cloud' },
      { hour: '17:00', temp: 16, condition: 'Cloudy', icon: 'cloud' },
      { hour: '18:00', temp: 16, condition: 'Cloudy', icon: 'cloud' },
      { hour: '19:00', temp: 15, condition: 'Clear', icon: 'sun' },
      { hour: '20:00', temp: 15, condition: 'Clear', icon: 'sun' },
      { hour: '21:00', temp: 15, condition: 'Clear', icon: 'sun' },
      { hour: '22:00', temp: 15, condition: 'Cloudy', icon: 'cloud' },
      { hour: '23:00', temp: 16, condition: 'Cloudy', icon: 'cloud' },
    ],
    weekly: [
      { day: 'Mon', high: 20, low: 14, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Tue', high: 21, low: 15, condition: 'Sunny', icon: 'sun' },
      { day: 'Wed', high: 19, low: 13, condition: 'Rainy', icon: 'rain' },
      { day: 'Thu', high: 18, low: 12, condition: 'Rainy', icon: 'rain' },
      { day: 'Fri', high: 20, low: 14, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Sat', high: 22, low: 16, condition: 'Sunny', icon: 'sun' },
      { day: 'Sun', high: 21, low: 15, condition: 'Sunny', icon: 'sun' },
    ],
  },
};

const cities = ['Mogadishu', 'London', 'New York', 'Tokyo'];

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('Mogadishu');
  const [unit, setUnit] = useState('C');
  const currentData = weatherData[selectedCity];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 space-y-6">
            {/* City selector and unit toggle */}
            <div className="flex gap-4 flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Weather for {selectedCity}</p>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
                {/* City selector */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                {/* Temperature Toggle */}
                <div className="flex items-center bg-secondary rounded-lg p-0.5">
                  <button
                    onClick={() => setUnit('C')}
                    className={`px-4 py-2 rounded transition text-sm font-medium ${
                      unit === 'C'
                        ? 'bg-blue-500 text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setUnit('F')}
                    className={`px-4 py-2 rounded transition text-sm font-medium ${
                      unit === 'F'
                        ? 'bg-blue-500 text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <HeroCard data={currentData} unit={unit} />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hourly Forecast - Full Width */}
              <div className="lg:col-span-2">
                <HourlyForecast data={currentData} unit={unit} />
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <Card>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
                    Additional Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Gauge size={16} /> Pressure
                      </span>
                      <span className="font-bold text-foreground">{currentData.current.pressure} mb</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Eye size={16} /> Visibility
                      </span>
                      <span className="font-bold text-foreground">{currentData.current.visibility} km</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Droplets size={16} /> Humidity
                      </span>
                      <span className="font-bold text-foreground">{currentData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Wind size={16} /> Wind Speed
                      </span>
                      <span className="font-bold text-foreground">{currentData.current.windSpeed} km/h</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 7-Day Forecast - Full Width */}
              <div className="lg:col-span-3">
                <WeeklyForecast data={currentData} unit={unit} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
