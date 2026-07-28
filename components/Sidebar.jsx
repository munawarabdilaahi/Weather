'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cloud, Map, Settings, MapPin } from 'lucide-react';

const navigationItems = [
  { href: '/', icon: Cloud, label: 'Dashboard' },
  { href: '/maps', icon: Map, label: 'Maps' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const savedLocations = ['Mogadishu', 'London', 'New York', 'Tokyo'];

export function Sidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-40 lg:relative lg:z-auto ${
        isMobileOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      {isMobileOpen && (
        <div
          className="absolute inset-0 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className="absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-border overflow-auto">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Cloud size={28} className="text-blue-500" />
            <span>WeatherPro</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Saved Locations */}
        <div className="p-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Saved Locations
          </h3>
          <div className="space-y-1">
            {savedLocations.map((location) => (
              <button
                key={location}
                onClick={onClose}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground hover:bg-secondary rounded-lg transition"
              >
                <MapPin size={16} />
                <span>{location}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
