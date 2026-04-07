import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { canManageTask } from '../../../utils/permissionUtils';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import { IconDocs, IconCheck, IconAlert, IconEye, IconPencil } from '../../../components/DocumentManagement/Icons';
import EditLeadModal from './EditLeadModal';
import { useTasks } from '../../../context/TasksContext';
import { useLeads } from '../../../context/LeadsContext';

/* ── tiny inline icons ── */
const Ico = ({ d, size = 16, color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" width={size} height={size}><path d={d} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconInfo   = () => <Ico d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IconEmail  = () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const IconPhone  = () => <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
const IconBank   = () => <Ico d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />;
const IconUser   = () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
const IconBell   = ({ color }) => <Ico d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" color={color} />;
const IconPlus   = () => <Ico d="M12 4v16m8-8H4" size={14} />;
const IconClose  = ({ size = 16 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconFile   = ({ size = 16 }) => <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={size} />;

/* ── reusable table row ── */
const Row = ({ label, value, span, highlight }) => (
    <tr className={`border-b border-[#f1f5f9] dark:border-white/5 last:border-0 ${highlight ? 'bg-[#f8faff] dark:bg-white/[0.02]' : ''}`}>
        <td className="py-2 pr-3 pl-4 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider whitespace-nowrap w-[38%] align-top">{label}</td>
        <td className={`py-2 pr-4 text-[13px] font-semibold text-[#1a202c] dark:text-white break-words max-w-0 ${span ? 'col-span-2' : ''}`}>{value || <span className="text-[#cbd5e1]">—</span>}</td>
    </tr>
);

/* ── section card ── */
const Card = ({ icon, iconBg, iconColor, title, children, action }) => (
    <div className="bg-white dark:bg-[#1e2347] rounded-xl border border-[#edf2f7] dark:border-white/5 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9] dark:border-white/5">
            <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>{icon}</span>
                <span className="text-[13px] font-bold text-[#1a202c] dark:text-white">{title}</span>
            </div>
            {action}
        </div>
        {children}
    </div>
);

const LeadDetails = ({ lead: initialLead, onBack, tasks = [], setTasks, onNavigate }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { updateLead } = useLeads();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const safeRole = (currentUser.role || '').toLowerCase();
    const isManagerOrAbove = safeRole.includes('manager') || safeRole.includes('admin');
    const isTeamLeader = safeRole.includes('leader');
    const canApproveReject = isManagerOrAbove || isTeamLeader;

    const [lead, setLead] = useState(initialLead || {
        id: 'AF-2026-0000', name: 'Guest Lead', businessName: '', email: 'no-email@example.com', phone: 'N/A', documents: []
    });
    const [teamLeaderName, setTeamLeaderName] = useState(lead.tl || lead.teamLeader || lead.teamLeaderName || '—');

    useEffect(() => {
        if (!lead.tl && !lead.teamLeader && !lead.teamLeaderName && lead.assignedStaffId) {
            import('../../../data/dummyData').then(data => {
                const { INITIAL_MEMBERSHIPS, SHARED_INITIAL_USERS } = data;
                for (const leaderId in INITIAL_MEMBERSHIPS) {
                    if (INITIAL_MEMBERSHIPS[leaderId].some(m => m.id === lead.assignedStaffId)) {
                        const leader = SHARED_INITIAL_USERS.find(u => u.id === parseInt(leaderId));
                        if (leader) setTeamLeaderName(leader.name);
                    }
                }
            });
        }
    }, [lead]);

    const leadId = lead.id?.toString().startsWith('AF-') ? lead.id : `AF-2026-${String(lead.id).padStart(4, '0')}`;
    const leadName = lead.name;
    const leadTasks = tasks.filter(t => t.lead === leadName || t.leadId === leadId);

    const [isAddingTask, setIsAddingTask] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [uploadingDocs, setUploadingDocs] = useState({});
    const [previewDoc, setPreviewDoc] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const { addTask, updateTask } = useTasks();
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const now = new Date();
        const noteObj = {
            id: Date.now(), text: newNote, author: currentUser.name || 'Tele Agent',
            role: (currentUser.role || 'Tele Agent').toUpperCase(),
            date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };
        const updatedHistory = [noteObj, ...(lead.noteHistory || [])];
        const updatedLead = { ...lead, noteHistory: updatedHistory, notes: newNote };
        setLead(updatedLead);
        updateLead(lead.id, { noteHistory: updatedHistory, notes: newNote });
        setNewNote('');
    };

    const handleUpload = (leadId, docId, docName, file) => {
        const targetDocId = docId || Date.now();
        const previewUrl = file ? URL.createObjectURL(file) : null;
        const fileName = file?.name || docName;
        const fileType = file?.type || null;
        const today = new Date().toISOString().split('T')[0];
        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                const newDoc = { id: targetDocId, type: docName, status: 'Pending', note: '', date: today, url: previewUrl, fileName, fileType };
                setLead(prev => {
                    const exists = prev.documents.find(d => d.id === targetDocId);
                    const newDocs = exists
                        ? prev.documents.map(d => d.id === targetDocId ? { ...newDoc, ...d, status: 'Pending', url: previewUrl, fileName, fileType } : d)
                        : [...prev.documents, newDoc];
                    const updated = { ...prev, documents: newDocs };
                    updateLead(prev.id, { documents: newDocs });
                    return updated;
                });
                setUploadingDocs(prev => { const n = { ...prev }; delete n[targetDocId]; return n; });
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);
    };

    const [newTask, setNewTask] = useState({
        title: '', lead: leadName, email: lead.email || '', phone: lead.phone || '',
        date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Call', reminder: 'none', message: ''
    });

    const handleAddTask = (e) => {
        e.preventDefault();
        const cu = JSON.parse(localStorage.getItem('user') || '{}');
        addTask({ ...newTask, id: Date.now(), status: 'Pending', lead: lead.name, leadId, assignedTo: cu.id?.toString() || 'Self', createdBy: cu.role || 'System', creatorId: cu.id });
        setIsAddingTask(false);
        setNewTask({ title: '', lead: leadName, email: lead.email || '', phone: lead.phone || '', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Call', reminder: 'none', message: '' });
    };

    const updateTaskStatus   = (id, s) => updateTask({ ...tasks.find(t => t.id === id), status: s });
    const updateTaskReminder = (id, r) => updateTask({ ...tasks.find(t => t.id === id), reminder: r });

    /* ── status badge ── */
    const statusColors = {
        'Document Collection':        'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
        'Document Verification Done': 'bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-500/20',
        'Lender Selection':           'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
        'Completed':                  'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20',
        'Loan Confirmed':             'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20',
        'Rejected':                   'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20',
        'Loan Rejected':              'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20',
    };
    const currentStatus = lead.status || lead.stage || 'Document Collection';
    const statusCls = statusColors[currentStatus] || 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-400 border-gray-100 dark:border-white/10';

    /* ── progress stages ── */
    const stages = [
        { id: 'Document Collection', label: 'Doc Collected' },
        { id: 'Document Verification Done', label: 'Doc Verified' },
        { id: 'Lender Selection', label: 'Lender Selection' },
        { id: 'Loan Confirmed', label: 'Loan Confirmed' },
        { id: 'Loan Rejected', label: 'Loan Rejected' },
    ];
    const stageIndex = { 'Document Collection': 0, 'Document Verification Done': 1, 'Lender Selection': 2, 'Completed': 3, 'Loan Confirmed': 3, 'Rejected': 4, 'Loan Rejected': 4 };
    const currentIdx = stageIndex[currentStatus] ?? 0;

    return (
        <div className="flex flex-col gap-4 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-slate-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-[#1a202c] dark:text-white">{leadId}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusCls}`}>{currentStatus}</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] mt-0.5">
                            Created {lead.submissionDate || lead.date || '—'} · Agent: <strong className="text-[#4a5568] dark:text-slate-300">{lead.agentName || lead.agent || '—'}</strong>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {onNavigate && currentStatus === 'Document Verification Done' && 
                     (isManagerOrAbove || isTeamLeader) && 
                     !(lead.documents || []).some(d => d.status === 'Rejected') && (
                        <button
                            onClick={() => onNavigate('lender_selection', lead)}
                            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <IconBank size={14} /> Lender Selection
                        </button>
                    )}
                    {isManagerOrAbove && (
                        <button onClick={() => setShowEditModal(true)} className="flex items-center gap-1.5 bg-[#f0f4ff] dark:bg-white/5 text-[#2447d7] dark:text-blue-400 px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#2447d7] hover:text-white dark:hover:bg-blue-500 transition-all border border-transparent dark:border-white/10">
                            <IconPencil size={13} /> Edit Lead
                        </button>
                    )}
                </div>
            </div>

            {/* ── PROGRESS BAR ── */}
            <div className="bg-white dark:bg-[#1e2347] rounded-xl border border-[#edf2f7] dark:border-white/5 px-6 py-4 shadow-sm overflow-x-auto">
                <div className="flex items-center min-w-[520px]">
                    {stages.map((s, i) => {
                        const done = i < currentIdx;
                        const active = i === currentIdx;
                        const rejected = s.id === 'Loan Rejected' && active;
                        const dot = done ? 'bg-[#10b981]' : active ? (rejected ? 'bg-red-500' : 'bg-[#2447d7]') : 'bg-[#e2e8f0] dark:bg-white/10';
                        const txt = done ? 'text-[#10b981]' : active ? (rejected ? 'text-red-500' : 'text-[#2447d7]') : 'text-[#cbd5e1] dark:text-slate-600';
                        const line = i < currentIdx ? 'bg-[#10b981]' : 'bg-[#e2e8f0] dark:bg-white/10';
                        return (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                    <div className={`w-7 h-7 ${dot} rounded-full flex items-center justify-center ${active ? 'ring-4 ring-offset-1 ring-current/20' : ''}`}>
                                        {done && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>}
                                        {active && rejected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-tight ${txt} text-center max-w-[64px] leading-tight`}>{s.label}</span>
                                </div>
                                {i < stages.length - 1 && <div className={`flex-1 h-0.5 ${line} mx-1 mt-[-14px]`} />}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* ── MAIN GRID: 3 columns on large, 2 on md, 1 on sm ── */}
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">

                {/* ── COL 1: Contact & Personal ── */}
                <div className="flex flex-col gap-4">

                    {/* Contact Info */}
                    <Card icon={<IconUser />} iconBg="bg-[#ebf0ff]" iconColor="text-[#2447d7]" title="Contact Info">
                        <table className="w-full text-left table-fixed">
                            <tbody>
                                <Row label="Full Name"   value={<span className="font-bold text-[#1a202c]">{leadName}</span>} />
                                {lead.businessName && <Row label="Business"  value={lead.businessName} highlight />}
                                <Row label="Email"       value={<a href={`mailto:${lead.email}`} className="text-[#2447d7] hover:underline">{lead.email || lead.emailAddress}</a>} />
                                <Row label="Phone"       value={<a href={`tel:${lead.phone}`} className="text-[#10b981] hover:underline">{lead.phone || lead.phoneNumber}</a>} />
                                <Row label="Pref. Contact" value={lead.preferredContactMethod?.length > 0 ? lead.preferredContactMethod.join(', ') : null} />
                                <Row label="Lead Source" value={lead.source || lead.leadSource} />
                                <Row label="Lead ID"     value={<span className="font-mono text-xs bg-[#f1f5f9] px-2 py-0.5 rounded">{leadId}</span>} />
                            </tbody>
                        </table>
                    </Card>

                    {/* Personal Info */}
                    <Card icon={<IconInfo />} iconBg="bg-[#f0f9ff]" iconColor="text-[#0ea5e9]" title="Personal Info">
                        <table className="w-full text-left table-fixed">
                            <tbody>
                                <Row label="Date of Birth"    value={lead.dob} />
                                <Row label="Home Owner"       value={lead.homeOwner} />
                                <Row label="Residential Addr" value={lead.residentialAddress} />
                                <Row label="Time at Address"  value={lead.timeAtCurrentAddress} />
                                {lead.previousAddress && <Row label="Previous Addr" value={lead.previousAddress} />}
                                <Row label="Job Title"        value={lead.jobTitle} />
                            </tbody>
                        </table>
                    </Card>

                </div>

                {/* ── COL 2: Business & Loan ── */}
                <div className="flex flex-col gap-4">

                    {/* Business Details */}
                    <Card icon={<IconBank />} iconBg="bg-[#fefce8]" iconColor="text-[#ca8a04]" title="Business Details">
                        <table className="w-full text-left table-fixed">
                            <tbody>
                                <Row label="Industry"          value={lead.industry} />
                                <Row label="Company House No." value={lead.nic || lead.companyHouseNumber} highlight />
                                <Row label="Annual Turnover"   value={lead.businessAnnualTurnover ? `£${lead.businessAnnualTurnover}` : null} />
                                <Row label="Company Bank"      value={lead.companyBank} />
                                <Row label="Overdraft"         value={lead.overdraftFacility} />
                            </tbody>
                        </table>
                    </Card>

                    {/* Loan Details */}
                    <Card icon={<IconBank />} iconBg="bg-[#fff7ed]" iconColor="text-[#ea580c]" title="Loan Details">
                        <table className="w-full text-left table-fixed">
                            <tbody>
                                <Row label="Amount Needed"     value={<span className="text-[#2447d7] font-bold">{lead.loanAmount || lead.amount}</span>} highlight />
                                <Row label="Loan Purpose"      value={lead.loanPurpose} />
                                <Row label="Funding Timeline"  value={lead.fundingTimeline} />
                                <Row label="Existing Loan"     value={lead.existingLoan === 'Yes'
                                    ? `Yes — ${lead.existingLoanLenderName || ''}${lead.existingLoanAmount ? ` £${lead.existingLoanAmount}` : ''}`
                                    : lead.existingLoan} />
                                {lead.existingLoan === 'Yes' && <>
                                    <Row label="Existing Rate"     value={lead.existingLoanInterestRate ? `${lead.existingLoanInterestRate}%` : null} />
                                    <Row label="Monthly Repayment" value={lead.existingLoanMonthlyRepayment ? `£${lead.existingLoanMonthlyRepayment}` : null} />
                                    <Row label="Loan Term"         value={lead.existingLoanTerm} />
                                </>}
                            </tbody>
                        </table>
                    </Card>

                    {/* Notes */}
                    <Card icon={<IconBell />} iconBg="bg-[#fdf4ff]" iconColor="text-[#a855f7]" title="Notes">
                        <div className="p-4">
                            {lead.notes
                                ? <p className="text-xs text-[#4a5568] dark:text-slate-300 bg-[#f8fafc] dark:bg-white/5 rounded-lg p-3 border border-[#edf2f7] dark:border-white/10 italic">{lead.notes}</p>
                                : <p className="text-[11px] text-[#94a3b8] italic text-center py-2">No notes added.</p>
                            }
                        </div>
                    </Card>
                </div>

                {/* ── COL 3: Tasks, Team, Documents ── */}
                <div className="flex flex-col gap-4">

                    {/* Tasks & Follow-ups */}
                    <Card
                        icon={<IconBell color="#ea580c" />} iconBg="bg-[#fff7ed]" iconColor="text-[#ea580c]" title="Tasks & Follow-ups"
                        action={<button onClick={() => setIsAddingTask(true)} className="flex items-center gap-1 bg-[#2447d7] text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-[#1a36b1] transition-all"><IconPlus /> Add</button>}
                    >
                        <div className="p-3 flex flex-col gap-2 max-h-[340px] overflow-y-auto scrollbar-thin">
                            {leadTasks.length > 0 ? leadTasks.map(task => (
                                <div key={task.id} className="bg-[#f8fafc] dark:bg-white/5 border border-[#edf2f7] dark:border-white/10 rounded-lg p-3 flex flex-col gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <p className="text-[12px] font-bold text-[#1a202c] dark:text-white break-words">{task.title}</p>
                                            <p className="text-[10px] text-[#94a3b8]">{task.date} · {task.time}</p>
                                        </div>
                                        <select
                                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border outline-none cursor-pointer ${task.status === 'Completed' ? 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20' : 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'}`}
                                            value={task.status}
                                            onChange={e => updateTaskStatus(task.id, e.target.value)}
                                        >
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                    </div>
                                    {task.message && <p className="text-[10px] text-[#718096] dark:text-slate-400 italic bg-white dark:bg-white/5 p-2 rounded border border-[#f1f5f9] dark:border-white/10 break-words line-clamp-3">"{task.message}"</p>}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold text-[#94a3b8] uppercase">Reminder:</span>
                                        <select className="bg-transparent border-none text-[9px] font-bold text-[#2447d7] outline-none cursor-pointer" value={task.reminder} onChange={e => updateTaskReminder(task.id, e.target.value)}>
                                            <option value="none">Off</option>
                                            <option value="15m">15m</option>
                                            <option value="1h">1h</option>
                                            <option value="1d">1d</option>
                                        </select>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[11px] text-[#94a3b8] italic text-center py-4">No tasks for this lead.</p>
                            )}
                        </div>
                    </Card>

                    {/* Team & Assignment */}
                    <Card icon={<IconUser />} iconBg="bg-[#f0fdf4]" iconColor="text-[#16a34a]" title="Team & Assignment">
                        <table className="w-full text-left table-fixed">
                            <tbody>
                                {(() => {
                                    // Try to resolve role: either from lead object or by looking up the agent's name in SHARED_INITIAL_USERS
                                    let role = (lead.createdByRole || '').toLowerCase();
                                    const creatorName = lead.agentName || lead.agent || '—';

                                    // Fallback: If role is missing, try to find the user in our SHARED_INITIAL_USERS list
                                    if (!role && creatorName !== '—') {
                                        import('../../../data/dummyData').then(data => {
                                            const u = data.SHARED_INITIAL_USERS.find(user => user.name === creatorName);
                                            if (u) {
                                                // We can't update state here easily without loops, but we can handle common cases
                                            }
                                        });
                                    }
                                    
                                    // Let's refine the logic to be more robust
                                    const isSuperAdmin = role.includes('super_admin') || role.includes('super admin') || creatorName === 'Jane Doe';
                                    const isManager = role.includes('accounts_manager') || role.includes('accounts manager') || creatorName === 'Sarah White' || creatorName === 'Alex Johnson';
                                    const isTL = role.includes('team_leader') || role.includes('team leader') || ['Marcus Smith', 'Diana Fernandez', 'Ryan Patel', 'Aisha Nkosi', 'Tom Brennan'].includes(creatorName);

                                    if (isSuperAdmin) {
                                        return <Row label="Super Admin" value={creatorName} />;
                                    } else if (isManager) {
                                        return <Row label="Manager" value={creatorName} />;
                                    } else if (isTL) {
                                        return (
                                            <>
                                                <Row label="Team Leader" value={creatorName} />
                                                {lead.manager && <Row label="Manager" value={lead.manager} />}
                                            </>
                                        );
                                    } else {
                                        // Default: Tele Agent
                                        return (
                                            <>
                                                <Row label="Tele Agent" value={creatorName} />
                                                <Row label="Team Leader" value={teamLeaderName} />
                                            </>
                                        );
                                    }
                                })()}
                            </tbody>
                        </table>
                    </Card>

                    {/* Documents */}
                    <Card
                        icon={<IconDocs />} iconBg="bg-[#f3e8ff]" iconColor="text-[#7c3aed]" title="Documents"
                        action={!(lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0) && (
                            <button onClick={() => setShowModal(true)} className="bg-[#2447d7] text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-[#1a36b1] transition-all">Manage</button>
                        )}
                    >
                        <div className="p-3 flex flex-col gap-2">
                            {/* Status badge */}
                            {(() => {
                                const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                const allApproved = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                const docCount = lead.documents?.length || 0;
                                const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;
                                if (hasRejected || ['Rejected','Loan Rejected'].includes(currentStatus))
                                    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"><IconAlert size={11} /> Rejected</span>;
                                if (['Loan Confirmed','Completed'].includes(currentStatus) || allApproved)
                                    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20"><IconCheck size={11} strokeWidth={3} /> All Verified</span>;
                                if (currentStatus === 'Lender Selection')
                                    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20"><IconCheck size={11} strokeWidth={3} /> Lender Selection</span>;
                                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Checking ({approvedCount}/{docCount})
                                </span>;
                            })()}

                            {/* Doc list */}
                            {lead.documents?.length > 0 ? (
                                <div className="divide-y divide-[#f1f5f9] border border-[#edf2f7] rounded-lg overflow-hidden mt-1">
                                    {lead.documents.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between px-3 py-2 hover:bg-[#f8fafc] transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${doc.status === 'Approved' ? 'bg-green-50 text-green-600' : doc.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#2447d7]'}`}>
                                                    <IconFile size={12} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-[#1a202c]">{doc.type}</p>
                                                    <p className={`text-[9px] font-bold uppercase ${doc.status === 'Approved' ? 'text-green-600' : doc.status === 'Rejected' ? 'text-red-500' : 'text-[#94a3b8]'}`}>{doc.status}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setPreviewDoc(doc)} className="p-1 text-[#2447d7] hover:bg-[#ebf0ff] rounded-md transition-colors">
                                                <IconEye size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[11px] text-[#94a3b8] italic text-center py-3">No documents uploaded yet.</p>
                            )}
                        </div>
                    </Card>

                </div>
            </div> {/* end grid */}

            {/* ── ADD TASK MODAL ── */}
            {isAddingTask && (
                <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <span className="font-bold text-sm text-[#1a202c]">Add New Task</span>
                            <button onClick={() => setIsAddingTask(false)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"><IconClose size={16} /></button>
                        </div>
                        <form onSubmit={handleAddTask} className="p-5 flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Task Title *</label>
                                <input required type="text" className="p-2 border border-[#edf2f7] rounded-lg text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#2447d7]/40" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g., Follow up call" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Date *</label>
                                    <input required type="date" className="p-2 border border-[#edf2f7] rounded-lg text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#2447d7]/40" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Time *</label>
                                    <input required type="time" className="p-2 border border-[#edf2f7] rounded-lg text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#2447d7]/40" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Type</label>
                                    <select className="p-2 border border-[#edf2f7] rounded-lg text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#2447d7]/40" value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}>
                                        <option>Call</option><option>Document</option><option>Review</option><option>Email</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Reminder</label>
                                    <select className="p-2 border border-[#edf2f7] rounded-lg text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#2447d7]/40" value={newTask.reminder} onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                        <option value="none">Off</option><option value="15m">15 min</option><option value="1h">1 hour</option><option value="1d">1 day</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Message (optional)</label>
                                <textarea className="p-2 border border-[#edf2f7] rounded-lg text-sm text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#2447d7]/40 min-h-[70px] resize-none" value={newTask.message} onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Notes for this task…" />
                            </div>
                            <div className="flex justify-end gap-2 mt-1">
                                <button type="button" onClick={() => setIsAddingTask(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all">Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded-xl bg-[#2447d7] text-white text-xs font-bold hover:bg-[#1a36b1] transition-all shadow-md">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── UPLOAD MODAL ── */}
            {showModal && (
                <UploadModal
                    client={lead}
                    onClose={() => setShowModal(false)}
                    onUpload={handleUpload}
                    onDelete={(clientId, docId) => {
                        setLead(prev => {
                            const newDocs = prev.documents.filter(d => d.id !== docId);
                            const allAppr = newDocs.length > 0 && newDocs.every(d => d.status === 'Approved');
                            const newStat = allAppr ? 'Document Verification Done' : (newDocs.some(d => d.status === 'Rejected') ? 'Rejected' : 'Document Collection');
                            updateLead(prev.id, { documents: newDocs, status: newStat, stage: newStat });
                            return { ...prev, documents: newDocs, status: newStat, stage: newStat };
                        });
                    }}
                    onApprove={(clientId, docId) => {
                        setLead(prev => {
                            const newDocs = prev.documents.map(d => d.id === docId ? { ...d, status: 'Approved' } : d);
                            const allAppr = newDocs.length > 0 && newDocs.every(d => d.status === 'Approved');
                            const newStat = allAppr ? 'Document Verification Done' : prev.status;
                            updateLead(prev.id, { documents: newDocs, status: newStat, stage: newStat });
                            return { ...prev, documents: newDocs, status: newStat, stage: newStat };
                        });
                    }}
                    onReject={(clientId, docId, reason) => {
                        setLead(prev => {
                            const newDocs = prev.documents.map(d => d.id === docId ? { ...d, status: 'Rejected', note: reason } : d);
                            const newStat = 'Rejected';
                            updateLead(prev.id, { documents: newDocs, status: newStat, stage: newStat, managerRejectionReason: reason });
                            return { ...prev, documents: newDocs, status: newStat, stage: newStat, managerRejectionReason: reason };
                        });
                    }}
                    uploadingDocs={uploadingDocs}
                    isDark={isDark}
                    isTeamLeader={isTeamLeader}
                />
            )}

            {/* ── PREVIEW DOC MODAL ── */}
            {previewDoc && (
                <div className="fixed inset-0 z-[2200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewDoc(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-sm text-[#1a202c]">{previewDoc.type}</span>
                            <button onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><IconClose size={16} /></button>
                        </div>
                        {previewDoc.url ? (
                            (previewDoc.fileType?.includes('pdf') || previewDoc.url?.endsWith('.pdf') || previewDoc.fileName?.endsWith('.pdf')) ? (
                                <iframe src={previewDoc.url} title={previewDoc.type} className="w-full h-[500px] rounded-lg border border-[#edf2f7] bg-white"></iframe>
                            ) : (
                                <img src={previewDoc.url} alt={previewDoc.type} className="w-full rounded-lg border border-[#edf2f7]" />
                            )
                        ) : (
                            <div className="flex flex-col items-center gap-3 py-8 text-[#94a3b8]">
                                <IconFile size={40} />
                                <p className="text-sm font-medium">{previewDoc.fileName || 'No preview available'}</p>
                            </div>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${previewDoc.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : previewDoc.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{previewDoc.status}</span>
                            {previewDoc.note && <p className="text-xs text-[#718096] italic">"{previewDoc.note}"</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            {showEditModal && (
                <EditLeadModal
                    isOpen={showEditModal}
                    lead={lead}
                    onClose={() => setShowEditModal(false)}
                    onSave={(updated) => {
                        setLead(updated);
                        updateLead(lead.id, updated);
                        setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default LeadDetails;
