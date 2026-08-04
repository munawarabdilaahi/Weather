import { useTranslation } from '@/hooks/useTranslation';
export function Toggle({ enabled, onChange, disabled = false, label }) {
  const { t } = useTranslation();
  const ariaLabel = label || t('toggle.defaultLabel');

  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
        enabled ? 'bg-primary border-transparent' : 'bg-secondary border-border'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
