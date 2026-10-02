import { Card, CardHeader } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { PumpControlCard } from '@/components/PumpControlCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/States';
import { Icons } from '@/components/icons';
import { useApiData } from '@/hooks/useApiData';
import {
  fetchIrrigationHistory,
  fetchPumpActivity,
  fetchPumpStatus,
  updatePumpStatus,
} from '@/lib/api';
import { formatDuration, formatDateTime, formatTimeAgo } from '@/lib/utils';

export function IrrigationPage() {
  const { data: irrigationLogs, loading: irrigationLoading } = useApiData(fetchIrrigationHistory);
  const { data: pumpActivity, loading: activityLoading } = useApiData(fetchPumpActivity);
  const { data: pumpStatus, loading: pumpLoading } = useApiData(fetchPumpStatus);

  if (irrigationLoading || activityLoading || pumpLoading) return <LoadingState />;

  const status = pumpStatus ?? { isOn: false, mode: 'automatic' as const, moistureThreshold: 35 };
  const todayWaterings = (irrigationLogs ?? []).filter((l) => {
    const d = new Date(l.timestamp);
    const now = new Date('2026-08-19T08:00:00');
    return d.toDateString() === now.toDateString();
  });
  const totalDuration = todayWaterings.reduce((sum, l) => sum + l.duration, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionTitle title="Irrigation Control" subtitle="Manage your water pump and irrigation schedule" />

      {/* Top row: pump status + control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pump status */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary-100 text-secondary-500">
              <Icons.Power className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-secondary-900">Pump Status</h3>
              <p className="text-xs text-secondary-500">Current operating state</p>
            </div>
          </div>
          <div className="space-y-3">
            <Row label="State" value={<StatusBadge status={status.isOn ? 'online' : 'offline'} label={status.isOn ? 'Running' : 'Stopped'} size="sm" />} />
            <Row label="Mode" value={<span className="text-sm font-medium text-secondary-700 capitalize">{status.mode}</span>} />
            <Row label="Moisture Threshold" value={<span className="text-sm font-medium text-secondary-700">{status.moistureThreshold}%</span>} />
            <Row label="Total Waterings Today" value={<span className="text-sm font-medium text-secondary-700">{todayWaterings.length}</span>} />
            <Row label="Total Duration" value={<span className="text-sm font-medium text-secondary-700">{formatDuration(totalDuration)}</span>} />
          </div>
        </Card>

        {/* Pump control */}
        <div className="lg:col-span-2">
          <PumpControlCard
            isOn={status.isOn}
            mode={status.mode}
            threshold={status.moistureThreshold}
            onTogglePump={async () => {
              await updatePumpStatus({ ...status, isOn: !status.isOn });
            }}
            onToggleMode={async () => {
              await updatePumpStatus({
                ...status,
                mode: status.mode === 'manual' ? 'automatic' : 'manual',
              });
            }}
          />
        </div>
      </div>

      {/* Irrigation history */}
      <Card>
        <CardHeader title="Irrigation History" subtitle="Recent watering events" icon={<Icons.Waves className="w-4 h-4" />} />
        <div className="px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-secondary-500 border-b border-secondary-100">
                  <th className="py-2 font-medium">Plant</th>
                  <th className="py-2 font-medium">Mode</th>
                  <th className="py-2 font-medium">Duration</th>
                  <th className="py-2 font-medium">Trigger</th>
                  <th className="py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {(irrigationLogs ?? []).map((log) => (
                  <tr key={log.id} className="border-b border-secondary-50 last:border-b-0">
                    <td className="py-3 font-medium text-secondary-900">{log.plantName}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${log.mode === 'automatic' ? 'bg-accent-50 text-accent-600' : 'bg-secondary-100 text-secondary-600'}`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-3 text-secondary-600">{formatDuration(log.duration)}</td>
                    <td className="py-3 text-secondary-500">{log.trigger}</td>
                    <td className="py-3 text-secondary-400">{formatTimeAgo(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Pump activity log */}
      <Card>
        <CardHeader title="Pump Activity Log" subtitle="On/off events" icon={<Icons.Activity className="w-4 h-4" />} />
        <div className="px-5 pb-5">
          <div className="space-y-1">
            {(pumpActivity ?? []).map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 py-3 border-b border-secondary-50 last:border-b-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${entry.action === 'on' ? 'bg-success-50 text-success-600' : 'bg-secondary-100 text-secondary-500'}`}>
                  {entry.action === 'on' ? <Icons.Power className="w-4 h-4" /> : <Icons.XCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">
                    Pump turned <span className={entry.action === 'on' ? 'text-success-600' : 'text-secondary-600'}>{entry.action.toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-secondary-500">{entry.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-secondary-400">{formatTimeAgo(entry.timestamp)}</p>
                  <p className="text-xs text-secondary-300">{formatDateTime(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-secondary-500">{label}</span>
      {value}
    </div>
  );
}
