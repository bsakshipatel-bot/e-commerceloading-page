import { Card, CardHeader } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SensorChart, ComparisonBarChart } from '@/components/charts/SensorChart';
import { LoadingState } from '@/components/ui/States';
import { Icons } from '@/components/icons';
import { useApiData } from '@/hooks/useApiData';
import { fetchSensorReadings, fetchIrrigationHistory, fetchPlants } from '@/lib/api';
import { formatDuration, formatDateTime, getDailyStats } from '@/lib/utils';

export function AnalyticsPage() {
  const { data: sensorHistory, loading: sensorsLoading } = useApiData(fetchSensorReadings);
  const { data: irrigationLogs, loading: irrigationLoading } = useApiData(fetchIrrigationHistory);
  const { data: plants, loading: plantsLoading } = useApiData(fetchPlants);

  if (sensorsLoading || irrigationLoading || plantsLoading) return <LoadingState />;

  const stats = sensorHistory ? getDailyStats(sensorHistory) : null;

  const plantMoistureData = (plants ?? []).map((p) => ({
    name: p.name,
    value: p.soilMoisture,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionTitle title="Analytics" subtitle="Historical sensor data and irrigation insights" />

      {/* Daily averages */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatBox icon={<Icons.Droplets className="w-4 h-4" />} label="Avg Soil Moisture" value={`${stats.soilMoisture.avg}%`} sub={`Min ${stats.soilMoisture.min}% · Max ${stats.soilMoisture.max}%`} color="accent" />
          <StatBox icon={<Icons.Thermometer className="w-4 h-4" />} label="Avg Temperature" value={`${stats.temperature.avg}°C`} sub={`Min ${stats.temperature.min}°C · Max ${stats.temperature.max}°C`} color="warning" />
          <StatBox icon={<Icons.CloudRain className="w-4 h-4" />} label="Avg Humidity" value={`${stats.humidity.avg}%`} sub={`Min ${stats.humidity.min}% · Max ${stats.humidity.max}%`} color="primary" />
          <StatBox icon={<Icons.Sun className="w-4 h-4" />} label="Avg Light" value={`${stats.lightIntensity.avg} lux`} sub={`Min ${stats.lightIntensity.min} · Max ${stats.lightIntensity.max}`} color="warning" />
          <StatBox icon={<Icons.Gauge className="w-4 h-4" />} label="Avg Water Tank" value={`${stats.waterTank.avg}%`} sub={`Min ${stats.waterTank.min}% · Max ${stats.waterTank.max}%`} color="danger" />
        </div>
      )}

      {/* Historical sensor charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Soil Moisture — 24h" subtitle="Hourly readings" icon={<Icons.Droplets className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="soilMoisture" color="#0ea5e9" unit="%" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Temperature — 24h" subtitle="Hourly readings" icon={<Icons.Thermometer className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="temperature" color="#f59e0b" unit="°C" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Humidity — 24h" subtitle="Hourly readings" icon={<Icons.CloudRain className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="humidity" color="#22c55e" unit="%" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Light Intensity — 24h" subtitle="Hourly readings" icon={<Icons.Sun className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="lightIntensity" color="#f59e0b" unit=" lux" type="bar" />}
          </div>
        </Card>
      </div>

      {/* Plant comparison */}
      <Card>
        <CardHeader title="Plant Moisture Comparison" subtitle="Current soil moisture by plant" icon={<Icons.Sprout className="w-4 h-4" />} />
        <div className="px-3 pb-4">
          {plantMoistureData.length > 0 && (
            <ComparisonBarChart data={plantMoistureData} color="#0ea5e9" unit="%" height={220} />
          )}
        </div>
      </Card>

      {/* Irrigation summary */}
      <Card>
        <CardHeader title="Irrigation Summary" subtitle="Recent watering activity" icon={<Icons.Waves className="w-4 h-4" />} />
        <div className="px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-secondary-500 border-b border-secondary-100">
                  <th className="py-2 font-medium">Plant</th>
                  <th className="py-2 font-medium">Mode</th>
                  <th className="py-2 font-medium">Duration</th>
                  <th className="py-2 font-medium">Trigger</th>
                  <th className="py-2 font-medium">Time</th>
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
                    <td className="py-3 text-secondary-400">{formatDateTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatBox({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: 'primary' | 'accent' | 'warning' | 'danger' }) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
  };
  return (
    <div className="bg-white rounded-xl border border-secondary-200/60 shadow-card p-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${colorMap[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-secondary-500">{label}</p>
      <p className="text-xl font-bold text-secondary-900 mt-0.5">{value}</p>
      <p className="text-xs text-secondary-400 mt-1">{sub}</p>
    </div>
  );
}
