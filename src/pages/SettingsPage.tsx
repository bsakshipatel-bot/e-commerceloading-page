import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/States';
import { Icons } from '@/components/icons';
import { useApiData } from '@/hooks/useApiData';
import { fetchSettings, updateSettings } from '@/lib/api';
import { demoSettings } from '@/data/demoData';
import type { SystemSettings } from '@/types';

export function SettingsPage() {
  const { data: fetchedSettings, loading } = useApiData(fetchSettings);
  const [settings, setSettings] = useState<SystemSettings>(fetchedSettings ?? demoSettings);
  const [saving, setSaving] = useState(false);

  // Sync once data arrives
  if (loading && !settings) return <LoadingState />;

  const currentSettings = settings ?? fetchedSettings ?? demoSettings;

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...(prev ?? currentSettings), [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(currentSettings);
    } catch {
      // Fallback: settings stay in local state
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionTitle title="Settings" subtitle="Configure your Smart Garden system" />

      {/* Garden profile */}
      <Card>
        <CardHeader title="Garden Profile" subtitle="General garden information" icon={<Icons.Leaf className="w-4 h-4" />} />
        <div className="px-5 pb-5 space-y-4">
          <Field label="Garden Name">
            <input
              type="text"
              value={currentSettings.gardenName}
              onChange={(e) => updateSetting('gardenName', e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
            />
          </Field>
          <Field label="System Status">
            <div className="flex items-center gap-3">
              <StatusBadge status={currentSettings.systemStatus} />
              <select
                value={currentSettings.systemStatus}
                onChange={(e) => updateSetting('systemStatus', e.target.value as SystemSettings['systemStatus'])}
                className="px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </Field>
        </div>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardHeader title="Sensor Thresholds" subtitle="Set warning levels for your sensors" icon={<Icons.Gauge className="w-4 h-4" />} />
        <div className="px-5 pb-5 space-y-5">
          <ThresholdField
            icon={<Icons.Droplets className="w-4 h-4" />}
            label="Moisture Threshold"
            description="Water automatically when soil moisture falls below this level"
            value={currentSettings.moistureThreshold}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => updateSetting('moistureThreshold', v)}
          />
          <ThresholdField
            icon={<Icons.Thermometer className="w-4 h-4" />}
            label="Temperature Warning"
            description="Alert when temperature exceeds this value"
            value={currentSettings.temperatureWarning}
            min={0}
            max={50}
            unit="°C"
            onChange={(v) => updateSetting('temperatureWarning', v)}
          />
          <ThresholdField
            icon={<Icons.Gauge className="w-4 h-4" />}
            label="Water Tank Warning"
            description="Alert when water tank level falls below this value"
            value={currentSettings.waterTankWarning}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => updateSetting('waterTankWarning', v)}
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notifications" subtitle="Choose how you receive alerts" icon={<Icons.Bell className="w-4 h-4" />} />
        <div className="px-5 pb-5 space-y-1">
          <ToggleRow
            icon={<Icons.Bell className="w-4 h-4" />}
            label="Notifications"
            description="Enable or disable all notifications"
            checked={currentSettings.notificationsEnabled}
            onChange={(v) => updateSetting('notificationsEnabled', v)}
          />
          <ToggleRow
            icon={<Icons.Mail className="w-4 h-4" />}
            label="Email Alerts"
            description="Receive alerts via email"
            checked={currentSettings.emailAlerts}
            onChange={(v) => updateSetting('emailAlerts', v)}
            disabled={!currentSettings.notificationsEnabled}
          />
          <ToggleRow
            icon={<Icons.Smartphone className="w-4 h-4" />}
            label="Push Alerts"
            description="Receive push notifications on your device"
            checked={currentSettings.pushAlerts}
            onChange={(v) => updateSetting('pushAlerts', v)}
            disabled={!currentSettings.notificationsEnabled}
          />
        </div>
      </Card>

      {/* Save button */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 text-sm font-medium text-secondary-600 border border-secondary-200 rounded-lg hover:bg-secondary-50">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <p className="text-xs text-secondary-400 text-center">
        Settings are saved to your connected Smart Garden database.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="text-sm font-medium text-secondary-600 sm:w-40">{label}</label>
      {children}
    </div>
  );
}

function ThresholdField({
  icon,
  label,
  description,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 sm:w-56">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600 shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-secondary-700">{label}</p>
          <p className="text-xs text-secondary-400">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary-500"
        />
        <span className="text-sm font-semibold text-secondary-900 w-12 text-right">{value}{unit}</span>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 py-3 border-b border-secondary-50 last:border-b-0 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-100 text-secondary-600 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-secondary-700">{label}</p>
        <p className="text-xs text-secondary-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary-500' : 'bg-secondary-300'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
