'use client';

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ApprovalMixDatum {
  label: string;
  value: number;
  color: string;
}

export function ApprovalMixChart({ data }: { data: ApprovalMixDatum[] }) {
  const maxValue = data.reduce((acc, item) => Math.max(acc, item.value), 0);
  const domainMax = maxValue === 0 ? 10 : Math.ceil(maxValue * 1.2);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} domain={[0, domainMax]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => [`${value} ordens`, 'Volume']} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
            <LabelList dataKey="value" position="top" className="fill-slate-600 text-xs" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
