import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// NOTE: Uses local file system for MVP. Replace with a DB before scaling to production.
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, '[]', 'utf-8');
}

function readLeads(): unknown[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLeads(leads: unknown[]) {
  ensureFile();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, district, preferredModel, preferredDealer, purchaseTimeline, consent } =
      body;

    if (!name || !phone || !district || !preferredModel || !consent) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const lead = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      district: String(district).trim(),
      preferredModel: String(preferredModel).trim(),
      preferredDealer: preferredDealer ? String(preferredDealer).trim() : null,
      purchaseTimeline: purchaseTimeline ? String(purchaseTimeline).trim() : null,
      consent: Boolean(consent),
      submittedAt: new Date().toISOString(),
    };

    const leads = readLeads();
    leads.push(lead);
    writeLeads(leads);

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = readLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
