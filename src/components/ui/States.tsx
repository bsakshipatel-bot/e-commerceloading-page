import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary-100 text-secondary-400 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-secondary-700">{title}</h3>
      <p className="text-sm text-secondary-500 mt-1 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface OfflineStateProps {
  message?: string;
}

export function OfflineState({ message = 'System is currently offline. Sensor data may be stale.' }: OfflineStateProps) {
  return (
    <div className="flex items-center gap-3 bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
      <p className="text-sm text-secondary-600">{message}</p>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading sensor data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-sm text-secondary-500 mt-3">{message}</p>
    </div>
  );
}
