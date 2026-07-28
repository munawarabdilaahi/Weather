'use client';

import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const cities = ['Mogadishu', 'London', 'New York', 'Tokyo'];
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Sidebar
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4 lg:p-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition"
          >
            {isMobileOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <Menu size={24} className="text-foreground" />
            )}
          </button>

          {/* Search */}
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cities..."
                value={searchValue}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full max-w-sm px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />

              {searchOpen && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg">
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSearchValue('');
                          setSearchOpen(false);
                        }}
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

          {/* Placeholder for right side controls */}
          <div className="w-24" />
        </div>
      </header>
    </>
  );
}
