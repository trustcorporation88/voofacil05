"use client";

import { useState, useEffect, useMemo } from "react";
import { CalendarDays, TrendingDown, Loader2 } from "lucide-react";

interface FlexDatesProps {
  origin: string;
  destination: string;
  departureDate: string;
  onSelectDate: (date: string) => void;
}

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function FlexDates({ origin, destination, departureDate, onSelectDate }: FlexDatesProps) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const selectedDate = useMemo(() => new Date(departureDate + "T12:00:00"), [departureDate]);

  const nearbyDates = useMemo(() => {
    const range = typeof window !== 'undefined' && window.innerWidth < 480 ? 2 : 3;
    const dates: Date[] = [];
    for (let i = -range; i <= range; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [selectedDate]);

  useEffect(() => {
    loadPrices();
  }, [departureDate, origin, destination]);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const month = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-01`;
      const res = await fetch("/api/price-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, month }),
      });
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, number> = {};
        (data.prices || []).forEach((p: any) => {
          if (p.price > 0) map[p.date] = p.price;
        });
        setPrices(map);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const minPrice = Math.min(...Object.values(prices).filter(p => p > 0), Infinity);

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatDisplay = (d: Date) => {
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">Datas próximas</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-5 md:grid-cols-7 gap-0.5 md:gap-1">
          {nearbyDates.map((d, i) => {
            const key = formatDate(d);
            const price = prices[key];
            const isSelected = key === departureDate;
            const isBest = price && price === minPrice && minPrice < Infinity;

            return (
              <button
                key={i}
                onClick={() => onSelectDate(key)}
              className={`p-1 md:p-1.5 rounded-lg text-center transition-all text-[10px] md:text-xs ${
              isSelected
                ? "bg-blue-600 text-white font-bold shadow"
                : isBest
                ? "bg-green-50 border border-green-300 hover:bg-green-100"
                : price
                ? "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                : "bg-gray-50 border border-gray-100 text-gray-400"
            }`}
              >
                <div className="font-medium">{formatDisplay(d)}</div>
                {price ? (
                  <div className={`font-bold mt-0.5 ${isSelected ? "text-white" : "text-blue-700"}`}>
                    R${Math.round(price)}
                  </div>
                ) : (
                  <div className="text-gray-300 text-xs mt-0.5">-</div>
                )}
                {isBest && !isSelected && (
                  <TrendingDown className="w-3 h-3 mx-auto text-green-600 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
