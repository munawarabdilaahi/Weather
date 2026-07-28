import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, Map, Settings, MapPin } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useTranslation } from '@/hooks/useTranslation';

const navItems = [
  { href: '/', icon: Cloud, key: 'nav.dashboard' },
  { href: '/maps', icon: Map, key: 'nav.maps' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
];

function SidebarInner({ showText, onItemClick }) {
  const { pathname } = useLocation();
  const { setSelectedCity, cities } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleLocationClick(city) {
    setSelectedCity(city);
    onItemClick?.();
    navigate('/');
  }

  return (
    <>
      <div className="flex items-center gap-2 p-6 border-b border-border">
        <Cloud size={28} className="text-blue-500 flex-shrink-0" />
        {showText && <span className="text-xl font-bold text-foreground">{t('app.name')}</span>}
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {showText && <span className="font-medium">{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {showText && (
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            {t('nav.savedLocations')}
          </h3>
        )}
        <div className="space-y-1">
          {cities.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationClick(location)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground hover:bg-secondary rounded-lg transition"
            >
              <MapPin size={16} className="flex-shrink-0" />
              {showText && <span>{location}</span>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function Sidebar({ isMobileOpen, onMobileClose }) {
  const { sidebarCollapsed } = useApp();

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-border overflow-auto">
            <SidebarInner showText={true} onItemClick={onMobileClose} />
          </div>
        </div>
      )}

      <aside
        className={`hidden lg:flex flex-col bg-sidebar border-r border-border overflow-auto flex-shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarInner showText={!sidebarCollapsed} onItemClick={undefined} />
      </aside>
    </>
  );
}
