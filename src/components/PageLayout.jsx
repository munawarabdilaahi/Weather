import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTranslation } from '@/hooks/useTranslation';

export function PageLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useTranslation();

  const handleMobileClose = useCallback(() => setIsMobileOpen(false), []);
  const handleMobileToggle = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const applyLock = () => {
      const lock = !mq.matches;
      document.documentElement.style.overflow = lock ? 'hidden' : '';
      document.body.style.overflow = lock ? 'hidden' : '';
    };
    applyLock();
    mq.addEventListener('change', applyLock);
    return () => {
      mq.removeEventListener('change', applyLock);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen bg-background flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground"
      >
        {t('a11y.skipToContent')}
      </a>
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMobileMenuClick={handleMobileToggle}
          isMobileOpen={isMobileOpen}
        />
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
