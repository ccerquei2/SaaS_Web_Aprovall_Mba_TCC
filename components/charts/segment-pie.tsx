'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const segmentColors: Record<string, string> = {
  S1: '#4338CA',
  S2: '#0ea5e9',
  S3: '#f59e0b',
  S4: '#14b8a6'
};

export function SegmentPie({ data }: { data: { segment: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="segment" innerRadius={60} outerRadius={90} paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.segment} fill={segmentColors[entry.segment] ?? '#64748b'} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}`, `Segmento ${name}`]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        {data.map((entry) => (
          <span key={entry.segment} className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segmentColors[entry.segment] }} />
            Segmento {entry.segment}
          </span>
        ))}
      </div>
    </div>
  );
}
