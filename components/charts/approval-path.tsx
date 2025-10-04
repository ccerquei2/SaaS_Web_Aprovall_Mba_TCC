'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const palette = {
  baseline: '#94a3b8',
  simulated: '#2563eb'
};

export interface ApprovalPathPoint {
  stage: string;
  baseline: number;
  simulated: number;
}

export function ApprovalPathChart({ data }: { data: ApprovalPathPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
          <XAxis dataKey="stage" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <Tooltip
            formatter={(value: number, key: string) => [
              `${value} ordens`,
              key === 'baseline' ? 'Hoje (dados sintéticos)' : 'Cenário IA (simulado)'
            ]}
          />
          <Legend
            formatter={(value: string) =>
              value === 'baseline' ? 'Hoje (dados sintéticos)' : 'Cenário IA (simulado)'
            }
          />
          <Bar dataKey="baseline" name="Hoje (dados sintéticos)" fill={palette.baseline} radius={[6, 6, 0, 0]} maxBarSize={56} />
          <Bar dataKey="simulated" name="Cenário IA (simulado)" fill={palette.simulated} radius={[6, 6, 0, 0]} maxBarSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
