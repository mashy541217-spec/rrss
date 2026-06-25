import { create } from 'zustand';

export interface WorkerTelemetry {
  id: string;
  plugin: string;
  cpu: number;
  ram: number;
  status: 'idle' | 'busy' | 'offline';
  uptime: number;
}

export interface TelemetryState {
  workers: WorkerTelemetry[];
  queues: {
    execution: number;
    retry: number;
    deadLetter: number;
  };
  systemHealth: {
    redis: 'healthy' | 'degraded' | 'offline';
    database: 'healthy' | 'degraded' | 'offline';
    storage: 'healthy' | 'degraded' | 'offline';
  };
  throughputData: { time: string; success: number; failure: number }[];
  
  updateTelemetry: (data: Partial<TelemetryState>) => void;
  addThroughputDataPoint: (point: { time: string; success: number; failure: number }) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  workers: [],
  queues: { execution: 0, retry: 0, deadLetter: 0 },
  systemHealth: { redis: 'healthy', database: 'healthy', storage: 'healthy' },
  throughputData: [],

  updateTelemetry: (data) => set((state) => ({ ...state, ...data })),
  
  addThroughputDataPoint: (point) => set((state) => {
    const newPoints = [...state.throughputData, point];
    if (newPoints.length > 20) newPoints.shift(); // Keep last 20 points
    return { throughputData: newPoints };
  })
}));
