import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { PlantCard } from '@/components/PlantCard';
import { PumpControlCard } from '@/components/PumpControlCard';
import { AlertItemCard } from '@/components/AlertItemCard';
import { SensorChart } from '@/components/charts/SensorChart';
import { LoadingState } from '@/components/ui/States';
import { Icons } from '@/components/icons';
import { useApiData } from '@/hooks/useApiData';
import {
  fetchPlants,
  fetchSensorReadings,
  fetchAlerts,
  fetchPumpStatus,
  computeCurrentReadings,
} from '@/lib/api';

export function DashboardPage() {
  const { data: plants, loading: plantsLoading } = useApiData(fetchPlants);
  const { data: sensorHistory, loading: sensorsLoading } = useApiData(fetchSensorReadings);
  const { data: alerts, loading: alertsLoading } = useApiData(fetchAlerts);
  const { data: pumpStatus } = useApiData(fetchPumpStatus);

  const loading = plantsLoading || sensorsLoading || alertsLoading;

  if (loading) return <LoadingState />;

  const currentReadings = sensorHistory ? computeCurrentReadings(sensorHistory) : null;
  const activeAlerts = (alerts ?? []).filter((a) => a.status === 'active');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {currentReadings && (
          <>
            <StatCard
              icon={<Icons.Droplets className="w-5 h-5" />}
              label="Soil Moisture"
              value={currentReadings.soilMoisture.value}
              unit={currentReadings.soilMoisture.unit}
              trend={currentReadings.soilMoisture.trend}
              status={currentReadings.soilMoisture.status}
              accentColor="accent"
            />
            <StatCard
              icon={<Icons.Thermometer className="w-5 h-5" />}
              label="Temperature"
              value={currentReadings.temperature.value}
              unit={currentReadings.temperature.unit}
              trend={currentReadings.temperature.trend}
              status={currentReadings.temperature.status}
              accentColor="warning"
            />
            <StatCard
              icon={<Icons.CloudRain className="w-5 h-5" />}
              label="Humidity"
              value={currentReadings.humidity.value}
              unit={currentReadings.humidity.unit}
              trend={currentReadings.humidity.trend}
              status={currentReadings.humidity.status}
              accentColor="primary"
            />
            <StatCard
              icon={<Icons.Sun className="w-5 h-5" />}
              label="Light Intensity"
              value={currentReadings.lightIntensity.value}
              unit={currentReadings.lightIntensity.unit}
              trend={currentReadings.lightIntensity.trend}
              status={currentReadings.lightIntensity.status}
              accentColor="warning"
            />
            <StatCard
              icon={<Icons.Gauge className="w-5 h-5" />}
              label="Water Tank"
              value={currentReadings.waterTank.value}
              unit={currentReadings.waterTank.unit}
              trend={currentReadings.waterTank.trend}
              status={currentReadings.waterTank.status}
              accentColor="danger"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Soil Moisture" subtitle="Last 24 hours" icon={<Icons.Droplets className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="soilMoisture" color="#0ea5e9" unit="%" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Temperature" subtitle="Last 24 hours" icon={<Icons.Thermometer className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="temperature" color="#f59e0b" unit="°C" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Humidity" subtitle="Last 24 hours" icon={<Icons.CloudRain className="w-4 h-4" />} />
          <div className="px-3 pb-4">
            {sensorHistory && <SensorChart data={sensorHistory} dataKey="humidity" color="#22c55e" unit="%" />}
          </div>
        </Card>
      </div>

      {/* Plants + Pump control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionTitle title="My Plants" subtitle="Monitor your garden" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(plants ?? []).map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <SectionTitle title="Irrigation" />
            {pumpStatus && (
              <PumpControlCard
                isOn={pumpStatus.isOn}
                mode={pumpStatus.mode}
                threshold={pumpStatus.moistureThreshold}
              />
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <SectionTitle
          title="Recent Alerts"
          subtitle="Latest notifications from your garden"
          action={
            <span className="text-xs text-secondary-400 bg-secondary-100 px-2 py-1 rounded-full">
              Demo data
            </span>
          }
        />
        <Card>
          {activeAlerts.map((alert) => (
            <AlertItemCard key={alert.id} alert={alert} compact />
          ))}
        </Card>
      </div>
    </div>
  );
}
