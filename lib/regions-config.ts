export interface Region {
  id: string;
  name: string;
  defaultPassengers: number;
  description: string;
  airports: string[];
}

export const REGIONS: Region[] = [
  {
    id: 'brasil',
    name: 'Brasil',
    defaultPassengers: 1,
    description: 'Principais cidades brasileiras',
    airports: [
      'GIG', 'GRU', 'CGH', 'VCP', 'SDU', 'SSA', 'CNF', 'REC', 'FOR',
      'MAO', 'BEL', 'POA', 'CWB', 'BSB', 'MAE', 'MCZ', 'NAT', 'PLU',
      'PMW', 'FLN', 'NVT', 'JOI', 'XAP'
    ]
  },
  {
    id: 'americas',
    name: 'Américas',
    defaultPassengers: 2,
    description: 'Estados Unidos, Canadá e América Central',
    airports: [
      'JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'YYZ',
      'YVR', 'MEX', 'CUN', 'PTY', 'AUA', 'SJD', 'MID'
    ]
  },
  {
    id: 'south-america',
    name: 'América do Sul',
    defaultPassengers: 2,
    description: 'Argentina, Chile, Colômbia, Peru',
    airports: [
      'AEP', 'EZE', 'MEN', 'CRC', 'SCL', 'PMC', 'BOG', 'MDE', 'LIM',
      'CUZ', 'PEM', 'UIO', 'ASU'
    ]
  },
  {
    id: 'europe',
    name: 'Europa',
    defaultPassengers: 2,
    description: 'Todos os principais aeroportos europeus',
    airports: [
      'LHR', 'CDG', 'ORY', 'FCO', 'FCO', 'MAD', 'BCN', 'AGP', 'AMS',
      'DUS', 'FRA', 'MUC', 'VIE', 'PRG', 'BUD', 'WAW', 'ZRH', 'GVA',
      'LUX', 'BRU', 'CPH', 'ARN', 'GOT', 'OSL', 'DUB', 'ATH', 'FAO',
      'TNG', 'IBZ', 'VLC', 'BIO', 'SVQ', 'BVA', 'LYS', 'MRS', 'TLS',
      'NCE', 'RSP', 'TRN', 'VCE', 'BLQ', 'NAP', 'PMO', 'CTA', 'MST',
      'CAG', 'OLB', 'AHO', 'WMI', 'KRK', 'GDN', 'BTS', 'OTP', 'IST', 'SKP'
    ]
  },
  {
    id: 'asia',
    name: 'Ásia',
    defaultPassengers: 2,
    description: 'Ásia Oriental, Sudeste Asiático',
    airports: [
      'NRT', 'HND', 'KIX', 'ICN', 'ICN', 'BKK', 'BKK', 'SIN', 'SIN',
      'KUL', 'CGK', 'HKG', 'PVG', 'SHA', 'PEK', 'DLC', 'XIY', 'CTU',
      'MNL', 'TPE', 'HAN', 'SGN', 'DEL', 'DEL', 'BOM', 'BLR', 'MAA'
    ]
  },
  {
    id: 'middle-east',
    name: 'Oriente Médio',
    defaultPassengers: 2,
    description: 'Golfo Pérsico e Levante',
    airports: [
      'DXB', 'DXB', 'AUH', 'DQM', 'DOH', 'RUH', 'JED', 'KIA', 'BAH',
      'MCT', 'IST', 'AYT', 'TLV', 'DXB', 'BEY'
    ]
  },
  {
    id: 'africa',
    name: 'África',
    defaultPassengers: 1,
    description: 'Principais cidades africanas',
    airports: [
      'CAI', 'ALY', 'JNB', 'JNB', 'CPT', 'DUR', 'HLA', 'LUN', 'ADD',
      'MBA', 'CMN', 'RBA', 'AGP', 'FAO', 'DAR', 'NBO', 'MBA'
    ]
  },
  {
    id: 'oceania',
    name: 'Oceania',
    defaultPassengers: 2,
    description: 'Austrália, Nova Zelândia',
    airports: [
      'SYD', 'MEL', 'BNE', 'PER', 'ADL', 'AKL', 'CHC', 'ZQN'
    ]
  }
];

export function getRegionByAirport(iataCode: string): Region | undefined {
  return REGIONS.find(region => 
    region.airports.includes(iataCode.toUpperCase())
  );
}

export function getDefaultPassengersForRegion(regionId: string): number {
  const region = REGIONS.find(r => r.id === regionId);
  return region?.defaultPassengers || 1;
}

export function getRegionAirports(regionId: string): string[] {
  const region = REGIONS.find(r => r.id === regionId);
  return region?.airports || [];
}

export function getRegionNameById(regionId: string): string {
  const region = REGIONS.find(r => r.id === regionId);
  return region?.name || '';
}


