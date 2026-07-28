import { Palette, Wind, Globe, MapPin, Bell, RotateCw, Trash2, Info, Download, Star, Share2, Mail, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { useApp } from '@/hooks/useApp';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsPage() {
  const { settings, updateSetting, toggleSetting, resetSettings, cities } = useApp();
  const { t } = useTranslation();

  const notify = (msg) => alert(msg)

  const accentColors = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
    { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
    { name: 'Green', value: 'green', class: 'bg-green-600' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-600' },
    { name: 'Red', value: 'red', class: 'bg-red-600' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} />
                {t('settings.appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">{t('settings.theme')}</label>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                      key={mode}
                      role="radio"
                      aria-checked={settings.appearance === mode}
                      onClick={() => updateSetting('appearance', mode)}
                      className={`px-4 py-2 rounded-lg transition capitalize ${
                        settings.appearance === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {t('settings.theme' + mode.charAt(0).toUpperCase() + mode.slice(1))}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">{t('settings.accentColor')}</label>
                <div className="flex gap-2 flex-wrap">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSetting('accentColor', color.value)}
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
                {t('settings.units')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">{t('settings.temperature')}</label>
                <div className="flex gap-3">
                  {['C', 'F'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => updateSetting('tempUnit', unit)}
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
                <label className="text-sm font-medium text-foreground block mb-2">{t('settings.windSpeed')}</label>
                <select
                  value={settings.windUnit}
                  onChange={(e) => updateSetting('windUnit', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="kmh">{t('settings.windKmh')}</option>
                  <option value="mph">{t('settings.windMph')}</option>
                  <option value="ms">{t('settings.windMs')}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">{t('settings.pressure')}</label>
                <select
                  value={settings.pressureUnit}
                  onChange={(e) => updateSetting('pressureUnit', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hPa">{t('settings.pressureHpa')}</option>
                  <option value="mmHg">{t('settings.pressureMmhg')}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">{t('settings.visibility')}</label>
                <select
                  value={settings.visibilityUnit}
                  onChange={(e) => updateSetting('visibilityUnit', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="km">{t('settings.visibilityKm')}</option>
                  <option value="miles">{t('settings.visibilityMiles')}</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                {t('settings.language')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">{t('settings.langEnglish')}</option>
                <option value="somali">{t('settings.langSomali')}</option>
              </select>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                {t('settings.location')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('settings.gpsEnabled')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('settings.gpsDesc')}</p>
                </div>
                <Toggle
                  enabled={settings.gpsEnabled}
                  onChange={() => toggleSetting('gpsEnabled')}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">{t('settings.defaultCity')}</label>
                <select
                  value={settings.defaultCity}
                  onChange={(e) => updateSetting('defaultCity', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'severityAlerts', labelKey: 'settings.severeAlerts', descKey: 'settings.severeAlertsDesc' },
                { key: 'rainAlerts', labelKey: 'settings.rainAlerts', descKey: 'settings.rainAlertsDesc' },
                { key: 'dailyForecast', labelKey: 'settings.dailyForecastNotif', descKey: 'settings.dailyForecastDesc' },
                { key: 'weeklyForecast', labelKey: 'settings.weeklyForecastNotif', descKey: 'settings.weeklyForecastDesc' },
              ].map(({ key, labelKey, descKey }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t(labelKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(descKey)}</p>
                  </div>
                  <Toggle
                    enabled={settings[key]}
                    onChange={() => toggleSetting(key)}
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
                {t('settings.preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('settings.autoRefresh')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('settings.autoRefreshDesc')}</p>
                </div>
                <Toggle
                  enabled={settings.autoRefresh}
                  onChange={() => toggleSetting('autoRefresh')}
                />
              </div>

              {settings.autoRefresh && (
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">{t('settings.refreshInterval')}</label>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">{t('settings.interval5')}</option>
                    <option value="10">{t('settings.interval10')}</option>
                    <option value="30">{t('settings.interval30')}</option>
                    <option value="60">{t('settings.interval60')}</option>
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
                {t('settings.dataPrivacy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-secondary/50 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-foreground">{t('settings.privacyNote')}</p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => notify(t('settings.searchCleared'))}>
                {t('settings.clearSearch')}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => notify(t('settings.favoritesCleared'))}>
                {t('settings.clearFavorites')}
              </Button>
              <Button variant="destructive" className="w-full" onClick={() => { resetSettings(); notify(t('settings.settingsReset')) }}>
                {t('settings.resetSettings')}
              </Button>
            </CardContent>
          </Card>

          {/* About App Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={20} />
                {t('settings.aboutApp')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('settings.appName')}</span>
                  <span className="font-medium text-foreground">WeatherPro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('settings.version')}</span>
                  <span className="font-medium text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('settings.buildNumber')}</span>
                  <span className="font-medium text-foreground">2024.07.04</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('settings.developer')}</span>
                  <span className="font-medium text-foreground">WeatherPro Team</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm" onClick={() => notify(t('settings.upToDate'))}>
                  <Download size={16} />
                  {t('settings.checkUpdates')}
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'WeatherPro', url: window.location.origin })
                  } else {
                    navigator.clipboard?.writeText(window.location.origin)
                    notify(t('settings.linkCopied'))
                  }
                }}>
                  <Star size={16} />
                  {t('settings.rateApp')}
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'WeatherPro', url: window.location.origin })
                  } else {
                    navigator.clipboard?.writeText(window.location.origin)
                    notify(t('settings.linkCopied'))
                  }
                }}>
                  <Share2 size={16} />
                  {t('settings.shareApp')}
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => window.location.href = 'mailto:support@weatherpro.app'}>
                  <Mail size={16} />
                  {t('settings.contactSupport')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
