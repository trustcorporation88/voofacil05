export interface Route {
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  originAirport: string;
  destinationAirport: string;
}

export const POPULAR_ROUTES: Route[] = [
  { origin: "GRU", destination: "GIG", originCity: "São Paulo", destinationCity: "Rio de Janeiro", originAirport: "Guarulhos", destinationAirport: "Galeão" },
  { origin: "GRU", destination: "SSA", originCity: "São Paulo", destinationCity: "Salvador", originAirport: "Guarulhos", destinationAirport: "Luís Eduardo Magalhães" },
  { origin: "GRU", destination: "FOR", originCity: "São Paulo", destinationCity: "Fortaleza", originAirport: "Guarulhos", destinationAirport: "Pinto Martins" },
  { origin: "GRU", destination: "REC", originCity: "São Paulo", destinationCity: "Recife", originAirport: "Guarulhos", destinationAirport: "Guararapes" },
  { origin: "GRU", destination: "MCZ", originCity: "São Paulo", destinationCity: "Maceió", originAirport: "Guarulhos", destinationAirport: "Zumbi dos Palmares" },
  { origin: "GRU", destination: "BEL", originCity: "São Paulo", destinationCity: "Belém", originAirport: "Guarulhos", destinationAirport: "Val de Cans" },
  { origin: "GRU", destination: "MAO", originCity: "São Paulo", destinationCity: "Manaus", originAirport: "Guarulhos", destinationAirport: "Eduardo Gomes" },
  { origin: "GRU", destination: "CWB", originCity: "São Paulo", destinationCity: "Curitiba", originAirport: "Guarulhos", destinationAirport: "Afonso Pena" },
  { origin: "GRU", destination: "FLN", originCity: "São Paulo", destinationCity: "Florianópolis", originAirport: "Guarulhos", destinationAirport: "Hercílio Luz" },
  { origin: "GRU", destination: "POA", originCity: "São Paulo", destinationCity: "Porto Alegre", originAirport: "Guarulhos", destinationAirport: "Salgado Filho" },
  { origin: "GIG", destination: "GRU", originCity: "Rio de Janeiro", destinationCity: "São Paulo", originAirport: "Galeão", destinationAirport: "Guarulhos" },
  { origin: "GIG", destination: "SSA", originCity: "Rio de Janeiro", destinationCity: "Salvador", originAirport: "Galeão", destinationAirport: "Luís Eduardo Magalhães" },
  { origin: "GIG", destination: "FOR", originCity: "Rio de Janeiro", destinationCity: "Fortaleza", originAirport: "Galeão", destinationAirport: "Pinto Martins" },
  { origin: "BSB", destination: "GRU", originCity: "Brasília", destinationCity: "São Paulo", originAirport: "JK", destinationAirport: "Guarulhos" },
  { origin: "BSB", destination: "GIG", originCity: "Brasília", destinationCity: "Rio de Janeiro", originAirport: "JK", destinationAirport: "Galeão" },
  { origin: "SSA", destination: "GRU", originCity: "Salvador", destinationCity: "São Paulo", originAirport: "Luís Eduardo Magalhães", destinationAirport: "Guarulhos" },
  { origin: "FOR", destination: "GRU", originCity: "Fortaleza", destinationCity: "São Paulo", originAirport: "Pinto Martins", destinationAirport: "Guarulhos" },
  { origin: "REC", destination: "GRU", originCity: "Recife", destinationCity: "São Paulo", originAirport: "Guararapes", destinationAirport: "Guarulhos" },
  { origin: "GRU", destination: "MIA", originCity: "São Paulo", destinationCity: "Miami", originAirport: "Guarulhos", destinationAirport: "International" },
  { origin: "GRU", destination: "JFK", originCity: "São Paulo", destinationCity: "Nova York", originAirport: "Guarulhos", destinationAirport: "JFK" },
  { origin: "GRU", destination: "LIS", originCity: "São Paulo", destinationCity: "Lisboa", originAirport: "Guarulhos", destinationAirport: "Humberto Delgado" },
  { origin: "GRU", destination: "MAD", originCity: "São Paulo", destinationCity: "Madrid", originAirport: "Guarulhos", destinationAirport: "Barajas" },
  { origin: "GRU", destination: "SCL", originCity: "São Paulo", destinationCity: "Santiago", originAirport: "Guarulhos", destinationAirport: "Arturo Merino" },
  { origin: "GRU", destination: "EZE", originCity: "São Paulo", destinationCity: "Buenos Aires", originAirport: "Guarulhos", destinationAirport: "Ezeiza" },
];

export function getRouteBySlug(slug: string): Route | undefined {
  const [origin, destination] = slug.toUpperCase().split("-");
  return POPULAR_ROUTES.find(r => r.origin === origin && r.destination === destination);
}

export function getRouteSlug(route: Route): string {
  return `${route.origin.toLowerCase()}-${route.destination.toLowerCase()}`;
}
