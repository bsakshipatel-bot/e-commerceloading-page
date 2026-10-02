import { supabase } from '@/lib/supabase';
import {
  demoPlants,
  demoSensorHistory,
  demoAlerts,
  demoIrrigationLogs,
  demoPumpActivity,
  demoSettings,
} from '@/data/demoData';
import type {
  AlertItem,
  AlertType,
  IrrigationLog,
  Plant,
  PlantHealth,
  PumpActivity,
  SensorReading,
  SystemSettings,
} from '@/types';

// ---------------------------------------------------------------------------
// Mappers: DB snake_case → TS camelCase
// ---------------------------------------------------------------------------

interface PlantRow {
  id: string;
  name: string;
  species: string | null;
  health: string;
  soil_moisture: number;
  temperature: number;
  last_watered: string | null;
  water_requirement: number;
  moisture_threshold: number;
  location: string | null;
  image_url: string | null;
}

function mapPlant(row: PlantRow): Plant {
  return {
    id: row.id,
    name: row.name,
    species: row.species ?? '',
    health: row.health as PlantHealth,
    soilMoisture: Number(row.soil_moisture),
    temperature: Number(row.temperature),
    lastWatered: row.last_watered ?? '',
    waterRequirement: row.water_requirement,
    moistureThreshold: row.moisture_threshold,
    location: row.location ?? '',
    imageUrl: row.image_url ?? '',
  };
}

interface SensorRow {
  id: string;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  light_intensity: number;
  water_tank_level: number;
  recorded_at: string;
}

function mapSensorReading(row: SensorRow): SensorReading {
  const d = new Date(row.recorded_at);
  const time = `${d.getHours().toString().padStart(2, '0')}:00`;
  return {
    time,
    soilMoisture: Number(row.soil_moisture),
    temperature: Number(row.temperature),
    humidity: Number(row.humidity),
    lightIntensity: Number(row.light_intensity),
    waterTank: Number(row.water_tank_level),
  };
}

interface AlertRow {
  id: string;
  type: string;
  severity: string;
  status: string;
  message: string;
  plant_name: string | null;
  value: string | null;
  triggered_at: string;
}

function mapAlert(row: AlertRow): AlertItem {
  return {
    id: row.id,
    type: row.type as AlertType,
    severity: row.severity as AlertItem['severity'],
    status: row.status as AlertItem['status'],
    message: row.message,
    plantName: row.plant_name || undefined,
    value: row.value || undefined,
    timestamp: row.triggered_at,
  };
}

interface IrrigationRow {
  id: string;
  plant_name: string;
  mode: string;
  duration_seconds: number;
  trigger_reason: string;
  started_at: string;
}

function mapIrrigationLog(row: IrrigationRow): IrrigationLog {
  return {
    id: row.id,
    plantName: row.plant_name,
    mode: row.mode as IrrigationLog['mode'],
    duration: row.duration_seconds,
    trigger: row.trigger_reason,
    timestamp: row.started_at,
  };
}

interface PumpActivityRow {
  id: string;
  action: string;
  mode: string;
  reason: string;
  occurred_at: string;
}

function mapPumpActivity(row: PumpActivityRow): PumpActivity {
  return {
    id: row.id,
    action: row.action as PumpActivity['action'],
    mode: row.mode as PumpActivity['mode'],
    reason: row.reason,
    timestamp: row.occurred_at,
  };
}

interface SettingsRow {
  garden_name: string;
  moisture_threshold: number;
  temperature_warning: number;
  water_tank_warning: number;
  notifications_enabled: boolean;
  email_alerts: boolean;
  push_alerts: boolean;
  system_status: string;
}

function mapSettings(row: SettingsRow): SystemSettings {
  return {
    gardenName: row.garden_name,
    moistureThreshold: row.moisture_threshold,
    temperatureWarning: row.temperature_warning,
    waterTankWarning: row.water_tank_warning,
    notificationsEnabled: row.notifications_enabled,
    emailAlerts: row.email_alerts,
    pushAlerts: row.push_alerts,
    systemStatus: row.system_status as SystemSettings['systemStatus'],
  };
}

interface PumpStatusRow {
  id: string;
  is_on: boolean;
  mode: string;
  moisture_threshold: number;
}

export interface PumpStatus {
  isOn: boolean;
  mode: 'manual' | 'automatic';
  moistureThreshold: number;
}

function mapPumpStatus(row: PumpStatusRow): PumpStatus {
  return {
    isOn: row.is_on,
    mode: row.mode as PumpStatus['mode'],
    moistureThreshold: row.moisture_threshold,
  };
}

// ---------------------------------------------------------------------------
// API functions — each falls back to demo data on error
// ---------------------------------------------------------------------------

export async function fetchPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('name');
  if (error || !data || data.length === 0) return demoPlants;
  return (data as PlantRow[]).map(mapPlant);
}

export async function fetchSensorReadings(): Promise<SensorReading[]> {
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .order('recorded_at', { ascending: true })
    .limit(24);
  if (error || !data || data.length === 0) return demoSensorHistory;
  return (data as SensorRow[]).map(mapSensorReading);
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('triggered_at', { ascending: false });
  if (error || !data || data.length === 0) return demoAlerts;
  return (data as AlertRow[]).map(mapAlert);
}

export async function fetchIrrigationHistory(): Promise<IrrigationLog[]> {
  const { data, error } = await supabase
    .from('irrigation_history')
    .select('*')
    .order('started_at', { ascending: false });
  if (error || !data || data.length === 0) return demoIrrigationLogs;
  return (data as IrrigationRow[]).map(mapIrrigationLog);
}

export async function fetchPumpActivity(): Promise<PumpActivity[]> {
  const { data, error } = await supabase
    .from('pump_activity')
    .select('*')
    .order('occurred_at', { ascending: false });
  if (error || !data || data.length === 0) return demoPumpActivity;
  return (data as PumpActivityRow[]).map(mapPumpActivity);
}

export async function fetchSettings(): Promise<SystemSettings> {
  const { data, error } = await supabase
    .from('garden_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error || !data) return demoSettings;
  return mapSettings(data as SettingsRow);
}

export async function fetchPumpStatus(): Promise<PumpStatus> {
  const { data, error } = await supabase
    .from('pump_status')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    return { isOn: false, mode: 'automatic', moistureThreshold: demoSettings.moistureThreshold };
  }
  return mapPumpStatus(data as PumpStatusRow);
}

export async function updateSettings(settings: SystemSettings): Promise<void> {
  const { data: existing } = await supabase
    .from('garden_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('garden_settings')
      .update({
        garden_name: settings.gardenName,
        moisture_threshold: settings.moistureThreshold,
        temperature_warning: settings.temperatureWarning,
        water_tank_warning: settings.waterTankWarning,
        notifications_enabled: settings.notificationsEnabled,
        email_alerts: settings.emailAlerts,
        push_alerts: settings.pushAlerts,
        system_status: settings.systemStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (existing as { id: string }).id);
  } else {
    await supabase.from('garden_settings').insert({
      garden_name: settings.gardenName,
      moisture_threshold: settings.moistureThreshold,
      temperature_warning: settings.temperatureWarning,
      water_tank_warning: settings.waterTankWarning,
      notifications_enabled: settings.notificationsEnabled,
      email_alerts: settings.emailAlerts,
      push_alerts: settings.pushAlerts,
      system_status: settings.systemStatus,
    });
  }
}

export async function updatePumpStatus(status: PumpStatus): Promise<void> {
  const { data: existing } = await supabase
    .from('pump_status')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('pump_status')
      .update({
        is_on: status.isOn,
        mode: status.mode,
        moisture_threshold: status.moistureThreshold,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (existing as { id: string }).id);
  } else {
    await supabase.from('pump_status').insert({
      is_on: status.isOn,
      mode: status.mode,
      moisture_threshold: status.moistureThreshold,
    });
  }
}

// ---------------------------------------------------------------------------
// Derived data — current readings with trends from sensor history
// ---------------------------------------------------------------------------

export function computeCurrentReadings(history: SensorReading[]) {
  if (history.length < 2) {
    return {
      soilMoisture: { value: 0, unit: '%', trend: 0, status: 'normal' as const },
      temperature: { value: 0, unit: '°C', trend: 0, status: 'normal' as const },
      humidity: { value: 0, unit: '%', trend: 0, status: 'normal' as const },
      lightIntensity: { value: 0, unit: 'lux', trend: 0, status: 'normal' as const },
      waterTank: { value: 0, unit: '%', trend: 0, status: 'normal' as const },
    };
  }

  const latest = history[history.length - 1];
  const prev = history[history.length - 2];

  const trend = (curr: number, p: number) => Math.round((curr - p) * 10) / 10;

  return {
    soilMoisture: {
      value: latest.soilMoisture,
      unit: '%',
      trend: trend(latest.soilMoisture, prev.soilMoisture),
      status: latest.soilMoisture < 30 ? ('warning' as const) : ('normal' as const),
    },
    temperature: {
      value: latest.temperature,
      unit: '°C',
      trend: trend(latest.temperature, prev.temperature),
      status: latest.temperature > 30 ? ('warning' as const) : ('normal' as const),
    },
    humidity: {
      value: latest.humidity,
      unit: '%',
      trend: trend(latest.humidity, prev.humidity),
      status: 'normal' as const,
    },
    lightIntensity: {
      value: latest.lightIntensity,
      unit: 'lux',
      trend: trend(latest.lightIntensity, prev.lightIntensity),
      status: 'normal' as const,
    },
    waterTank: {
      value: latest.waterTank,
      unit: '%',
      trend: trend(latest.waterTank, prev.waterTank),
      status: latest.waterTank < 30 ? ('warning' as const) : ('normal' as const),
    },
  };
}
