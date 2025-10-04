'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

export interface TrendPoint {
  date: string;
  approvals: number;
  reprovals: number;
  pending: number;
}

export function KpiTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4338CA" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4338CA" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorReproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e11d48" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#e11d48" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Area type="monotone" dataKey="approvals" stroke="#4338CA" fill="url(#colorApproved)" name="Aprovações" />
          <Area type="monotone" dataKey="reprovals" stroke="#e11d48" fill="url(#colorReproved)" name="Reprovações" />
          <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="#f59e0b20" name="Pendentes" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
