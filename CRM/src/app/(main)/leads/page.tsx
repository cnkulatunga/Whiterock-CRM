'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { INITIAL_LEADS as DUMMY_LEADS } from '@/data/dummy';
import { usePermissions } from '@/hooks/usePermissions';

const INDUSTRIES = [
  'Software', 'Hardware', 'IT Services', 'Telecommunications', 'E-commerce', 'Digital Media',
  'Robotics', 'Pharmaceuticals', 'Medical Devices', 'Hospitals', 'Health Insurance',
  'BioTechnology', 'Wellness', 'Banking', 'Insurance', 'Investment Banking',
  'Venture Capital', 'Accounting', 'Aerospace',
];
const BANKS = [
  'Santander', 'HSBC', 'Lloyds Bank', 'Starling', 'NatWest', 'Barclays', 'Metro Bank',
  'Royal Bank of Scotland', 'The Co-operative Bank', 'The Cumberland', 'Tide', 'TSB',
  'Ulster Bank', 'Unity Trust Bank', 'Zempler',
];
const SOURCES = [
  'Advertisement', 'Cold Call', 'Web', 'External Referral', 'Instagram', 'Organic Search',
  'Sales Email Alias', 'Employee Referral', 'Online Store', 'Partner', 'Public Relations',
  'Seminar Partner', 'Internal Seminar', 'Trade Show', 'Chat',
];

type Lead = {
  id: string; name: string; company: string; status: string; type: string;
  amount: string; quality: 'hot' | 'warm' | 'cool'; phone: string; email: string;
  [key: string]: any;
};

const qualityBadge = (q: string) => {
  if (q === 'hot') return 'bg-red-50 text-red-700';
  if (q === 'warm') return 'bg-amber-50 text-amber-700';
  return 'bg-blue-50 text-blue-700';
};

export default function LeadsPage() {
  const router = useRouter();
  const { hasAction, isLoading } = usePermissions();
  const [leadList, setLeadList] = useState<Lead[]>(DUMMY_LEADS);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showColMenu, setShowColMenu] = useState(false);
  const [visibleCols, setVisibleCols] = useState({ company: true, need: true, status: true, last_note: true });

  const toggleCol = (col: keyof typeof visibleCols) =>
    setVisibleCols(p => ({ ...p, [col]: !p[col] }));

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.results ?? []);
      if (list.length > 0) setLeadList(list);
      else setLeadList(DUMMY_LEADS);
    } catch {
      setLeadList(DUMMY_LEADS);
    } finally {
      setDataLoading(false);
    }
  };
  if (isLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

  const filtered = leadList.filter(l => {
    const q = (search || '').toLowerCase();
    const matchSearch =
      (l.name || '').toLowerCase().includes(q) ||
      (l.company || '').toLowerCase().includes(q) ||
      (l.id || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || (l.quality || '').toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leadList.length,
    hot: leadList.filter(l => l.quality === 'hot').length,
    warm: leadList.filter(l => l.quality === 'warm').length,
  };

  return (
    <div className="flex flex-1 overflow-hidden flex-col" style={{ height: '100%' }}>

      {/* Dark header */}
      <header className="bg-[#0f172a] px-4 flex items-center gap-3 shrink-0" style={{ minHeight: 48 }}>
        <div className="shrink-0">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-white leading-none">Lead Database</h2>
          <span className="text-[10px] font-bold text-gray-500 font-mono">{filtered.length} records</span>
        </div>

        <div className="relative flex-1 min-w-0">
          <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: 'rgba(255,255,255,.3)' }}></i>
          <input
            type="text" placeholder="Search leads..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-7.5 pl-7 pr-3 text-xs font-semibold text-white outline-none rounded-lg"
            style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)' }}
          />
        </div>

        {hasAction('leads', 'add') && (
          <Link href="/leads/add" className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shrink-0">
            <i className="fa-solid fa-plus text-[10px]"></i> Add Lead
          </Link>
        )}

        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-7.5 px-2 text-xs font-bold text-gray-300 outline-none cursor-pointer rounded-lg shrink-0"
          style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', appearance: 'none' }}
        >
          <option value="All" className="bg-[#1e293b]">All Status</option>
          <option value="hot" className="bg-[#1e293b]">Hot</option>
          <option value="warm" className="bg-[#1e293b]">Warm</option>
          <option value="cool" className="bg-[#1e293b]">Cool</option>
        </select>

        <div className="flex items-center gap-0 shrink-0 border-l border-white/10 pl-3">
          <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-white/10">
            <span className="text-[13px] font-black text-white font-mono">{stats.total}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-white/10">
            <span className="text-[13px] font-black text-red-100 font-mono">{stats.hot}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hot</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-white/10">
            <span className="text-[13px] font-black text-amber-100 font-mono">{stats.warm}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Warm</span>
          </div>

          {/* Column hider */}
          <div className="relative px-2.5 py-2">
            <button
              onClick={() => setShowColMenu(v => !v)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
              style={{ border: '1px solid rgba(255,255,255,.1)' }}
            >
              <i className="fa-solid fa-eye text-[9px]"></i> Columns
            </button>
            {showColMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-2xl"
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,.1)', minWidth: 160 }}
              >
                <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toggle Columns</p>
                </div>
                {([
                  { key: 'company', label: 'Company' },
                  { key: 'need', label: 'Need' },
                  { key: 'status', label: 'Status' },
                  { key: 'last_note', label: 'Last Note' },
                ] as { key: keyof typeof visibleCols; label: string }[]).map(col => (
                  <button
                    key={col.key}
                    onClick={() => toggleCol(col.key)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-all hover:bg-white/5"
                    style={{ color: visibleCols[col.key] ? '#fff' : '#475569' }}
                  >
                    <span>{col.label}</span>
                    <i className={`fa-solid ${visibleCols[col.key] ? 'fa-eye text-indigo-400' : 'fa-eye-slash text-gray-600'} text-[9px]`}></i>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-50 border-b border-gray-100 z-10">
            <tr>
              <th className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lead</th>
              {visibleCols.company && <th className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</th>}
              {visibleCols.need && <th className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Need</th>}
              {visibleCols.status && <th className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>}
              {visibleCols.last_note && <th className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Note</th>}
              <th className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dataLoading && Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-28 bg-slate-100 rounded" />
                      <div className="h-2 w-16 bg-slate-50 rounded" />
                    </div>
                  </div>
                </td>
                {visibleCols.company && <td className="px-3 py-2.5"><div className="h-2.5 w-24 bg-slate-100 rounded" /></td>}
                {visibleCols.need && <td className="px-3 py-2.5"><div className="h-5 w-12 bg-slate-100 rounded-full" /></td>}
                {visibleCols.status && <td className="px-3 py-2.5"><div className="h-2.5 w-16 bg-slate-100 rounded" /></td>}
                {visibleCols.last_note && <td className="px-3 py-2.5"><div className="h-2.5 w-32 bg-slate-100 rounded" /></td>}
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-6 w-14 bg-slate-100 rounded-lg" />
                    <div className="h-6 w-14 bg-slate-100 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
            {!dataLoading && filtered.map(lead => (
              <tr key={lead.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-800 leading-none">{lead.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{lead.id}</p>
                    </div>
                  </div>
                </td>
                {visibleCols.company && <td className="px-3 py-2 text-[10px] text-slate-600 font-medium">{lead.company}</td>}
                {visibleCols.need && (
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${qualityBadge(lead.quality)}`}>
                      {lead.quality}
                    </span>
                  </td>
                )}
                {visibleCols.status && <td className="px-3 py-2 text-xs text-slate-500 font-medium">{lead.status}</td>}
                {visibleCols.last_note && (
                  <td className="px-3 py-2 max-w-50">
                    {lead.last_note ? (
                      <span className="text-[10px] text-slate-500 font-medium truncate block" title={lead.last_note}>
                        {lead.last_note.length > 60 ? lead.last_note.slice(0, 60) + '…' : lead.last_note}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">—</span>
                    )}
                  </td>
                )}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                      style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', textDecoration: 'none' }}
                    >
                      <i className="fa-solid fa-eye text-xs"></i> View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!dataLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
              <i className="fa-solid fa-user-slash text-2xl"></i>
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">No leads found</h3>
            <p className="text-xs font-bold text-slate-300 mt-1">
              {search || statusFilter !== 'All' ? 'Adjust your search or filters' : 'Add a lead to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filtered.length} leads</span>
        {hasAction('leads', 'add') && (
          <Link href="/leads/add" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all">
            <i className="fa-solid fa-plus mr-1"></i>New Lead
          </Link>
        )}
      </div>
    </div>
  );
}
