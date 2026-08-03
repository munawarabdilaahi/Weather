import { useCallback, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { ToastContext } from '@/context/toastContext';

let nextId = 0;

const TYPE_ICON = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
};

const TYPE_ICON_COLOR = {
  success: 'text-emerald-400',
  info: 'text-primary',
  error: 'text-red-400',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback(({ type = 'info', title, description, duration }) => {
    const id = nextId++;
    const ttl = duration ?? (type === 'error' ? 6000 : 4000);
    setToasts((prev) => [...prev.slice(-3), { id, type, title, description }]);
    if (ttl > 0) {
      const timer = setTimeout(() => dismiss(id), ttl);
      timersRef.current.set(id, timer);
    }
    return id;
  }, [dismiss]);

  const toast = useMemo(
    () => ({
      success: (title, description) => push({ type: 'success', title, description }),
      info: (title, description) => push({ type: 'info', title, description }),
      error: (title, description) => push({ type: 'error', title, description }),
    }),
    [push]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { t } = useTranslation();
  const Icon = TYPE_ICON[toast.type] || Info;

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className="toast-in pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-popover border border-border shadow-lg"
    >
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${TYPE_ICON_COLOR[toast.type] || TYPE_ICON_COLOR.info}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{toast.title}</p>
        {toast.description && <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('toast.dismiss')}
        className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground transition"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
