import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useTranslation } from '@/hooks/useTranslation';

export function Header({ onMobileMenuClick, isMobileOpen }) {
  const { setSidebarCollapsed, sidebarCollapsed, setSelectedCity, cities } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  function handleCitySelect(city) {
    setSelectedCity(city);
    setSearchValue('');
    setSearchOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onMobileMenuClick}
            aria-label={isMobileOpen ? t('header.closeMenu') : t('header.openMenu')}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition"
          >
            {isMobileOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
          </button>

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
            className="hidden lg:flex p-2 hover:bg-secondary rounded-lg transition"
          >
            {sidebarCollapsed
              ? <PanelLeft size={20} className="text-foreground" />
              : <PanelLeftClose size={20} className="text-foreground" />
            }
          </button>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchValue}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label={t('header.searchPlaceholder')}
              className="w-full max-w-sm px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />

            {searchOpen && searchValue && filteredCities.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4">
                <p className="text-sm text-muted-foreground">{t('header.noCitiesFound')}</p>
              </div>
            )}

            {searchOpen && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg">
                <div className="max-h-48 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-secondary transition text-foreground text-sm"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-24" />
      </div>
    </header>
  );
}
