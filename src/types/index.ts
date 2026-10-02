export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'resolved';
export type AlertType =
  | 'low_soil_moisture'
  | 'water_tank_low'
  | 'pump_activated'
  | 'high_temperature'
  | 'low_humidity'
  | 'high_light'
  | 'pump_deactivated';

export interface AlertItem {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  plantName?: string;
  value?: string;
  timestamp: string;
}

export type PlantHealth = 'healthy' | 'warning' | 'critical';

export interface Plant {
  id: string;
  name: string;
  species: string;
  health: PlantHealth;
  soilMoisture: number;
  temperature: number;
  lastWatered: string;
  waterRequirement: number;
  moistureThreshold: number;
  location: string;
  imageUrl: string;
}

export interface SensorReading {
  time: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lightIntensity: number;
  waterTank: number;
}

export interface IrrigationLog {
  id: string;
  plantName: string;
  mode: 'manual' | 'automatic';
  duration: number;
  trigger: string;
  timestamp: string;
}

export interface PumpActivity {
  id: string;
  action: 'on' | 'off';
  mode: 'manual' | 'automatic';
  reason: string;
  timestamp: string;
}

export interface SystemSettings {
  gardenName: string;
  moistureThreshold: number;
  temperatureWarning: number;
  waterTankWarning: number;
  notificationsEnabled: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
  systemStatus: 'online' | 'offline' | 'maintenance';
}
