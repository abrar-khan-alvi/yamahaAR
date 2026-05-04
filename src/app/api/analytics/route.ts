import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ANALYTICS_FILE)) fs.writeFileSync(ANALYTICS_FILE, '[]', 'utf-8');
}

function readEvents(): unknown[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    ensureFile();
    const events = readEvents();
    events.push({ id: crypto.randomUUID(), ...body });
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = readEvents() as Array<{ event: string }>;
    const counts: Record<string, number> = {};
    for (const e of events) {
      counts[e.event] = (counts[e.event] || 0) + 1;
    }
    return NextResponse.json({ total: events.length, counts, recent: events.slice(-100) });
  } catch {
    return NextResponse.json({ total: 0, counts: {}, recent: [] });
  }
}
