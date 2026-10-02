import type { SensorReading } from '@/types';

export function formatTimeAgo(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getCurrentDateTime(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDailyStats(data: SensorReading[]) {
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = (arr: number[]) => Math.min(...arr);
  const max = (arr: number[]) => Math.max(...arr);

  return {
    soilMoisture: {
      avg: Math.round(avg(data.map((d) => d.soilMoisture)) * 10) / 10,
      min: min(data.map((d) => d.soilMoisture)),
      max: max(data.map((d) => d.soilMoisture)),
    },
    temperature: {
      avg: Math.round(avg(data.map((d) => d.temperature)) * 10) / 10,
      min: min(data.map((d) => d.temperature)),
      max: max(data.map((d) => d.temperature)),
    },
    humidity: {
      avg: Math.round(avg(data.map((d) => d.humidity)) * 10) / 10,
      min: min(data.map((d) => d.humidity)),
      max: max(data.map((d) => d.humidity)),
    },
    lightIntensity: {
      avg: Math.round(avg(data.map((d) => d.lightIntensity))),
      min: min(data.map((d) => d.lightIntensity)),
      max: max(data.map((d) => d.lightIntensity)),
    },
    waterTank: {
      avg: Math.round(avg(data.map((d) => d.waterTank))),
      min: min(data.map((d) => d.waterTank)),
      max: max(data.map((d) => d.waterTank)),
    },
  };
}
