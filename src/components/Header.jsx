import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useTranslation } from '@/hooks/useTranslation';
import { CITIES } from '@/constants/cities';

export function Header({ onMobileMenuClick, isMobileOpen }) {
  const { setSidebarCollapsed, sidebarCollapsed, setSelectedCity } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) return;
    function handlePointerDown(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [searchOpen]);

  const filteredCities = useMemo(
    () => CITIES.filter((city) =>
      city.toLowerCase().includes(searchValue.toLowerCase())
    ),
    [searchValue]
  );

  const showResults = searchOpen && searchValue.length > 0;

  function handleCitySelect(city) {
    setSelectedCity(city);
    setSearchValue('');
    setSearchOpen(false);
    setActiveIndex(-1);
    navigate('/');
  }

  function handleSearchChange(e) {
    setSearchValue(e.target.value);
    setActiveIndex(0);
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (filteredCities.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (activeIndex + 1) % filteredCities.length;
      setActiveIndex(next);
      document.getElementById(`header-city-option-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (activeIndex - 1 + filteredCities.length) % filteredCities.length;
      setActiveIndex(next);
      document.getElementById(`header-city-option-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const city = filteredCities[activeIndex] ?? filteredCities[0];
      handleCitySelect(city);
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onMobileMenuClick}
            aria-label={isMobileOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-drawer"
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isMobileOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
          </button>

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
            className="hidden lg:flex p-2 hover:bg-secondary rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {sidebarCollapsed
              ? <PanelLeft size={20} className="text-foreground" />
              : <PanelLeftClose size={20} className="text-foreground" />
            }
          </button>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              role="combobox"
              aria-label={t('header.searchPlaceholder')}
              aria-haspopup="listbox"
              aria-expanded={showResults}
              aria-controls="header-city-listbox"
              aria-autocomplete="list"
              aria-activedescendant={showResults && activeIndex >= 0 ? `header-city-option-${activeIndex}` : undefined}
              placeholder={t('header.searchPlaceholder')}
              value={searchValue}
              onFocus={() => setSearchOpen(true)}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full max-w-sm px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />

            {showResults && filteredCities.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4" role="status">
                <p className="text-sm text-muted-foreground">{t('header.noCitiesFound')}</p>
              </div>
            )}

            {showResults && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg">
                <div id="header-city-listbox" role="listbox" aria-label={t('header.searchPlaceholder')} className="max-h-48 overflow-y-auto">
                  {filteredCities.map((city, index) => (
                    <div
                      key={city}
                      id={`header-city-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-secondary transition text-foreground text-sm"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block w-24" />
      </div>
    </header>
  );
}
