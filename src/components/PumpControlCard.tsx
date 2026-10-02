import { useState } from 'react';
import { Icons } from '@/components/icons';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface PumpControlCardProps {
  isOn: boolean;
  mode: 'manual' | 'automatic';
  threshold: number;
  onTogglePump?: () => void;
  onToggleMode?: () => void;
}

export function PumpControlCard({
  isOn,
  mode,
  threshold,
  onTogglePump,
  onToggleMode,
}: PumpControlCardProps) {
  const [localIsOn, setLocalIsOn] = useState(isOn);
  const [localMode, setLocalMode] = useState(mode);

  const handleTogglePump = () => {
    setLocalIsOn(!localIsOn);
    onTogglePump?.();
  };

  const handleToggleMode = () => {
    setLocalMode(localMode === 'manual' ? 'automatic' : 'manual');
    onToggleMode?.();
  };

  return (
    <div className="bg-white rounded-xl border border-secondary-200/60 shadow-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              localIsOn ? 'bg-accent-50 text-accent-600' : 'bg-secondary-100 text-secondary-400'
            }`}
          >
            <Icons.Power className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-secondary-900">Water Pump Control</h3>
            <p className="text-xs text-secondary-500">Manual and automatic irrigation</p>
          </div>
        </div>
        <StatusBadge status={localIsOn ? 'online' : 'offline'} label={localIsOn ? 'Running' : 'Stopped'} size="sm" />
      </div>

      {/* Mode toggle */}
      <div className="bg-secondary-50 rounded-lg p-1 flex gap-1 mb-4">
        <button
          onClick={() => localMode !== 'manual' && handleToggleMode()}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            localMode === 'manual' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => localMode !== 'automatic' && handleToggleMode()}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            localMode === 'automatic' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'
          }`}
        >
          Automatic
        </button>
      </div>

      {/* Threshold info */}
      {localMode === 'automatic' && (
        <div className="flex items-center gap-2 bg-accent-50 rounded-lg px-3 py-2.5 mb-4">
          <Icons.Droplets className="w-4 h-4 text-accent-600 shrink-0" />
          <p className="text-xs text-accent-700">
            Waters automatically when soil moisture falls below{' '}
            <span className="font-semibold">{threshold}%</span>
          </p>
        </div>
      )}

      {/* Manual control */}
      <div className="flex items-center justify-between bg-secondary-50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${localIsOn ? 'bg-success-500 animate-pulse' : 'bg-secondary-400'}`}
          />
          <span className="text-sm font-medium text-secondary-700">
            Pump is {localIsOn ? 'ON' : 'OFF'}
          </span>
        </div>
        <button
          onClick={handleTogglePump}
          disabled={localMode === 'automatic'}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            localIsOn ? 'bg-primary-500' : 'bg-secondary-300'
          } ${localMode === 'automatic' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              localIsOn ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {localMode === 'automatic' && (
        <p className="text-xs text-secondary-400 mt-2 text-center">
          Switch to Manual mode to control the pump directly
        </p>
      )}
    </div>
  );
}
