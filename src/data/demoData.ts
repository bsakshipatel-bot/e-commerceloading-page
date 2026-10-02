import type {
  AlertItem,
  IrrigationLog,
  Plant,
  PumpActivity,
  SensorReading,
  SystemSettings,
} from '@/types';

export const demoPlants: Plant[] = [
  {
    id: 'plant-tomato',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    health: 'healthy',
    soilMoisture: 68,
    temperature: 23.4,
    lastWatered: '2026-08-19T06:30:00',
    waterRequirement: 75,
    moistureThreshold: 45,
    location: 'Garden Bed A',
    imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'plant-chilli',
    name: 'Chilli',
    species: 'Capsicum annuum',
    health: 'warning',
    soilMoisture: 38,
    temperature: 27.8,
    lastWatered: '2026-08-18T18:15:00',
    waterRequirement: 60,
    moistureThreshold: 40,
    location: 'Garden Bed B',
    imageUrl: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'plant-aloe',
    name: 'Aloe Vera',
    species: 'Aloe barbadensis',
    health: 'healthy',
    soilMoisture: 52,
    temperature: 24.1,
    lastWatered: '2026-08-18T22:00:00',
    waterRequirement: 30,
    moistureThreshold: 20,
    location: 'Patio Pot 1',
    imageUrl: 'https://images.pexels.com/photos/3364359/pexels-photo-3364359.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'plant-sunflower',
    name: 'Sunflower',
    species: 'Helianthus annuus',
    health: 'critical',
    soilMoisture: 22,
    temperature: 31.2,
    lastWatered: '2026-08-17T14:00:00',
    waterRequirement: 70,
    moistureThreshold: 35,
    location: 'Garden Bed C',
    imageUrl: 'https://images.pexels.com/photos/1428205/pexels-photo-1428205.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const demoSensorHistory: SensorReading[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const baseTemp = 20 + 8 * Math.sin((hour - 6) * Math.PI / 12);
  const baseMoisture = 55 + 15 * Math.sin((hour - 3) * Math.PI / 8);
  const baseHumidity = 65 - 20 * Math.sin((hour - 6) * Math.PI / 12);
  const baseLight = hour >= 6 && hour <= 18 ? 80 * Math.sin((hour - 6) * Math.PI / 12) : 2;
  return {
    time: `${hour.toString().padStart(2, '0')}:00`,
    soilMoisture: Math.round(Math.max(20, Math.min(85, baseMoisture))),
    temperature: Math.round((Math.max(15, Math.min(35, baseTemp))) * 10) / 10,
    humidity: Math.round(Math.max(30, Math.min(90, baseHumidity))),
    lightIntensity: Math.round(Math.max(0, Math.min(100, baseLight))),
    waterTank: Math.round(Math.max(20, Math.min(95, 80 - i * 1.5))),
  };
});

export const demoAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'low_soil_moisture',
    severity: 'critical',
    status: 'active',
    message: 'Soil moisture below critical threshold for Sunflower',
    plantName: 'Sunflower',
    value: '22%',
    timestamp: '2026-08-19T07:45:00',
  },
  {
    id: 'alert-2',
    type: 'high_temperature',
    severity: 'warning',
    status: 'active',
    message: 'Temperature above warning threshold in Garden Bed C',
    plantName: 'Sunflower',
    value: '31.2°C',
    timestamp: '2026-08-19T07:30:00',
  },
  {
    id: 'alert-3',
    type: 'water_tank_low',
    severity: 'warning',
    status: 'active',
    message: 'Water tank level below 30%',
    value: '28%',
    timestamp: '2026-08-19T06:15:00',
  },
  {
    id: 'alert-4',
    type: 'pump_activated',
    severity: 'info',
    status: 'resolved',
    message: 'Automatic irrigation activated for Tomato plant',
    plantName: 'Tomato',
    value: '3 min',
    timestamp: '2026-08-19T06:30:00',
  },
  {
    id: 'alert-5',
    type: 'low_soil_moisture',
    severity: 'warning',
    status: 'resolved',
    message: 'Soil moisture recovered for Chilli plant',
    plantName: 'Chilli',
    value: '42%',
    timestamp: '2026-08-18T19:00:00',
  },
  {
    id: 'alert-6',
    type: 'pump_deactivated',
    severity: 'info',
    status: 'resolved',
    message: 'Manual pump control turned off by user',
    value: 'Off',
    timestamp: '2026-08-18T17:30:00',
  },
];

export const demoIrrigationLogs: IrrigationLog[] = [
  {
    id: 'log-1',
    plantName: 'Tomato',
    mode: 'automatic',
    duration: 180,
    trigger: 'Soil moisture fell below 45%',
    timestamp: '2026-08-19T06:30:00',
  },
  {
    id: 'log-2',
    plantName: 'Chilli',
    mode: 'manual',
    duration: 60,
    trigger: 'Manual activation by user',
    timestamp: '2026-08-18T18:15:00',
  },
  {
    id: 'log-3',
    plantName: 'Aloe Vera',
    mode: 'automatic',
    duration: 45,
    trigger: 'Soil moisture fell below 20%',
    timestamp: '2026-08-18T22:00:00',
  },
  {
    id: 'log-4',
    plantName: 'Tomato',
    mode: 'automatic',
    duration: 120,
    trigger: 'Scheduled evening watering',
    timestamp: '2026-08-18T18:00:00',
  },
  {
    id: 'log-5',
    plantName: 'Chilli',
    mode: 'manual',
    duration: 90,
    trigger: 'Manual activation by user',
    timestamp: '2026-08-17T16:30:00',
  },
];

export const demoPumpActivity: PumpActivity[] = [
  {
    id: 'pump-1',
    action: 'on',
    mode: 'automatic',
    reason: 'Soil moisture below threshold (Tomato)',
    timestamp: '2026-08-19T06:30:00',
  },
  {
    id: 'pump-2',
    action: 'off',
    mode: 'automatic',
    reason: 'Target moisture level reached',
    timestamp: '2026-08-19T06:33:00',
  },
  {
    id: 'pump-3',
    action: 'on',
    mode: 'manual',
    reason: 'Manual activation by user',
    timestamp: '2026-08-18T18:15:00',
  },
  {
    id: 'pump-4',
    action: 'off',
    mode: 'manual',
    reason: 'Manual deactivation by user',
    timestamp: '2026-08-18T18:16:00',
  },
  {
    id: 'pump-5',
    action: 'on',
    mode: 'automatic',
    reason: 'Soil moisture below threshold (Aloe Vera)',
    timestamp: '2026-08-18T22:00:00',
  },
];

export const demoSettings: SystemSettings = {
  gardenName: 'Smart Garden',
  moistureThreshold: 35,
  temperatureWarning: 30,
  waterTankWarning: 30,
  notificationsEnabled: true,
  emailAlerts: true,
  pushAlerts: false,
  systemStatus: 'online',
};

export const demoCurrentReadings = {
  soilMoisture: { value: 58, unit: '%', trend: -3, status: 'normal' as const },
  temperature: { value: 24.6, unit: '°C', trend: 1.2, status: 'normal' as const },
  humidity: { value: 62, unit: '%', trend: -5, status: 'normal' as const },
  lightIntensity: { value: 78, unit: 'lux', trend: 12, status: 'normal' as const },
  waterTank: { value: 28, unit: '%', trend: -8, status: 'warning' as const },
};
