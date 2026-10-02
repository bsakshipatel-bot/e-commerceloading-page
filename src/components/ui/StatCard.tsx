import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit: string;
  trend?: number;
  status?: 'normal' | 'warning' | 'critical';
  accentColor?: 'primary' | 'accent' | 'warning' | 'danger';
}

const accentMap = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', bar: 'bg-primary-500' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600', bar: 'bg-accent-500' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600', bar: 'bg-warning-500' },
  danger: { bg: 'bg-danger-50', text: 'text-danger-600', bar: 'bg-danger-500' },
};

const statusMap = {
  normal: { dot: 'bg-success-500', label: 'Normal' },
  warning: { dot: 'bg-warning-500', label: 'Warning' },
  critical: { dot: 'bg-danger-500', label: 'Critical' },
};

export function StatCard({
  icon,
  label,
  value,
  unit,
  trend,
  status = 'normal',
  accentColor = 'primary',
}: StatCardProps) {
  const accent = accentMap[accentColor];
  const stat = statusMap[status];

  return (
    <div className="bg-white rounded-xl border border-secondary-200/60 shadow-card p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${accent.bg} ${accent.text}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
          <span className="text-xs font-medium text-secondary-500">{stat.label}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-secondary-500">{label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-secondary-900">{value}</span>
          <span className="text-sm font-medium text-secondary-400">{unit}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-success-500" />
          ) : trend < 0 ? (
            <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-secondary-400" />
          )}
          <span
            className={`text-xs font-medium ${
              trend > 0 ? 'text-success-600' : trend < 0 ? 'text-danger-600' : 'text-secondary-400'
            }`}
          >
            {trend > 0 ? '+' : ''}
            {trend} {unit} vs last hour
          </span>
        </div>
      )}
    </div>
  );
}
