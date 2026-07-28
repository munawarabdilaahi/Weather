'use client';

import { useState } from 'react';
import { Palette, Wind, Globe, MapPin, Bell, RotateCw, Trash2, Info, Download, Star, Share2, Mail, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appearance: 'dark',
    accentColor: 'blue',
    tempUnit: 'C',
    windUnit: 'kmh',
    pressureUnit: 'hPa',
    visibilityUnit: 'km',
    language: 'english',
    gpsEnabled: true,
    defaultCity: 'Mogadishu',
    severityAlerts: true,
    rainAlerts: true,
    dailyForecast: true,
    weeklyForecast: false,
    autoRefresh: true,
    refreshInterval: 10,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const accentColors = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
    { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
    { name: 'Green', value: 'green', class: 'bg-green-600' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-600' },
    { name: 'Red', value: 'red', class: 'bg-red-600' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your weather app experience</p>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Theme</label>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleSelect('appearance', mode)}
                      className={`px-4 py-2 rounded-lg transition capitalize ${
                        settings.appearance === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Primary Accent Color</label>
                <div className="flex gap-2 flex-wrap">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleSelect('accentColor', color.value)}
                      className={`w-12 h-12 rounded-lg ${color.class} transition transform hover:scale-110 ${
                        settings.accentColor === color.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                      }`}
                      title={color.name}
                    >
                      {settings.accentColor === color.value && (
                        <Check size={24} className="text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Units Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind size={20} />
                Units
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Temperature</label>
                <div className="flex gap-3">
                  {['C', 'F'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handleSelect('tempUnit', unit)}
                      className={`px-4 py-2 rounded-lg transition ${
                        settings.tempUnit === unit
                          ? 'bg-blue-600 text-white'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      °{unit}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Wind Speed</label>
                <select
                  value={settings.windUnit}
                  onChange={(e) => handleSelect('windUnit', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="kmh">km/h</option>
                  <option value="mph">mph</option>
                  <option value="ms">m/s</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Pressure</label>
                <select
                  value={settings.pressureUnit}
                  onChange={(e) => handleSelect('pressureUnit', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hPa">hPa (hectopascal)</option>
                  <option value="mmHg">mmHg (millimeter of mercury)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Visibility</label>
                <select
                  value={settings.visibilityUnit}
                  onChange={(e) => handleSelect('visibilityUnit', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="km">Kilometers</option>
                  <option value="miles">Miles</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="somali">Somali</option>
                <option value="arabic">العربية (Arabic)</option>
                <option value="french">Français (French)</option>
              </select>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Enable GPS Location</p>
                  <p className="text-xs text-muted-foreground mt-1">Allow app to access your location</p>
                </div>
                <Toggle
                  enabled={settings.gpsEnabled}
                  onChange={() => handleToggle('gpsEnabled')}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Default City</label>
                <select
                  value={settings.defaultCity}
                  onChange={(e) => handleSelect('defaultCity', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mogadishu">Mogadishu</option>
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                  <option value="Tokyo">Tokyo</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'severityAlerts', label: 'Severe Weather Alerts', desc: 'Get notified of extreme weather' },
                { key: 'rainAlerts', label: 'Rain Alerts', desc: 'Receive alerts before rain' },
                { key: 'dailyForecast', label: 'Daily Forecast', desc: 'Daily weather summary' },
                { key: 'weeklyForecast', label: 'Weekly Forecast', desc: 'Weekly weather outlook' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Toggle
                    enabled={settings[key]}
                    onChange={() => handleToggle(key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCw size={20} />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto Refresh Weather</p>
                  <p className="text-xs text-muted-foreground mt-1">Automatically update weather data</p>
                </div>
                <Toggle
                  enabled={settings.autoRefresh}
                  onChange={() => handleToggle('autoRefresh')}
                />
              </div>

              {settings.autoRefresh && (
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Refresh Interval</label>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => handleSelect('refreshInterval', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data & Privacy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 size={20} />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-secondary/50 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-foreground">Your data is stored locally on this device and never shared with third parties.</p>
              </div>

              <Button variant="outline" className="w-full">
                Clear Search History
              </Button>
              <Button variant="outline" className="w-full">
                Clear Favorites
              </Button>
              <Button variant="destructive" className="w-full">
                Reset All Settings
              </Button>
            </CardContent>
          </Card>

          {/* About App Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={20} />
                About App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">App Name</span>
                  <span className="font-medium text-foreground">WeatherPro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Build Number</span>
                  <span className="font-medium text-foreground">2024.07.04</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-medium text-foreground">WeatherPro Team</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Download size={16} />
                  Check for Updates
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Star size={16} />
                  Rate App
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Share2 size={16} />
                  Share App
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Mail size={16} />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
