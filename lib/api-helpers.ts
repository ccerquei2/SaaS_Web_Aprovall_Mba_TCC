import { NextResponse } from 'next/server';

function randomDelay() {
  const min = 300;
  const max = 700;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function respondWithLatency<T>(payload: T) {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  if (Math.random() < 0.05) {
    return NextResponse.json({ error: 'Falha temporária simulada. Tente novamente.' }, { status: 500 });
  }
  return NextResponse.json(payload);
}
