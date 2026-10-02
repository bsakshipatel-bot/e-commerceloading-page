/*
# Smart Garden — Initial Database Schema

## Overview
Creates the complete data model for the Smart Garden IoT monitoring system.
This is a single-tenant app with no authentication, so all policies allow
anon + authenticated roles to read and write (the data is intentionally shared).

## New Tables

1. **plants** — Individual plants being monitored in the garden
   - `id` (uuid, primary key)
   - `name` (text, not null) — display name e.g. "Tomato"
   - `species` (text) — scientific name e.g. "Solanum lycopersicum"
   - `health` (text, default 'healthy') — one of: healthy, warning, critical
   - `soil_moisture` (numeric, default 0) — current soil moisture percentage
   - `temperature` (numeric, default 0) — current temperature in °C
   - `last_watered` (timestamptz) — when the plant was last watered
   - `water_requirement` (integer, default 50) — target moisture percentage
   - `moisture_threshold` (integer, default 35) — below this, irrigation triggers
   - `location` (text) — physical location e.g. "Garden Bed A"
   - `image_url` (text) — URL to plant image
   - `created_at` (timestamptz, default now)

2. **sensor_readings** — Time-series sensor data from ESP32
   - `id` (uuid, primary key)
   - `plant_id` (uuid, FK → plants, nullable) — which plant this reading is for
   - `soil_moisture` (numeric, default 0) — percentage
   - `temperature` (numeric, default 0) — °C
   - `humidity` (numeric, default 0) — percentage
   - `light_intensity` (numeric, default 0) — lux
   - `water_tank_level` (numeric, default 0) — percentage
   - `recorded_at` (timestamptz, default now) — when the ESP32 took the reading
   - `created_at` (timestamptz, default now)

3. **pump_status** — Current water pump state (single-row table)
   - `id` (uuid, primary key)
   - `is_on` (boolean, default false) — whether the pump is currently running
   - `mode` (text, default 'automatic') — manual or automatic
   - `moisture_threshold` (integer, default 35) — auto-irrigation trigger level
   - `updated_at` (timestamptz, default now)

4. **irrigation_history** — Log of watering events
   - `id` (uuid, primary key)
   - `plant_id` (uuid, FK → plants, nullable) — which plant was watered
   - `plant_name` (text) — denormalized plant name for display
   - `mode` (text) — manual or automatic
   - `duration_seconds` (integer, default 0) — how long the pump ran
   - `trigger_reason` (text) — why irrigation started
   - `started_at` (timestamptz, default now) — when the watering event occurred
   - `created_at` (timestamptz, default now)

5. **pump_activity** — On/off event log for the pump
   - `id` (uuid, primary key)
   - `action` (text) — 'on' or 'off'
   - `mode` (text) — manual or automatic
   - `reason` (text) — why the pump changed state
   - `occurred_at` (timestamptz, default now) — when the event happened
   - `created_at` (timestamptz, default now)

6. **alerts** — Garden alert notifications
   - `id` (uuid, primary key)
   - `type` (text, not null) — alert type e.g. low_soil_moisture, high_temperature
   - `severity` (text, default 'info') — critical, warning, or info
   - `status` (text, default 'active') — active or resolved
   - `message` (text, not null) — human-readable alert message
   - `plant_name` (text) — related plant if any
   - `value` (text) — the reading that triggered the alert
   - `triggered_at` (timestamptz, default now) — when the alert fired
   - `resolved_at` (timestamptz) — when the alert was resolved (null if active)
   - `created_at` (timestamptz, default now)

7. **garden_settings** — Global garden configuration (single-row table)
   - `id` (uuid, primary key)
   - `garden_name` (text, default 'Smart Garden')
   - `moisture_threshold` (integer, default 35)
   - `temperature_warning` (integer, default 30)
   - `water_tank_warning` (integer, default 30)
   - `notifications_enabled` (boolean, default true)
   - `email_alerts` (boolean, default true)
   - `push_alerts` (boolean, default false)
   - `system_status` (text, default 'online') — online, offline, maintenance
   - `updated_at` (timestamptz, default now)

## Indexes
- `sensor_readings` on `recorded_at` (descending) — for time-series queries
- `sensor_readings` on `plant_id` — for per-plant history
- `irrigation_history` on `started_at` (descending)
- `pump_activity` on `occurred_at` (descending)
- `alerts` on `triggered_at` (descending)
- `alerts` on `status` — for active/resolved filtering

## Security
- RLS enabled on ALL tables.
- All policies use `TO anon, authenticated` since this is a single-tenant
  no-auth app — the data is intentionally shared/public.
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE) with `USING (true)`
  because all data is public/shared.

## Important Notes
1. The pump_status and garden_settings tables are designed as single-row
   tables. The app will upsert into them by ID.
2. sensor_readings.plant_id is nullable so system-wide readings (not tied
   to a specific plant) can also be stored.
3. irrigation_history stores a denormalized plant_name so historical records
   remain readable even if a plant is later deleted.
4. All timestamps use timestamptz for proper timezone handling.
*/

-- ============================================================================
-- 1. PLANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text DEFAULT '',
  health text NOT NULL DEFAULT 'healthy' CHECK (health IN ('healthy', 'warning', 'critical')),
  soil_moisture numeric NOT NULL DEFAULT 0,
  temperature numeric NOT NULL DEFAULT 0,
  last_watered timestamptz,
  water_requirement integer NOT NULL DEFAULT 50,
  moisture_threshold integer NOT NULL DEFAULT 35,
  location text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_plants" ON plants;
CREATE POLICY "anon_select_plants" ON plants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_plants" ON plants;
CREATE POLICY "anon_insert_plants" ON plants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_plants" ON plants;
CREATE POLICY "anon_update_plants" ON plants FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_plants" ON plants;
CREATE POLICY "anon_delete_plants" ON plants FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- 2. SENSOR_READINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid REFERENCES plants(id) ON DELETE SET NULL,
  soil_moisture numeric NOT NULL DEFAULT 0,
  temperature numeric NOT NULL DEFAULT 0,
  humidity numeric NOT NULL DEFAULT 0,
  light_intensity numeric NOT NULL DEFAULT 0,
  water_tank_level numeric NOT NULL DEFAULT 0,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sensor_readings" ON sensor_readings;
CREATE POLICY "anon_select_sensor_readings" ON sensor_readings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sensor_readings" ON sensor_readings;
CREATE POLICY "anon_insert_sensor_readings" ON sensor_readings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sensor_readings" ON sensor_readings;
CREATE POLICY "anon_update_sensor_readings" ON sensor_readings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sensor_readings" ON sensor_readings;
CREATE POLICY "anon_delete_sensor_readings" ON sensor_readings
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_recorded_at ON sensor_readings (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_plant_id ON sensor_readings (plant_id);

-- ============================================================================
-- 3. PUMP_STATUS
-- ============================================================================
CREATE TABLE IF NOT EXISTS pump_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_on boolean NOT NULL DEFAULT false,
  mode text NOT NULL DEFAULT 'automatic' CHECK (mode IN ('manual', 'automatic')),
  moisture_threshold integer NOT NULL DEFAULT 35,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pump_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pump_status" ON pump_status;
CREATE POLICY "anon_select_pump_status" ON pump_status FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_pump_status" ON pump_status;
CREATE POLICY "anon_insert_pump_status" ON pump_status FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_pump_status" ON pump_status;
CREATE POLICY "anon_update_pump_status" ON pump_status FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_pump_status" ON pump_status;
CREATE POLICY "anon_delete_pump_status" ON pump_status FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- 4. IRRIGATION_HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS irrigation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid REFERENCES plants(id) ON DELETE SET NULL,
  plant_name text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'automatic' CHECK (mode IN ('manual', 'automatic')),
  duration_seconds integer NOT NULL DEFAULT 0,
  trigger_reason text NOT NULL DEFAULT '',
  started_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE irrigation_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_irrigation_history" ON irrigation_history;
CREATE POLICY "anon_select_irrigation_history" ON irrigation_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_irrigation_history" ON irrigation_history;
CREATE POLICY "anon_insert_irrigation_history" ON irrigation_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_irrigation_history" ON irrigation_history;
CREATE POLICY "anon_update_irrigation_history" ON irrigation_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_irrigation_history" ON irrigation_history;
CREATE POLICY "anon_delete_irrigation_history" ON irrigation_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_irrigation_history_started_at ON irrigation_history (started_at DESC);

-- ============================================================================
-- 5. PUMP_ACTIVITY
-- ============================================================================
CREATE TABLE IF NOT EXISTS pump_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL CHECK (action IN ('on', 'off')),
  mode text NOT NULL DEFAULT 'automatic' CHECK (mode IN ('manual', 'automatic')),
  reason text NOT NULL DEFAULT '',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pump_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pump_activity" ON pump_activity;
CREATE POLICY "anon_select_pump_activity" ON pump_activity FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_pump_activity" ON pump_activity;
CREATE POLICY "anon_insert_pump_activity" ON pump_activity FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_pump_activity" ON pump_activity;
CREATE POLICY "anon_update_pump_activity" ON pump_activity FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_pump_activity" ON pump_activity;
CREATE POLICY "anon_delete_pump_activity" ON pump_activity FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_pump_activity_occurred_at ON pump_activity (occurred_at DESC);

-- ============================================================================
-- 6. ALERTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('critical', 'warning', 'info')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  message text NOT NULL,
  plant_name text DEFAULT '',
  value text DEFAULT '',
  triggered_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_alerts" ON alerts;
CREATE POLICY "anon_select_alerts" ON alerts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alerts" ON alerts;
CREATE POLICY "anon_insert_alerts" ON alerts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alerts" ON alerts;
CREATE POLICY "anon_update_alerts" ON alerts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alerts" ON alerts;
CREATE POLICY "anon_delete_alerts" ON alerts FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts (triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);

-- ============================================================================
-- 7. GARDEN_SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS garden_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_name text NOT NULL DEFAULT 'Smart Garden',
  moisture_threshold integer NOT NULL DEFAULT 35,
  temperature_warning integer NOT NULL DEFAULT 30,
  water_tank_warning integer NOT NULL DEFAULT 30,
  notifications_enabled boolean NOT NULL DEFAULT true,
  email_alerts boolean NOT NULL DEFAULT true,
  push_alerts boolean NOT NULL DEFAULT false,
  system_status text NOT NULL DEFAULT 'online' CHECK (system_status IN ('online', 'offline', 'maintenance')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE garden_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_garden_settings" ON garden_settings;
CREATE POLICY "anon_select_garden_settings" ON garden_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_garden_settings" ON garden_settings;
CREATE POLICY "anon_insert_garden_settings" ON garden_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_garden_settings" ON garden_settings;
CREATE POLICY "anon_update_garden_settings" ON garden_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_garden_settings" ON garden_settings;
CREATE POLICY "anon_delete_garden_settings" ON garden_settings FOR DELETE
  TO anon, authenticated USING (true);
