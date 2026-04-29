'use client';

import { useState } from 'react';
import { SearchParams } from '@/lib/types';
import { REGIONS, getDefaultPassengersForRegion } from '@/lib/regions-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AirportSelect } from '@/components/ui/airport-select';
import { Search, Plane } from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: SearchParams) => Promise<void>;
  loading: boolean;
  initialParams?: SearchParams | null;
}

export function SearchForm({ onSearch, loading, initialParams }: SearchFormProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialParams?.region || 'brasil');
  const [formData, setFormData] = useState<SearchParams>({
    origin: initialParams?.origin || '',
    destination: initialParams?.destination || '',
    departureDate: initialParams?.departureDate || '',
    returnDate: initialParams?.returnDate || '',
    passengers: initialParams?.passengers || getDefaultPassengersForRegion(selectedRegion),
    tripType: initialParams?.tripType || 'roundTrip',
    region: selectedRegion,
  });

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    const defaultPassengers = getDefaultPassengersForRegion(regionId);
    setFormData(prev => ({
      ...prev,
      region: regionId,
      passengers: defaultPassengers,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.origin || !formData.destination || !formData.departureDate) {
      alert("Por favor, preencha origem, destino e data de partida.");
      return;
    }

    await onSearch(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-3xl border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Plane className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Buscar Voos</h2>
          <p className="text-sm text-gray-600">Encontre os melhores preços em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Região de Destino</Label>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
          >
            {REGIONS.map(region => (
              <option key={region.id} value={region.id}>
                {region.name} - {region.description}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Passageiros</Label>
          <Input 
            type="number" 
            min={1} 
            max={9} 
            value={formData.passengers} 
            onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
          />
          <p className="text-xs text-gray-600">
            Padrão para {REGIONS.find(r => r.id === selectedRegion)?.name}: {getDefaultPassengersForRegion(selectedRegion)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Origem</Label>
          <AirportSelect
            value={formData.origin}
            onChange={(iata) => setFormData({ ...formData, origin: iata })}
            placeholder="Aeroporto de origem"
          />
        </div>

        <div className="space-y-2">
          <Label>Destino</Label>
          <AirportSelect
            value={formData.destination}
            onChange={(iata) => setFormData({ ...formData, destination: iata })}
            placeholder="Aeroporto de destino"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Data de Partida</Label>
          <Input 
            type="date" 
            value={formData.departureDate} 
            onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label>Data de Retorno (opcional)</Label>
          <Input 
            type="date" 
            value={formData.returnDate || ''} 
            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-medium" 
        disabled={loading}
      >
        <Search className="mr-3 h-5 w-5" />
        {loading ? 'Buscando os melhores voos...' : 'Buscar Voos'}
      </Button>
    </form>
  );
}
