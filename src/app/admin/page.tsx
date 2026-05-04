'use client';

import { useEffect, useState, useCallback } from 'react';
import { Download, RefreshCw, Users, Zap, Camera, FileText, type LucideIcon } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  district: string;
  preferredModel: string;
  preferredDealer: string | null;
  purchaseTimeline: string | null;
  consent: boolean;
  submittedAt: string;
}

interface AnalyticsData {
  total: number;
  counts: Record<string, number>;
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold">{label}</p>
        <p className="text-white text-2xl font-black mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function exportCSV(leads: Lead[]) {
  const headers = ['Name', 'Phone', 'District', 'Preferred Model', 'Preferred Dealer', 'Purchase Timeline', 'Submitted At'];
  const rows = leads.map((l) => [
    l.name,
    l.phone,
    l.district,
    l.preferredModel,
    l.preferredDealer ?? '',
    l.purchaseTimeline ?? '',
    new Date(l.submittedAt).toLocaleString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yamaha_leads_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ total: 0, counts: {} });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/analytics'),
      ]);
      setLeads(await leadsRes.json());
      setAnalytics(await analyticsRes.json());
    } catch {
      // fail silently, keep previous state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[#005BAC] text-xs font-bold tracking-[0.4em] uppercase">Yamaha</p>
          <h1 className="text-3xl font-black tracking-tight mt-1">Campaign Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">Eid Offer 2025 — Lead & Analytics Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV(leads)}
            disabled={leads.length === 0}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-30"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-[#005BAC] hover:bg-[#0070d6] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Leads" value={leads.length} icon={Users} color="bg-[#005BAC]" />
        <StatCard label="AR Sessions" value={analytics.counts['ar_start'] ?? 0} icon={Camera} color="bg-purple-600" />
        <StatCard label="Price Reveals" value={analytics.counts['price_reveal'] ?? 0} icon={Zap} color="bg-amber-600" />
        <StatCard label="Showroom Loads" value={analytics.counts['showroom_load'] ?? 0} icon={FileText} color="bg-emerald-600" />
      </div>

      {/* Analytics breakdown */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-5">Event Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'showroom_load', 'category_click', 'model_click', 'ar_start',
            'price_reveal', 'form_open', 'form_submit', 'form_abandon',
          ].map((key) => (
            <div key={key} className="bg-white/5 rounded-xl p-4">
              <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">{key.replace(/_/g, ' ')}</p>
              <p className="text-white text-xl font-black mt-1">{analytics.counts[key] ?? 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leads table */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
            Leads <span className="text-white ml-2">{leads.length}</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-[#005BAC]" />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-neutral-600 text-sm">No leads yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name', 'Phone', 'District', 'Model', 'Timeline', 'Submitted'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-neutral-500 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...leads].reverse().map((lead, i) => (
                  <tr key={lead.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? 'bg-[#005BAC]/5' : ''}`}>
                    <td className="px-6 py-4 text-white font-medium whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">{lead.district}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-[#005BAC]/20 text-[#005BAC] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#005BAC]/30">
                        {lead.preferredModel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">{lead.purchaseTimeline ?? '—'}</td>
                    <td className="px-6 py-4 text-neutral-600 text-xs whitespace-nowrap">
                      {new Date(lead.submittedAt).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-neutral-700 text-xs text-center mt-8">
        Yamaha Bangladesh — Eid Offer AR Campaign 2025 · Internal Use Only
      </p>
    </div>
  );
}
