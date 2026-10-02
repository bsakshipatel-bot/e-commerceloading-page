interface StatusBadgeProps {
  status: 'online' | 'offline' | 'maintenance' | 'healthy' | 'warning' | 'critical' | 'active' | 'resolved';
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  online: { dot: 'bg-success-500', text: 'text-success-700', bg: 'bg-success-50', label: 'Online' },
  offline: { dot: 'bg-secondary-400', text: 'text-secondary-600', bg: 'bg-secondary-100', label: 'Offline' },
  maintenance: { dot: 'bg-warning-500', text: 'text-warning-700', bg: 'bg-warning-50', label: 'Maintenance' },
  healthy: { dot: 'bg-success-500', text: 'text-success-700', bg: 'bg-success-50', label: 'Healthy' },
  warning: { dot: 'bg-warning-500', text: 'text-warning-700', bg: 'bg-warning-50', label: 'Warning' },
  critical: { dot: 'bg-danger-500', text: 'text-danger-700', bg: 'bg-danger-50', label: 'Critical' },
  active: { dot: 'bg-danger-500', text: 'text-danger-700', bg: 'bg-danger-50', label: 'Active' },
  resolved: { dot: 'bg-secondary-400', text: 'text-secondary-600', bg: 'bg-secondary-100', label: 'Resolved' },
};

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label || config.label}
    </span>
  );
}
