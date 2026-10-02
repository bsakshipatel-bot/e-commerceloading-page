import { useState } from 'react';
import { PlantCard } from '@/components/PlantCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState, EmptyState } from '@/components/ui/States';
import { Icons } from '@/components/icons';
import { useApiData } from '@/hooks/useApiData';
import { fetchPlants } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import type { Plant } from '@/types';

export function PlantsPage() {
  const { data: plants, loading } = useApiData(fetchPlants);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionTitle
        title="Plant Management"
        subtitle="Add, monitor, and manage your garden plants"
        action={
          <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Icons.Plus className="w-4 h-4" />
            Add Plant
          </button>
        }
      />

      {plants && plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onClick={() => setSelectedPlant(plant)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Icons.Sprout className="w-7 h-7" />}
          title="No plants yet"
          message="Add your first plant to start monitoring its health and sensor data."
        />
      )}

      {/* Plant detail modal */}
      {selectedPlant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/40"
          onClick={() => setSelectedPlant(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-40 overflow-hidden rounded-t-xl bg-secondary-100">
              <img src={selectedPlant.imageUrl} alt={selectedPlant.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-secondary-700 hover:bg-white"
              >
                <Icons.XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">{selectedPlant.name}</h2>
                  <p className="text-sm text-secondary-500 italic">{selectedPlant.species}</p>
                </div>
                <StatusBadge status={selectedPlant.health} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailItem icon={<Icons.Droplets className="w-4 h-4" />} label="Soil Moisture" value={`${selectedPlant.soilMoisture}%`} />
                <DetailItem icon={<Icons.Thermometer className="w-4 h-4" />} label="Temperature" value={`${selectedPlant.temperature}°C`} />
                <DetailItem icon={<Icons.Clock className="w-4 h-4" />} label="Last Watered" value={formatTimeAgo(selectedPlant.lastWatered)} />
                <DetailItem icon={<Icons.Droplet className="w-4 h-4" />} label="Water Need" value={`${selectedPlant.waterRequirement}%`} />
                <DetailItem icon={<Icons.Gauge className="w-4 h-4" />} label="Moisture Threshold" value={`${selectedPlant.moistureThreshold}%`} />
                <DetailItem icon={<Icons.MapPin className="w-4 h-4" />} label="Location" value={selectedPlant.location} />
              </div>

              <div className="mt-5 pt-4 border-t border-secondary-100">
                <p className="text-xs text-secondary-400 text-center">
                  This is demo data. Real sensor readings will appear here once your ESP32 is connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-secondary-50 rounded-lg px-3 py-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-primary-600 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs text-secondary-500">{label}</p>
        <p className="text-sm font-semibold text-secondary-900">{value}</p>
      </div>
    </div>
  );
}
