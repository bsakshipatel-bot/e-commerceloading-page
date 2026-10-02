import type { Plant } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Icons } from '@/components/icons';
import { formatTimeAgo } from '@/lib/utils';

const healthConfig = {
  healthy: 'healthy' as const,
  warning: 'warning' as const,
  critical: 'critical' as const,
};

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
}

export function PlantCard({ plant, onClick }: PlantCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-secondary-200/60 shadow-card overflow-hidden transition-shadow hover:shadow-card-hover cursor-pointer"
    >
      <div className="relative h-32 overflow-hidden bg-secondary-100">
        <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={healthConfig[plant.health]} size="sm" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-secondary-900">{plant.name}</h3>
            <p className="text-xs text-secondary-500 italic">{plant.species}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-secondary-500">
            <Icons.MapPin className="w-3 h-3" />
            {plant.location}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-600">
              <Icons.Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-secondary-500">Soil</p>
              <p className="text-sm font-semibold text-secondary-900">{plant.soilMoisture}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning-50 text-warning-600">
              <Icons.Thermometer className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-secondary-500">Temp</p>
              <p className="text-sm font-semibold text-secondary-900">{plant.temperature}°C</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100">
          <div className="flex items-center gap-1.5 text-xs text-secondary-500">
            <Icons.Clock className="w-3.5 h-3.5" />
            Watered {formatTimeAgo(plant.lastWatered)}
          </div>
          <div className="text-xs text-secondary-500">
            Needs <span className="font-medium text-secondary-700">{plant.waterRequirement}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
