import { useEffect, useMemo, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { useTranslation } from '@/hooks/useTranslation';
import { CITIES } from '@/constants/cities';

const SEARCH_DEBOUNCE_MS = 150;

export function MapsSearch({ onSelect }) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchLoading, setSearchLoading] = useState(false);

  const query = searchValue.trim();
  const filteredCities = useMemo(
    () => CITIES.filter((city) => city.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const showSearchResults = query.length > 0 && !searchLoading && filteredCities.length > 0;

  useEffect(() => {
    const id = setTimeout(() => setSearchLoading(false), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchValue]);

  function handleSelect(city) {
    setSearchValue('');
    setActiveIndex(-1);
    setSearchLoading(false);
    onSelect(city);
  }

  function handleChange(e) {
    setSearchValue(e.target.value);
    setActiveIndex(0);
    setSearchLoading(true);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSearchValue('');
      setActiveIndex(-1);
      setSearchLoading(false);
      return;
    }
    if (filteredCities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % filteredCities.length;
      setActiveIndex(nextIndex);
      document.getElementById(`city-option-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = (activeIndex - 1 + filteredCities.length) % filteredCities.length;
      setActiveIndex(nextIndex);
      document.getElementById(`city-option-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const city = filteredCities[activeIndex] ?? filteredCities[0];
      handleSelect(city);
    }
  }

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder={t('maps.searchPlaceholder')}
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={showSearchResults}
          aria-controls={showSearchResults ? 'city-listbox' : undefined}
          aria-activedescendant={
            showSearchResults && activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label={t('maps.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {query.length > 0 && searchLoading && (
        <div className="mt-3 flex items-center justify-center gap-2 py-3" role="status">
          <Spinner className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">{t('maps.searching')}</span>
        </div>
      )}

      {query.length > 0 && !searchLoading && filteredCities.length === 0 && (
        <div className="mt-3 text-center py-4 rounded-lg bg-secondary/50 border border-border" role="status">
          <SearchX size={20} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t('maps.noCitiesFound')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('maps.noCitiesHint')}</p>
        </div>
      )}

      {showSearchResults && (
        <ul id="city-listbox" role="listbox" aria-label={t('maps.searchCities')} className="mt-3 space-y-2 fade-in">
          {filteredCities.map((city, index) => (
            <li
              key={city}
              id={`city-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(city)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                index === activeIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}