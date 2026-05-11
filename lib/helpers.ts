export function parseDuration(iso: string): number {
  if (!iso) return 0;
  const match = iso?.match?.(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = parseInt(match?.[1] ?? '0', 10);
  const minutes = parseInt(match?.[2] ?? '0', 10);
  return hours * 60 + minutes;
}

export function formatDurationMinutes(minutes: number): string {
  if (!minutes && minutes !== 0) return '--';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function formatDurationISO(iso: string): string {
  return formatDurationMinutes(parseDuration(iso));
}

export function formatPrice(value: string | number, currency?: string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ --';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency ?? 'BRL',
  }).format(num);
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '--';
  try {
    const d = new Date(dateStr);
    return d?.toLocaleTimeString?.('pt-BR', { hour: '2-digit', minute: '2-digit' }) ?? '--';
  } catch {
    return '--';
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  try {
    const d = new Date(dateStr);
    return d?.toLocaleDateString?.('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '--';
  } catch {
    return '--';
  }
}

export function getStopsCount(itinerary: { segments?: Array<unknown> }): number {
  return Math.max(0, (itinerary?.segments?.length ?? 1) - 1);
}

export function validateWhatsApp(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone?.replace?.(/[\s\-()]/g, '') ?? '';
  return /^\+55\d{10,11}$/.test(cleaned);
}

export function formatWhatsApp(phone: string): string {
  if (!phone) return '';
  const cleaned = phone?.replace?.(/\D/g, '') ?? '';
  if (cleaned?.length === 13) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned?.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
}

export const AIRLINE_NAMES: Record<string, string> = {
  'AA': 'American Airlines',
  'AD': 'Azul',
  'AF': 'Air France',
  'AV': 'Avianca',
  'AZ': 'ITA Airways',
  'BA': 'British Airways',
  'CM': 'Copa Airlines',
  'DL': 'Delta Air Lines',
  'EK': 'Emirates',
  'G3': 'GOL',
  'IB': 'Iberia',
  'JJ': 'LATAM Brasil',
  'KL': 'KLM',
  'LA': 'LATAM',
  'LH': 'Lufthansa',
  'QR': 'Qatar Airways',
  'TP': 'TAP Portugal',
  'UA': 'United Airlines',
  'TK': 'Turkish Airlines',
};

export function getAirlineName(code: string): string {
  return AIRLINE_NAMES?.[code] ?? code ?? '--';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}


