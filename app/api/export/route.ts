import { NextResponse } from 'next/server';
import { getDataset } from '@/lib/store';

export async function GET() {
  const dataset = getDataset();
  return NextResponse.json(dataset, {
    headers: {
      'Content-Disposition': 'attachment; filename="analisa-ia-dataset.json"'
    }
  });
}
