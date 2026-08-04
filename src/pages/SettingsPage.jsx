import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Palette, Wind, Globe, MapPin, RotateCw, Trash2, Info, Download, Star, Share2, Mail, Check, Bell, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { RadioGroup } from '@/components/RadioGroup';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/useToast';
import { CITIES } from '@/constants/cities';

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://weatherpro.app';

const APP_ATTRIBUTES = [
  { labelKey: 'settings.appName', valueKey: 'settings.appNameValue' },
  { labelKey: 'settings.version', valueKey: 'settings.versionValue' },
  { labelKey: 'settings.buildNumber', valueKey: 'settings.buildValue' },
  { labelKey: 'settings.developer', valueKey: 'settings.developerValue' },
];

const ACCENT_COLORS = [
  { value: 'blue', class: 'bg-blue-600', labelKey: 'settings.colorBlue' },
  { value: 'cyan', class: 'bg-cyan-500', labelKey: 'settings.colorCyan' },
  { value: 'green', class: 'bg-green-600', labelKey: 'settings.colorGreen' },
  { value: 'purple', class: 'bg-purple-600', labelKey: 'settings.colorPurple' },
  { value: 'red', class: 'bg-red-600', labelKey: 'settings.colorRed' },
  { value: 'orange', class: 'bg-orange-500', labelKey: 'settings.colorOrange' },
];

const THEME_OPTIONS = [
  { value: 'light', labelKey: 'settings.themeLight' },
  { value: 'dark', labelKey: 'settings.themeDark' },
  { value: 'system', labelKey: 'settings.themeSystem' },
];
const TEMP_UNITS = ['C', 'F'];

const SELECT_CLASSES = 'w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary';

const AppearanceSection = memo(function AppearanceSection({ appearance, accentColor, onUpdate }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={20} />
          {t('settings.appearance')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label id="settings-theme-label" className="text-sm font-medium text-foreground block mb-3">{t('settings.theme')}</label>
          <RadioGroup labelledBy="settings-theme-label" className="flex gap-3">
            {THEME_OPTIONS.map(({ value, labelKey }) => (
              <button
                key={value}
                role="radio"
                aria-checked={appearance === value}
                onClick={() => onUpdate('appearance', value)}
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  appearance === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </RadioGroup>
        </div>

        <div>
          <label id="settings-accent-label" className="text-sm font-medium text-foreground block mb-3">{t('settings.accentColor')}</label>
          <RadioGroup labelledBy="settings-accent-label" className="flex gap-3 flex-wrap">
            {ACCENT_COLORS.map((color) => (
              <div key={color.value} className="flex flex-col items-center gap-1">
                <button
                  role="radio"
                  aria-checked={accentColor === color.value}
                  aria-label={t(color.labelKey)}
                  onClick={() => onUpdate('accentColor', color.value)}
                  className={`w-12 h-12 rounded-lg ${color.class} transition transform hover:scale-110 focus-visible:scale-110 ${
                    accentColor === color.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                  }`}
                >
                  {accentColor === color.value && (
                    <Check size={24} className="text-white mx-auto" aria-hidden="true" />
                  )}
                </button>
                <span className="text-xs text-muted-foreground" aria-hidden="true">{t(color.labelKey)}</span>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
});

const UnitsSection = memo(function UnitsSection({ tempUnit, windUnit, pressureUnit, visibilityUnit, onUpdate }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind size={20} />
          {t('settings.units')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label id="settings-temp-label" className="text-sm font-medium text-foreground block mb-2">{t('settings.temperature')}</label>
          <RadioGroup labelledBy="settings-temp-label" className="flex gap-3">
            {TEMP_UNITS.map((unit) => (
              <button
                key={unit}
                role="radio"
                aria-checked={tempUnit === unit}
                onClick={() => onUpdate('tempUnit', unit)}
                className={`px-4 py-2 rounded-lg transition ${
                  tempUnit === unit
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                °{unit}
              </button>
            ))}
          </RadioGroup>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2" htmlFor="settings-wind-unit">{t('settings.windSpeed')}</label>
          <select
            id="settings-wind-unit"
            value={windUnit}
            onChange={(e) => onUpdate('windUnit', e.target.value)}
            className={SELECT_CLASSES}
          >
            <option value="kmh">{t('settings.windKmh')}</option>
            <option value="mph">{t('settings.windMph')}</option>
            <option value="ms">{t('settings.windMs')}</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2" htmlFor="settings-pressure-unit">{t('settings.pressure')}</label>
          <select
            id="settings-pressure-unit"
            value={pressureUnit}
            onChange={(e) => onUpdate('pressureUnit', e.target.value)}
            className={SELECT_CLASSES}
          >
            <option value="hPa">{t('settings.pressureHpa')}</option>
            <option value="mmHg">{t('settings.pressureMmhg')}</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2" htmlFor="settings-visibility-unit">{t('settings.visibility')}</label>
          <select
            id="settings-visibility-unit"
            value={visibilityUnit}
            onChange={(e) => onUpdate('visibilityUnit', e.target.value)}
            className={SELECT_CLASSES}
          >
            <option value="km">{t('settings.visibilityKm')}</option>
            <option value="miles">{t('settings.visibilityMiles')}</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
});

const LanguageSection = memo(function LanguageSection({ language, onUpdate }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe size={20} />
          {t('settings.language')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <select
          aria-label={t('settings.language')}
          value={language}
          onChange={(e) => onUpdate('language', e.target.value)}
          className={SELECT_CLASSES}
        >
          <option value="english">{t('settings.langEnglish')}</option>
          <option value="somali">{t('settings.langSomali')}</option>
        </select>
      </CardContent>
    </Card>
  );
});

const LocationSection = memo(function LocationSection({ gpsEnabled, defaultCity, onToggle, onUpdate }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          {t('settings.location')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('settings.gpsEnabled')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('settings.gpsDesc')}</p>
          </div>
          <Toggle
            enabled={gpsEnabled}
            onChange={() => onToggle('gpsEnabled')}
            label={t('settings.gpsEnabled')}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2" htmlFor="settings-default-city">{t('settings.defaultCity')}</label>
          <select
            id="settings-default-city"
            value={defaultCity}
            onChange={(e) => onUpdate('defaultCity', e.target.value)}
            className={SELECT_CLASSES}
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">{t('settings.defaultCityHelp')}</p>
        </div>
      </CardContent>
    </Card>
  );
});

const PreferencesSection = memo(function PreferencesSection({ autoRefresh, refreshInterval, onToggle, onUpdate }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCw size={20} />
          {t('settings.preferences')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('settings.autoRefresh')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('settings.autoRefreshDesc')}</p>
          </div>
          <Toggle
            enabled={autoRefresh}
            onChange={() => onToggle('autoRefresh')}
            label={t('settings.autoRefresh')}
          />
        </div>

        {autoRefresh && (
          <div>
            <label className="text-sm font-medium text-foreground block mb-2" htmlFor="settings-refresh-interval">{t('settings.refreshInterval')}</label>
            <select
              id="settings-refresh-interval"
              value={refreshInterval}
              onChange={(e) => onUpdate('refreshInterval', parseInt(e.target.value))}
              className={SELECT_CLASSES}
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
  );
});

const NotificationsSection = memo(function NotificationsSection({ notificationsEnabled, onToggle }) {
  const { t } = useTranslation();
  const supported = typeof window !== 'undefined' && 'Notification' in window;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={20} />
          {t('settings.notifications')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('settings.browserNotifications')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('settings.browserNotificationsDesc')}</p>
          </div>
          <Toggle
            enabled={notificationsEnabled}
            onChange={onToggle}
            label={t('settings.browserNotifications')}
            disabled={!supported}
          />
        </div>
        {!supported && (
          <p className="text-xs text-muted-foreground">{t('settings.notificationsUnsupported')}</p>
        )}
      </CardContent>
    </Card>
  );
});

const DataPrivacySection = memo(function DataPrivacySection({ onRequestReset }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 size={20} />
          {t('settings.dataPrivacy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 bg-secondary/50 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">{t('settings.privacyNote')}</p>
        </div>

        <Button variant="destructive" className="w-full" onClick={onRequestReset}>
          {t('settings.resetSettings')}
        </Button>
      </CardContent>
    </Card>
  );
});

const AboutSection = memo(function AboutSection({ onUpToDate, onRate, onShare, onVisit, onContact }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={20} />
          {t('settings.aboutApp')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('settings.aboutDesc')}</p>

        <div className="space-y-2 text-sm">
          {APP_ATTRIBUTES.map(({ labelKey, valueKey }) => (
            <div key={labelKey} className="flex justify-between">
              <span className="text-muted-foreground">{t(labelKey)}</span>
              <span className="font-medium text-foreground">{t(valueKey)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" size="sm" onClick={onUpToDate}>
            <Download size={16} />
            {t('settings.checkUpdates')}
          </Button>
          <Button variant="outline" className="w-full" size="sm" onClick={onRate}>
            <Star size={16} />
            {t('settings.rateApp')}
          </Button>
          <Button variant="outline" className="w-full" size="sm" onClick={onShare}>
            <Share2 size={16} />
            {t('settings.shareApp')}
          </Button>
          <Button variant="outline" className="w-full" size="sm" onClick={onVisit}>
            <ExternalLink size={16} />
            {t('settings.visitWebsite')}
          </Button>
          <Button variant="outline" className="w-full" size="sm" onClick={onContact}>
            <Mail size={16} />
            {t('settings.contactSupport')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default function SettingsPage() {
  const { settings, updateSetting, toggleSetting, resetSettings } = useSettings();
  const { t } = useTranslation();
  const { toast } = useToast();

  const notify = useCallback((msg) => toast.success(msg), [toast]);

  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [settings]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: t('app.name'), url: window.location.origin })
        .then(() => notify(t('settings.shareDone')))
        .catch(() => {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin)
        .then(() => notify(t('settings.linkCopied')))
        .catch(() => notify(t('settings.linkCopyFailed')));
    } else {
      notify(t('settings.linkCopyFailed'));
    }
  }, [notify, t]);

  const handleNotificationsToggle = useCallback(async () => {
    if (!('Notification' in window)) return;
    if (settings.notificationsEnabled) {
      toggleSetting('notificationsEnabled');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateSetting('notificationsEnabled', true);
        new Notification(t('settings.notificationsEnabledTitle'), {
          body: t('settings.notificationsEnabledBody'),
        });
        notify(t('settings.notificationsEnabledTitle'));
      } else if (permission === 'denied') {
        notify(t('settings.notificationsDenied'));
      } else {
        notify(t('settings.notificationsDefault'));
      }
    } catch {
      notify(t('settings.notificationsError'));
    }
  }, [settings.notificationsEnabled, updateSetting, toggleSetting, notify, t]);

  const handleRequestReset = useCallback(() => setConfirmReset(true), []);
  const handleCloseReset = useCallback(() => setConfirmReset(false), []);
  const handleConfirmReset = useCallback(() => {
    resetSettings();
    setConfirmReset(false);
    notify(t('settings.settingsReset'));
  }, [resetSettings, notify, t]);

  const onUpToDate = useCallback(() => notify(t('settings.upToDate')), [notify, t]);
  const onOpenAppPage = useCallback(() => window.open(APP_URL, '_blank', 'noopener,noreferrer'), []);
  const onContact = useCallback(() => { window.location.href = 'mailto:support@weatherpro.app'; }, []);

  const {
    appearance,
    accentColor,
    tempUnit,
    windUnit,
    pressureUnit,
    visibilityUnit,
    language,
    gpsEnabled,
    defaultCity,
    autoRefresh,
    refreshInterval,
    notificationsEnabled,
  } = settings;

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('settings.title')}</h1>
              <p className="text-muted-foreground">{t('settings.subtitle')}</p>
            </div>
            <div role="status" aria-live="polite" className="flex-shrink-0 pt-1">
              {saved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary animate-pulse">
                  <Check size={14} aria-hidden="true" />
                  {t('settings.saved')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AppearanceSection
            appearance={appearance}
            accentColor={accentColor}
            onUpdate={updateSetting}
          />
          <UnitsSection
            tempUnit={tempUnit}
            windUnit={windUnit}
            pressureUnit={pressureUnit}
            visibilityUnit={visibilityUnit}
            onUpdate={updateSetting}
          />
          <LanguageSection language={language} onUpdate={updateSetting} />
          <LocationSection
            gpsEnabled={gpsEnabled}
            defaultCity={defaultCity}
            onToggle={toggleSetting}
            onUpdate={updateSetting}
          />
          <PreferencesSection
            autoRefresh={autoRefresh}
            refreshInterval={refreshInterval}
            onToggle={toggleSetting}
            onUpdate={updateSetting}
          />
          <NotificationsSection
            notificationsEnabled={notificationsEnabled}
            onToggle={handleNotificationsToggle}
          />
          <DataPrivacySection onRequestReset={handleRequestReset} />
          <AboutSection
            onUpToDate={onUpToDate}
            onRate={onOpenAppPage}
            onShare={handleShare}
            onVisit={onOpenAppPage}
            onContact={onContact}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title={t('settings.resetTitle')}
        description={t('settings.resetConfirm')}
        confirmLabel={t('settings.resetSettings')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={handleConfirmReset}
        onCancel={handleCloseReset}
      />
    </div>
  );
}