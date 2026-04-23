'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_LEADS as DUMMY_LEADS, followups } from '@/data/dummy';

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

const inputCls = (disabled: boolean) =>
  `w-full bg-[#fdfdfd] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[10px] font-semibold text-[#1e293b] outline-none transition-all ${disabled
    ? 'bg-[#f8fafc] border-[#f1f5f9] text-[#64748b] cursor-not-allowed'
    : 'focus:border-[#2447d7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(36,71,215,0.05)]'
  }`;

const labelCls = 'text-[9px] font-bold text-[#475569] mb-1 block';

import { usePermissions } from '@/hooks/usePermissions';

export default function LeadsPage() {
  const { hasAction, hasFeature, isLoading } = usePermissions();
  const [leadList, setLeadList] = useState<Lead[]>(DUMMY_LEADS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [panelNotes, setPanelNotes] = useState<{ id: number; text: string; date: string }[]>([
    { id: 1, text: 'Client interested in expansion loan. Needs follow-up by end of week.', date: '2026-04-10 | 10:30 AM' },
  ]);
  const [noteInput, setNoteInput] = useState('');
  const [panelTasks] = useState(followups.slice(0, 3));
  const [aiGenerated, setAiGenerated] = useState(false);

  React.useEffect(() => {
    // loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLeadList(data);
        if (!selectedId) setSelectedId(data[0].id);
      } else {
        setLeadList(DUMMY_LEADS);
        if (!selectedId && DUMMY_LEADS.length > 0) setSelectedId(DUMMY_LEADS[0].id);
      }
    } catch (err) {
      console.error('API Error: Failed to fetch leads', err);
      setLeadList(DUMMY_LEADS);
      if (!selectedId && DUMMY_LEADS.length > 0) setSelectedId(DUMMY_LEADS[0].id);
    }
  };

  if (isLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

  const selectedLead = leadList.find(l => l.id === selectedId) || null;

  const filtered = leadList.filter(l => {
    const q = (search || '').toLowerCase();
    const matchSearch = (l.name || '').toLowerCase().includes(q) || (l.company || '').toLowerCase().includes(q) || (l.id || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || (l.quality || '').toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leadList.length,
    hot: leadList.filter(l => l.quality === 'hot').length,
    warm: leadList.filter(l => l.quality === 'warm').length,
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectLead = (lead: Lead) => {
    setSelectedId(lead.id);
    setIsEditing(false);
    setFormData({ ...lead });
    setActiveTab('details');
    setAiGenerated(false);
  };

  const startEdit = () => { if (selectedLead) setFormData({ ...selectedLead }); setIsEditing(true); };

  const saveChanges = async () => {
    if (!formData.id) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        loadLeads();
        setIsEditing(false);
      }
    } catch (err) {
      alert('Save operation failed');
    }
  };

  const deleteLead = async () => {
    if (!selectedId || !confirm('Delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${selectedId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeadList(prev => prev.filter(l => l.id !== selectedId));
        setSelectedId(null);
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const fd = (key: string) => formData[key] ?? selectedLead?.[key] ?? '';
  const setFd = (key: string, val: string) => setFormData((p: any) => ({ ...p, [key]: val }));

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: '100%' }}>

      {/* ── LEFT: Lead Database ── */}
      <section className="flex-1 flex flex-col overflow-hidden bg-white border-r border-slate-100">
        {/* Dark header */}
        <header className="bg-[#0f172a] px-4 flex items-center gap-3 shrink-0" style={{ minHeight: 48 }}>
          <div className="shrink-0">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-white leading-none">Lead Database</h2>
            <span className="text-[8px] font-bold text-gray-500 font-mono">{filtered.length} records</span>
          </div>

          <div className="relative flex-1 min-w-0">
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: 'rgba(255,255,255,.3)' }}></i>
            <input
              type="text" placeholder="Search leads..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-[30px] pl-7 pr-3 text-[9px] font-semibold text-white outline-none rounded-lg"
              style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)' }}
            />
          </div>

          {hasAction('leads', 'Add_Lead') && (
            <Link href="/leads/add" className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shrink-0">
              <i className="fa-solid fa-plus text-[7px]"></i> Add Lead
            </Link>
          )}

          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-[30px] px-2 text-[9px] font-bold text-gray-300 outline-none cursor-pointer rounded-lg shrink-0"
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
              <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-2 border-r border-white/10">
              <span className="text-[13px] font-black text-red-100 font-mono">{stats.hot}</span>
              <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Hot</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-2">
              <span className="text-[13px] font-black text-amber-100 font-mono">{stats.warm}</span>
              <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Warm</span>
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <style>{`@keyframes expandDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 border-b border-gray-100 z-10">
              <tr>
                <th className="px-3 py-1.5 text-[8px] font-bold text-gray-400 uppercase tracking-widest">Lead</th>
                <th className="px-3 py-1.5 text-[8px] font-bold text-gray-400 uppercase tracking-widest">Company</th>
                <th className="px-3 py-1.5 text-[8px] font-bold text-gray-400 uppercase tracking-widest">Need</th>
                <th className="px-3 py-1.5 text-[8px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-2 py-1.5 w-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(lead => {
                const expanded = expandedRows.includes(lead.id);
                const selected = selectedId === lead.id;
                return (
                  <React.Fragment key={lead.id}>
                    <tr
                      onClick={() => selectLead(lead)}
                      className={`cursor-pointer transition-colors ${selected ? 'bg-slate-50' : 'hover:bg-[#f8fafc]'}`}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600 shrink-0">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-800 leading-none">{lead.name}</p>
                            <p className="text-[8px] text-slate-400 font-mono mt-0.5">{lead.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[10px] text-slate-600 font-medium">{lead.company}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${qualityBadge(lead.quality)}`}>
                          {lead.quality}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[9px] text-slate-500 font-medium">{lead.status}</td>
                      <td className="px-2 py-2">
                        <button
                          onClick={e => toggleRow(lead.id, e)}
                          className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-600 transition-all"
                        >
                          <i className={`fa-solid fa-chevron-right text-[8px] transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}></i>
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="bg-slate-50 border-t border-b-2 border-slate-200 px-4 py-3" style={{ animation: 'expandDown .18s ease' }}>
                            <div className="grid grid-cols-4 gap-3">
                              {[
                                { label: 'Phone', value: lead.phone },
                                { label: 'Email', value: lead.email },
                                { label: 'Amount', value: lead.amount },
                                { label: 'Type', value: lead.type },
                              ].map(p => (
                                <div key={p.label}>
                                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{p.label}</p>
                                  <p className="text-[10px] font-semibold text-slate-700 truncate">{p.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <i className="fa-solid fa-users text-3xl text-gray-200 mb-3"></i>
              <p className="text-[10px] font-bold text-gray-400">No leads match your filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Showing {filtered.length} leads</span>
          {hasAction('leads', 'Add_Lead') && (
            <Link href="/leads/add" className="text-[8px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all">
              <i className="fa-solid fa-plus mr-1"></i>New Lead
            </Link>
          )}
        </div>
      </section>

      {/* ── RIGHT: Detail Panel ── */}
      <div className="w-[480px] flex flex-col bg-white shrink-0">
        {/* Panel header */}
        <div className="px-3 py-2 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            {selectedLead ? (
              <>
                <h2 className="text-[12px] font-black text-gray-900 leading-none">{selectedLead.name}</h2>
                <p className="text-[9px] text-[#2447d7] font-extrabold mt-0.5 tracking-wider">{selectedLead.id}</p>
              </>
            ) : (
              <>
                <h2 className="text-[12px] font-black text-gray-900 leading-none">SELECT A LEAD</h2>
                <p className="text-[9px] text-[#2447d7] font-extrabold mt-0.5 tracking-wider">CHOOSE FROM THE LIST</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {selectedLead && (
              <div className="flex items-center gap-3 pr-3 border-r border-gray-100">
                <div className="flex items-center gap-1.5">
                  <label className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Status</label>
                  <select
                    value={fd('quality')} onChange={e => setFd('quality', e.target.value)} disabled={!isEditing}
                    className="w-16 h-6 px-1.5 text-[9px] font-bold border rounded bg-gray-50/50 outline-none"
                  >
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cool">Cool</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">ID</label>
                  <input type="text" value={selectedLead.id} disabled
                    className="w-20 h-6 px-1.5 text-[9px] font-mono font-bold border rounded bg-gray-50/50 outline-none text-blue-600" />
                </div>
              </div>
            )}
            {selectedLead && !isEditing && hasAction('leads', 'Edit_Lead') && (
              <button onClick={startEdit} className="h-7 px-3 bg-gray-900 text-white text-[8px] font-bold rounded-lg uppercase tracking-widest hover:bg-black transition-all">
                Edit Lead
              </button>
            )}
            {selectedLead && isEditing && (
              <button onClick={saveChanges} className="h-7 px-3 bg-amber-600 text-white text-[8px] font-bold rounded-lg uppercase tracking-widest hover:bg-amber-700 transition-all">
                Save Changes
              </button>
            )}
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          </div>
        </div>

        {/* Tab nav */}
        {selectedLead && (
          <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-gray-100 bg-white shrink-0 overflow-x-auto">
            {[
              { key: 'details', icon: 'fa-address-card', label: 'Contact Info' },
              { key: 'tasks', icon: 'fa-list-check', label: 'Follow-ups' },
              ...(hasFeature('ai_assistant') ? [{ key: 'ai', icon: 'fa-robot', label: 'AI Summary' }] : []),
              { key: 'notes', icon: 'fa-note-sticky', label: 'Notes' },
              { key: 'docs', icon: 'fa-folder-open', label: 'Documents' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[.06em] cursor-pointer transition-all whitespace-nowrap border-none ${activeTab === tab.key ? 'bg-[#ebf0ff] text-[#2447d7]' : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
              >
                <i className={`fa-solid ${tab.icon} text-[9px]`}></i> {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ background: '#fcfcfd' }}>
          {!selectedLead ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <i className="fa-solid fa-user-group text-4xl text-gray-200 mb-4"></i>
              <p className="text-[11px] font-bold text-gray-400">Select a lead to view details</p>
              <p className="text-[9px] text-gray-300 mt-1">Click any row in the table</p>
            </div>
          ) : activeTab === 'details' ? (
            <DetailTab fd={fd} setFd={setFd} isEditing={isEditing} onDelete={deleteLead} hasDeleteAccess={hasAction('leads', 'Delete_Lead')} />
          ) : activeTab === 'tasks' ? (
            <TasksTab tasks={panelTasks} />
          ) : activeTab === 'ai' ? (
            <AITab lead={selectedLead} generated={aiGenerated} onGenerate={() => setAiGenerated(true)} />
          ) : activeTab === 'notes' ? (
            <NotesTab
              notes={panelNotes} noteInput={noteInput} setNoteInput={setNoteInput}
              onAdd={() => {
                if (!noteInput.trim()) return;
                setPanelNotes(p => [...p, { id: Date.now(), text: noteInput, date: new Date().toLocaleString() }]);
                setNoteInput('');
              }}
            />
          ) : (
            <DocsTab />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-black text-[#1e293b] uppercase tracking-[.12em] mb-3 pb-2 border-b-2 border-[#f1f5f9]">
      <i className={`fa-solid ${icon} text-[9px]`}></i>{children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function DetailTab({ fd, setFd, isEditing, onDelete, hasDeleteAccess }: {
  fd: (k: string) => any; setFd: (k: string, v: string) => void;
  isEditing: boolean; onDelete: () => void; hasDeleteAccess?: boolean;
}) {
  return (
    <div className="p-4 space-y-5">
      <section>
        <SectionHeader icon="fa-address-card">Contact Information</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title">
            <input value={fd('title')} onChange={e => setFd('title', e.target.value)} disabled={!isEditing}
              placeholder="e.g. Mr, Mrs, Dr..." className={inputCls(!isEditing)} />
          </Field>
          <Field label="Full Name *">
            <input value={fd('name')} onChange={e => setFd('name', e.target.value)} disabled={!isEditing}
              placeholder="e.g. Jonathan Doe" className={inputCls(!isEditing)} />
          </Field>
          <Field label="Date of Birth">
            <input type="date" value={fd('dob')} onChange={e => setFd('dob', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)} />
          </Field>
          <Field label="Company Name *">
            <input value={fd('company')} onChange={e => setFd('company', e.target.value)} disabled={!isEditing}
              placeholder="Registered name..." className={inputCls(!isEditing)} />
          </Field>
          <Field label="Company House Number">
            <input value={fd('companyHouseNumber')} onChange={e => setFd('companyHouseNumber', e.target.value)} disabled={!isEditing}
              placeholder="e.g. 12345678" className={inputCls(!isEditing)} />
          </Field>
          <Field label="Annual Turnover">
            <input value={fd('businessAnnualTurnover')} onChange={e => setFd('businessAnnualTurnover', e.target.value)} disabled={!isEditing}
              placeholder="£0.00" className={inputCls(!isEditing)} />
          </Field>
          <Field label="Job Title">
            <input value={fd('jobTitle')} onChange={e => setFd('jobTitle', e.target.value)} disabled={!isEditing}
              placeholder="Managing Director" className={inputCls(!isEditing)} />
          </Field>
          <Field label="Industry">
            <select value={fd('industry')} onChange={e => setFd('industry', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)}>
              <option value="">Select industry...</option>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Email Address *">
            <input type="email" value={fd('email')} onChange={e => setFd('email', e.target.value)} disabled={!isEditing}
              placeholder="client@example.com" className={inputCls(!isEditing)} />
          </Field>
          <Field label="Phone Number *">
            <input type="tel" value={fd('phone')} onChange={e => setFd('phone', e.target.value)} disabled={!isEditing}
              placeholder="+44 77..." className={inputCls(!isEditing)} />
          </Field>
          <Field label="Preferred Method">
            <div className="flex gap-1.5">
              {['Email', 'Phone', 'WhatsApp', 'Other'].map(m => (
                <button key={m} type="button" disabled={!isEditing}
                  onClick={() => setFd('preferredMethod', m)}
                  className={`flex-1 py-1.5 rounded-lg text-[8px] font-bold border transition-all ${fd('preferredMethod') === m
                    ? 'border-[#2447d7] bg-[#ebf0ff] text-[#2447d7]'
                    : 'border-[#e2e8f0] bg-white text-[#64748b] hover:bg-slate-50'
                    } ${!isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >{m}</button>
              ))}
            </div>
          </Field>
          <Field label="Home Owner">
            <select value={fd('homeOwner') || 'Yes'} onChange={e => setFd('homeOwner', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)}>
              <option>Yes</option><option>No</option>
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Residential Address *">
              <input value={fd('residentialAddress')} onChange={e => setFd('residentialAddress', e.target.value)} disabled={!isEditing}
                placeholder="Full address..." className={inputCls(!isEditing)} />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader icon="fa-sack-dollar">Loan Details</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount Needed *">
            <input value={fd('amount')} onChange={e => setFd('amount', e.target.value)} disabled={!isEditing}
              placeholder="£0.00" className={inputCls(!isEditing)} />
          </Field>
          <Field label="Loan Purpose">
            <input value={fd('loanPurpose')} onChange={e => setFd('loanPurpose', e.target.value)} disabled={!isEditing}
              placeholder="Business expansion..." className={inputCls(!isEditing)} />
          </Field>
          <Field label="Existing Loan">
            <select value={fd('existingLoan') || 'No'} onChange={e => setFd('existingLoan', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)}>
              <option>No</option><option>Yes</option>
            </select>
          </Field>
          <Field label="Bank Institution">
            <select value={fd('companyBank') || ''} onChange={e => setFd('companyBank', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)}>
              <option value="">Select a bank...</option>
              {BANKS.map(b => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Lead Source">
            <select value={fd('leadSource') || ''} onChange={e => setFd('leadSource', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)}>
              <option value="">Select source...</option>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Credit Search Consent *">
            <select value={fd('creditConsent') || 'Yes'} onChange={e => setFd('creditConsent', e.target.value)} disabled={!isEditing}
              className={inputCls(!isEditing)}>
              <option>Yes</option><option>No</option>
            </select>
          </Field>
        </div>
      </section>

      {hasDeleteAccess && (
        <div className="pt-4 border-t border-gray-100">
          <button onClick={onDelete}
            className="w-full py-2.5 border border-red-100 text-red-400 text-[8px] font-bold uppercase tracking-widest rounded-lg hover:border-red-300 hover:text-red-600 transition-all">
            <i className="fa-solid fa-trash text-[7px] mr-1.5"></i>Delete Lead
          </button>
        </div>
      )}
    </div>
  );
}

function TasksTab({ tasks }: { tasks: any[] }) {
  const typeColor = (t: string) => {
    if (t?.includes('Call')) return 'bg-blue-50 text-blue-700';
    if (t?.includes('Meeting')) return 'bg-purple-50 text-purple-700';
    if (t?.includes('Email')) return 'bg-green-50 text-green-700';
    if (t?.includes('Document')) return 'bg-amber-50 text-amber-700';
    return 'bg-slate-50 text-slate-600';
  };
  return (
    <div className="p-4 space-y-2">
      {tasks.length === 0 && (
        <p className="text-[9px] text-gray-300 text-center py-8 italic">No tasks scheduled for this lead</p>
      )}
      {tasks.map(t => (
        <div key={t.id} className="p-3 border border-[#e2e8f0] bg-[#f8fafc] rounded-lg">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[10px] font-bold text-slate-800">{t.title}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[7px] font-bold uppercase shrink-0 ${typeColor(t.type)}`}>
              {t.type}
            </span>
          </div>
          <p className="text-[9px] text-slate-500 mb-2 leading-relaxed">{t.desc}</p>
          <div className="flex items-center gap-3 text-[8px] text-slate-400">
            <span><i className="fa-solid fa-calendar mr-1"></i>{t.date}</span>
            <span><i className="fa-solid fa-clock mr-1"></i>{t.time}</span>
            <span className={`ml-auto px-2 py-0.5 rounded-full font-bold uppercase text-[7px] ${t.priority === 'Hot' ? 'bg-red-50 text-red-600' : t.priority === 'Warm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>{t.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AITab({ lead, generated, onGenerate }: { lead: any; generated: boolean; onGenerate: () => void }) {
  const summary = `${lead.name} from ${lead.company} is a ${lead.quality.toUpperCase()} priority lead at the "${lead.status}" stage, seeking ${lead.amount} for ${lead.type || 'financing'}. Contact via ${lead.email} or ${lead.phone}. Recommend prioritising follow-up within 48 hours.`;
  return (
    <div className="p-4 space-y-3">
      <div style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1px solid #e0e7ff', borderRadius: 12, padding: 16 }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div style={{ width: 32, height: 32, background: '#4f46e5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 13, color: '#fff' }}></i>
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 11, fontWeight: 800, color: '#3730a3' }}>AI Lead Summary</p>
            <p style={{ fontSize: 8, color: '#6366f1', fontWeight: 600 }}>Powered by lead data</p>
          </div>
          <button onClick={onGenerate}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer' }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 8 }}></i> Generate
          </button>
        </div>
        {!generated ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 22, color: '#c7d2fe', marginBottom: 8, display: 'block' }}></i>
            <p style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 600 }}>Click Generate to create an AI summary for this lead</p>
          </div>
        ) : (
          <p style={{ fontSize: 11, color: '#1e1b4b', lineHeight: 1.8, fontStyle: 'italic' }}>{summary}</p>
        )}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-3">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Data Points</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Amount', value: lead.amount },
            { label: 'Status', value: lead.status },
            { label: 'Quality', value: lead.quality.toUpperCase() },
            { label: 'Type', value: lead.type },
          ].map(p => (
            <div key={p.label} className="bg-[#f8fafc] border border-[#f1f5f9] rounded-lg p-2.5">
              <p className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-[.05em]">{p.label}</p>
              <p className="text-[13px] font-black text-[#0f172a] leading-none mt-0.5">{p.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesTab({ notes, noteInput, setNoteInput, onAdd }: {
  notes: { id: number; text: string; date: string }[];
  noteInput: string; setNoteInput: (v: string) => void; onAdd: () => void;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        {notes.map(n => (
          <div key={n.id} className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
            <p className="text-[10px] text-slate-700 leading-relaxed">{n.text}</p>
            <p className="text-[8px] text-slate-400 mt-1.5 font-mono">{n.date}</p>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-gray-100">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Add Note</p>
        <textarea rows={4} value={noteInput} onChange={e => setNoteInput(e.target.value)}
          placeholder="Write a note..."
          className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[10px] font-semibold text-[#1e293b] outline-none resize-none mb-2 focus:border-[#2447d7]" />
        <button onClick={onAdd}
          className="w-full py-2 bg-gray-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all">
          <i className="fa-solid fa-plus mr-1"></i>Save Note
        </button>
      </div>
    </div>
  );
}

function DocsTab() {
  const [docs, setDocs] = useState<{ name: string; size: string; date: string }[]>([]);
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setDocs(p => [...p, ...Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      date: new Date().toLocaleDateString(),
    }))]);
  };
  return (
    <div className="p-4 space-y-3">
      <div
        onClick={() => document.getElementById('doc-file-input')?.click()}
        onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#2447d7'; }}
        onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}
        style={{ border: '2px dashed #e2e8f0', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all .2s' }}
      >
        <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-300 mb-2 block"></i>
        <p className="text-[10px] font-bold text-gray-500">Click or drag files to upload</p>
        <p className="text-[8px] text-gray-400 mt-1">PDF, JPG, PNG, XLSX accepted</p>
        <input type="file" id="doc-file-input" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>
      {docs.length === 0 && (
        <p className="text-[9px] text-gray-300 text-center py-4 italic">No documents uploaded yet</p>
      )}
      {docs.map((d, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-indigo-400 text-sm"></i>
            <div>
              <p className="text-[10px] font-semibold text-slate-700">{d.name}</p>
              <p className="text-[8px] text-slate-400">{d.size} · {d.date}</p>
            </div>
          </div>
          <button onClick={() => setDocs(p => p.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-all">
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
