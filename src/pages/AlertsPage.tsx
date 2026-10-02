import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { AlertItemCard } from '@/components/AlertItemCard';
import { LoadingState } from '@/components/ui/States';
import { Icons } from '@/components/icons';
import { useApiData } from '@/hooks/useApiData';
import { fetchAlerts } from '@/lib/api';
import type { AlertSeverity } from '@/types';

type Tab = 'active' | 'resolved' | 'all';

export function AlertsPage() {
  const [tab, setTab] = useState<Tab>('active');
  const { data: alerts, loading } = useApiData(fetchAlerts);

  if (loading) return <LoadingState />;

  const allAlerts = alerts ?? [];

  const filtered = allAlerts.filter((a) => {
    if (tab === 'all') return true;
    return a.status === tab;
  });

  const counts = {
    active: allAlerts.filter((a) => a.status === 'active').length,
    resolved: allAlerts.filter((a) => a.status === 'resolved').length,
    all: allAlerts.length,
  };

  const severityCounts: Record<AlertSeverity, number> = {
    critical: allAlerts.filter((a) => a.severity === 'critical' && a.status === 'active').length,
    warning: allAlerts.filter((a) => a.severity === 'warning' && a.status === 'active').length,
    info: allAlerts.filter((a) => a.severity === 'info' && a.status === 'active').length,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionTitle title="Alerts" subtitle="Monitor and manage garden notifications" />

      {/* Severity summary */}
      <div className="grid grid-cols-3 gap-4">
        <SeverityCard icon={<Icons.AlertTriangle className="w-5 h-5" />} label="Critical" count={severityCounts.critical} color="danger" />
        <SeverityCard icon={<Icons.AlertTriangle className="w-5 h-5" />} label="Warning" count={severityCounts.warning} color="warning" />
        <SeverityCard icon={<Icons.Info className="w-5 h-5" />} label="Info" count={severityCounts.info} color="accent" />
      </div>

      {/* Tabs */}
      <div className="bg-secondary-50 rounded-lg p-1 flex gap-1">
        {(['active', 'resolved', 'all'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {/* Alert list */}
      <Card>
        {filtered.length > 0 ? (
          filtered.map((alert) => <AlertItemCard key={alert.id} alert={alert} compact />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-success-50 text-success-500 mb-4">
              <Icons.CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-secondary-700">All clear!</h3>
            <p className="text-sm text-secondary-500 mt-1">No {tab} alerts at this time.</p>
          </div>
        )}
      </Card>

      <p className="text-xs text-secondary-400 text-center">
        These are demonstration alerts. Real alerts will appear here once your ESP32 is connected.
      </p>
    </div>
  );
}

function SeverityCard({ icon, label, count, color }: { icon: React.ReactNode; label: string; count: number; color: 'danger' | 'warning' | 'accent' }) {
  const colorMap = {
    danger: 'bg-danger-50 text-danger-600',
    warning: 'bg-warning-50 text-warning-600',
    accent: 'bg-accent-50 text-accent-600',
  };
  return (
    <div className="bg-white rounded-xl border border-secondary-200/60 shadow-card p-4 flex items-center gap-3">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-secondary-500">{label}</p>
        <p className="text-xl font-bold text-secondary-900">{count}</p>
      </div>
    </div>
  );
}
