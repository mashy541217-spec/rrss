import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const ExecutionThroughputChart: React.FC = () => {
  const { throughputData } = useTelemetryStore();

  return (
    <div className="glass-card widget-col-span-2">
      <h3 className="widget-title"><Activity size={18} /> Execution Throughput</h3>
      <div className="chart-container" style={{ height: 250, width: '100%', marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={throughputData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--status-success)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--status-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFailure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--status-error)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--status-error)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
            <Area type="monotone" dataKey="success" stroke="var(--status-success)" fillOpacity={1} fill="url(#colorSuccess)" />
            <Area type="monotone" dataKey="failure" stroke="var(--status-error)" fillOpacity={1} fill="url(#colorFailure)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExecutionThroughputChart;
