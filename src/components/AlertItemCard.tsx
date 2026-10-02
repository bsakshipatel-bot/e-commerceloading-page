import type { AlertItem, AlertSeverity, AlertType } from '@/types';
import { Icons } from '@/components/icons';
import { formatDateTime, formatTimeAgo } from '@/lib/utils';

const severityConfig: Record<AlertSeverity, { bg: string; text: string; icon: keyof typeof Icons }> = {
  critical: { bg: 'bg-danger-50', text: 'text-danger-600', icon: 'AlertTriangle' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600', icon: 'AlertTriangle' },
  info: { bg: 'bg-accent-50', text: 'text-accent-600', icon: 'Info' },
};

const typeLabels: Record<AlertType, string> = {
  low_soil_moisture: 'Low Soil Moisture',
  water_tank_low: 'Water Tank Low',
  pump_activated: 'Pump Activated',
  pump_deactivated: 'Pump Deactivated',
  high_temperature: 'High Temperature',
  low_humidity: 'Low Humidity',
  high_light: 'High Light Intensity',
};

interface AlertItemCardProps {
  alert: AlertItem;
  compact?: boolean;
}

export function AlertItemCard({ alert, compact = false }: AlertItemCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = Icons[config.icon];

  return (
    <div className={`flex items-start gap-3 ${compact ? 'py-3' : 'p-4'} bg-white border-b border-secondary-100 last:border-b-0`}>
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-secondary-900">{typeLabels[alert.type]}</p>
          {alert.value && (
            <span className={`text-xs font-semibold ${config.text} shrink-0`}>{alert.value}</span>
          )}
        </div>
        <p className="text-sm text-secondary-500 mt-0.5">{alert.message}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-secondary-400">{formatTimeAgo(alert.timestamp)}</span>
          <span className="text-xs text-secondary-400">·</span>
          <span className="text-xs text-secondary-400">{formatDateTime(alert.timestamp)}</span>
          {alert.plantName && (
            <>
              <span className="text-xs text-secondary-400">·</span>
              <span className="text-xs text-secondary-400">{alert.plantName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
