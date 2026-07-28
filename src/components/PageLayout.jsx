import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function PageLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMobileMenuClick={() => setIsMobileOpen((prev) => !prev)}
          isMobileOpen={isMobileOpen}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
