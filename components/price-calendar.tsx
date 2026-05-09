"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Loader2, TrendingDown } from "lucide-react";

interface PriceDay {
  date: string;
  price: number;
  currency: string;
  airline?: string;
  transfers?: number;
}

interface PriceCalendarProps {
  origin: string;
  destination: string;
  departureDate: string;
  onSelectDate: (date: string) => void;
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function PriceCalendar({ origin, destination, departureDate, onSelectDate }: PriceCalendarProps) {
  const [prices, setPrices] = useState<PriceDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(departureDate);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(departureDate);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });

  const loadPrices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/price-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, month: viewMonth }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrices(data.prices || []);
      }
    } catch (err) {
      console.error("Erro ao carregar preços:", err);
    } finally {
      setLoading(false);
    }
  }, [destination, origin, viewMonth]);

  useEffect(() => {
    if (showCalendar && prices.length === 0) {
      loadPrices();
    }
  }, [showCalendar, prices.length, loadPrices]);

  const getPriceForDate = (dateStr: string) => {
    return prices.find((p) => p.date === dateStr);
  };

  const getDaysInMonth = () => {
    const [y, m] = viewMonth.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const firstDayOfWeek = new Date(y, m - 1, 1).getDay();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  };

  const formatDateKey = (day: number) => {
    const [y, m] = viewMonth.split("-").map(Number);
    return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const changeMonth = (dir: -1 | 1) => {
    const [y, m] = viewMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`);
    setPrices([]);
  };

  const minPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;

  const monthLabel = (() => {
    const [y, m] = viewMonth.split("-").map(Number);
    return `${MONTHS_PT[m - 1]} ${y}`;
  })();

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        <Calendar className="w-4 h-4" />
        {showCalendar ? "Ocultar calendário de preços" : "Ver preços do mês"}
      </button>

      {showCalendar && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
              ←
            </button>
            <span className="font-semibold text-gray-800">{monthLabel}</span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
              →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-1">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} />;
                  const dateKey = formatDateKey(day);
                  const priceDay = getPriceForDate(dateKey);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const cellDate = new Date(dateKey + "T00:00:00");
                  const isPast = cellDate < today;
                  const isSelected = dateKey === selectedDate;

                  return (
                    <button
                      key={dateKey}
                      onClick={() => {
                        if (!isPast) {
                          setSelectedDate(dateKey);
                          onSelectDate(dateKey);
                        }
                      }}
                      disabled={isPast}
                      className={`relative p-1 rounded text-xs transition-all ${
                        isPast
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white font-bold"
                          : priceDay
                          ? priceDay.price <= minPrice * 1.1
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">{day}</div>
                      {priceDay && !isPast && (
                        <div className="leading-none mt-0.5">
                          R${Math.round(priceDay.price)}
                        </div>
                      )}
                      {priceDay && priceDay.price <= minPrice * 1.1 && !isPast && (
                        <TrendingDown className="w-3 h-3 mx-auto text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-100 inline-block" /> Melhor preço
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-50 inline-block" /> Preço normal
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
