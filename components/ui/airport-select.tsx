'use client';

import { useState } from 'react';
import { POPULAR_AIRPORTS } from '@/lib/airports-data';

export function AirportSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (iata: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = POPULAR_AIRPORTS.filter(
    (a) =>
      a.iataCode.includes(search.toUpperCase()) ||
      a.cityName.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
          {filtered.map((airport) => (
            <div
              key={airport.iataCode}
              onClick={() => {
                onChange(airport.iataCode);
                setSearch('');
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="font-medium text-black">{airport.iataCode}</div>
              <div className="text-sm text-gray-600">
                {airport.cityName}, {airport.countryCode}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

