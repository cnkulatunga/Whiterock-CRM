import React, { useState, useEffect, useRef } from 'react';
import { signIn, createCalendarEvent, getAccount } from '../../services/outlookService';
import { useUsers } from '../../context/UsersContext';
import { useLeads } from '../../context/LeadsContext';


/* ── ICONS ── */
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width="14" height="14">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const TaskModal = ({ isOpen, onClose, onSave, editingTask = null }) => {
    const { users } = useUsers();
    const { leads } = useLeads();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const role = currentUser.role || '';
    
    // Role-based filtering logic
    const getRoleHierarchy = (userRole) => {
        const norm = userRole.toLowerCase().trim();
        if (norm === 'super admin' || norm === 'super_admin') return { label: 'Admin', canAssignTo: ['Team Leader', 'Accounts Manager', 'Tele Agent'] };
        if (norm === 'accounts manager' || norm === 'accounts_manager') return { label: 'Manager', canAssignTo: ['Team Leader', 'Tele Agent'] };
        if (norm === 'team leader' || norm === 'team_leader') return { label: 'Leader', canAssignTo: ['Tele Agent'] };
        return { label: 'Self', canAssignTo: [] };
    };

    const roleInfo = getRoleHierarchy(role);
    const assignableUsers = users.filter(u => roleInfo.canAssignTo.includes(u.role));

    const [newTask, setNewTask] = useState({
        title: '',
        lead: '',
        leadEmail: '',
        leadPhone: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Call',
        reminder: 'none',
        assignedTo: ['Self'],
        message: '',
        leadStatus: 'Warm'
    });

    const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false);
    const leadDropdownRef = useRef(null);


    const [addToOutlook, setAddToOutlook] = useState(false);
    const [isSyncingOutlook, setIsSyncingOutlook] = useState(false);
    const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAssignDropdownOpen(false);
            }
            if (leadDropdownRef.current && !leadDropdownRef.current.contains(event.target)) {
                setIsLeadDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (editingTask) {
            setNewTask({
                title: editingTask.title,
                lead: editingTask.lead || '',
                leadEmail: editingTask.leadEmail || editingTask.email || '',
                leadPhone: editingTask.leadPhone || editingTask.phone || '',
                date: editingTask.date,
                time: editingTask.time,
                type: editingTask.type,
                reminder: editingTask.reminder || 'none',
                assignedTo: Array.isArray(editingTask.assignedTo) ? editingTask.assignedTo : [editingTask.assignedTo || 'Self'],
                message: editingTask.message || '',
                leadStatus: editingTask.leadStatus || 'Warm'
            });
        } else {
            setNewTask({
                title: '',
                lead: '',
                leadEmail: '',
                leadPhone: '',
                date: new Date().toISOString().split('T')[0],
                time: '12:00',
                type: 'Call',
                reminder: 'none',
                assignedTo: ['Self'],
                message: '',
                leadStatus: 'Warm'
            });
        }
    }, [editingTask, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSyncingOutlook(true);
        try {
            let taskToSave = {
                ...newTask,
                id: editingTask ? editingTask.id : Date.now(),
                status: editingTask ? editingTask.status : 'Pending',
                createdBy: editingTask ? editingTask.createdBy : role,
                creatorId: editingTask ? editingTask.creatorId : currentUser.id
            };

            if (addToOutlook && !editingTask) {
                if (!getAccount()) {
                    await signIn();
                }
                const startTime = new Date(`${newTask.date}T${newTask.time}`);
                const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
                
                const attendees = newTask.assignedTo
                    .map(id => {
                        if (id === 'Self') return null;
                        if (id === 'All') return null; // Logic to invite everyone could be complex, skipping for now
                        const u = users.find(user => user.id === id);
                        return u && u.email ? { emailAddress: { address: u.email, name: u.name }, type: "required" } : null;
                    })
                    .filter(Boolean);

                await createCalendarEvent({
                    subject: newTask.title,
                    body: { contentType: "HTML", content: newTask.message || `Task: ${newTask.title}` },
                    start: { dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                    end: { dateTime: endTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                    attendees: attendees
                });
            }

            onSave(taskToSave);
            onClose();
        } catch (error) {
            console.error("Failed to save task", error);
            alert("Failed to save task. Please try again.");
        } finally {
            setIsSyncingOutlook(false);
        }
    };

    if (!isOpen) return null;

    const selfLabel = `Self (${roleInfo.label})`;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" role="dialog" aria-modal="true">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-5 px-8 border-b border-[#f1f5f9] flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-[#1a202c]">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                    <button className="w-8 h-8 border border-[#f1f5f9] text-[#a0aec0] hover:text-[#e53e3e] hover:bg-[#fff5f5] rounded-xl flex items-center justify-center transition-all text-2xl font-light" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-6">
                    <div className="grid grid-cols-4 gap-5 md:grid-cols-1">
                        <div className="flex flex-col gap-1.5 col-span-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Task Title</label>
                            <input required type="text" value={newTask.title} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. System Wide Sync..." />
                        </div>
                        
                        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1 relative" ref={dropdownRef}>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Assign To</label>
                            <div 
                                className={`w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer flex items-center justify-between transition-all ${isAssignDropdownOpen ? 'bg-white border-[#2447d7] ring-4 ring-[#2447d7]/5' : ''}`}
                                onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                            >
                                <span className="font-semibold text-slate-700 truncate mr-2">
                                    {newTask.assignedTo.length === 0 ? 'Select User' : 
                                     newTask.assignedTo.includes('All') ? 'All (Team)' : 
                                     newTask.assignedTo.length === 1 ? (newTask.assignedTo[0] === 'Self' ? selfLabel : users.find(u => u.id === newTask.assignedTo[0])?.name) :
                                     `${newTask.assignedTo.length} Users Selected`}
                                </span>
                                <div className={`transition-transform duration-300 ${isAssignDropdownOpen ? 'rotate-180' : ''}`}>
                                    <IconChevronDown />
                                </div>
                            </div>

                            {isAssignDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#edf2f7] rounded-2xl shadow-2xl z-[1001] max-h-[300px] overflow-y-auto custom-scrollbar animate-fadeIn">
                                    <div className="p-2 flex flex-col gap-1">
                                        {[
                                            { id: 'Self', name: selfLabel, type: 'special' },
                                            { id: 'All', name: 'All (Team)', type: 'special' }
                                        ].map(item => (
                                            <div 
                                                key={item.id}
                                                className={`flex items-center justify-between p-2.5 px-4 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${newTask.assignedTo.includes(item.id) ? 'bg-[#f0f4ff] text-[#2447d7]' : 'text-slate-600'}`}
                                                onClick={() => {
                                                    const current = [...newTask.assignedTo];
                                                    if (current.includes(item.id)) {
                                                        setNewTask({...newTask, assignedTo: current.filter(id => id !== item.id)});
                                                    } else {
                                                        setNewTask({...newTask, assignedTo: [...current, item.id]});
                                                    }
                                                }}
                                            >
                                                <span className="text-sm font-bold">{item.name}</span>
                                                {newTask.assignedTo.includes(item.id) && <IconCheck />}
                                            </div>
                                        ))}

                                        {[
                                            { label: 'Managers', role: 'Accounts Manager' },
                                            { label: 'Team Leaders', role: 'Team Leader' },
                                            { label: 'Members (Tele Agents)', role: 'Tele Agent' }
                                        ].map(group => {
                                            const groupUsers = assignableUsers.filter(u => u.role === group.role);
                                            if (groupUsers.length === 0) return null;
                                            return (
                                                <div key={group.role} className="mt-2">
                                                    <div className="px-4 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</div>
                                                    {groupUsers.map(u => (
                                                        <div 
                                                            key={u.id} 
                                                            className={`flex items-center justify-between p-2.5 px-4 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${newTask.assignedTo.includes(u.id) ? 'bg-[#f0f4ff] text-[#2447d7]' : 'text-slate-600'}`}
                                                            onClick={() => {
                                                                const current = [...newTask.assignedTo];
                                                                if (current.includes(u.id)) {
                                                                    setNewTask({...newTask, assignedTo: current.filter(id => id !== u.id)});
                                                                } else {
                                                                    setNewTask({...newTask, assignedTo: [...current, u.id]});
                                                                }
                                                            }}
                                                        >
                                                            <span className="text-sm font-bold">{u.name}</span>
                                                            {newTask.assignedTo.includes(u.id) && <IconCheck />}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Task Type</label>
                            <select value={newTask.type} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" onChange={e => setNewTask({...newTask, type: e.target.value})}>
                                <option>Call</option>
                                <option>Document</option>
                                <option>Review</option>
                                <option>Meeting</option>
                                <option>Email</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Lead Status</label>
                            <select value={newTask.leadStatus} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" onChange={e => setNewTask({...newTask, leadStatus: e.target.value})}>
                                <option value="Hot">🔥 Hot</option>
                                <option value="Warm">☀️ Warm</option>
                                <option value="Cool">❄️ Cool</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1 relative" ref={leadDropdownRef}>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Lead / Client</label>
                            <div 
                                className={`w-full bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer flex items-center justify-between transition-all ${isLeadDropdownOpen ? 'bg-white border-[#2447d7] ring-4 ring-[#2447d7]/5' : ''}`}
                                onClick={() => setIsLeadDropdownOpen(!isLeadDropdownOpen)}
                            >
                                <span className="font-semibold text-slate-700 truncate mr-2">
                                    {newTask.lead || 'Select a Lead'}
                                </span>
                                <div className={`transition-transform duration-300 ${isLeadDropdownOpen ? 'rotate-180' : ''}`}>
                                    <IconChevronDown />
                                </div>
                            </div>

                            {isLeadDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#edf2f7] rounded-2xl shadow-2xl z-[1001] max-h-[300px] overflow-y-auto custom-scrollbar animate-fadeIn">
                                    <div className="p-2 flex flex-col gap-1">
                                        {leads.length > 0 ? (
                                            leads.map(lead => (
                                                <div 
                                                    key={lead.id}
                                                    className={`flex flex-col p-3 px-4 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${newTask.lead === lead.name ? 'bg-[#f0f4ff] text-[#2447d7]' : 'text-slate-600'}`}
                                                    onClick={() => {
                                                        setNewTask({
                                                            ...newTask,
                                                            lead: lead.name,
                                                            leadEmail: lead.email || '',
                                                            leadPhone: lead.phone || ''
                                                        });
                                                        setIsLeadDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold">{lead.name}</span>
                                                        {newTask.lead === lead.name && <IconCheck />}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-medium text-slate-400">{lead.businessName}</span>
                                                        <span className="text-[10px] text-slate-300">•</span>
                                                        <span className="text-[10px] font-medium text-slate-400">{lead.email}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">No leads found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Lead Phone</label>
                            <input type="text" value={newTask.leadPhone} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, leadPhone: e.target.value})} placeholder="Phone Number" />
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Lead Email</label>
                            <input type="text" value={newTask.leadEmail} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, leadEmail: e.target.value})} placeholder="Email Address" />
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Date</label>
                            <input required type="date" value={newTask.date} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, date: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Time</label>
                            <input required type="time" value={newTask.time} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full" onChange={e => setNewTask({...newTask, time: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Reminder</label>
                            <select value={newTask.reminder} className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23718096%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px]" onChange={e => setNewTask({...newTask, reminder: e.target.value})}>
                                <option value="none">No Reminder</option>
                                <option value="15m">15 Minutes Before</option>
                                <option value="1h">1 Hour Before</option>
                                <option value="1d">1 Day Before</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 col-span-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Notes / Message</label>
                            <textarea value={newTask.message} className="bg-[#f8fafc] border border-[#e2e8f0] p-3 px-4 rounded-xl text-sm focus:bg-white focus:border-[#2447d7] focus:ring-4 focus:ring-[#2447d7]/5 outline-none transition-all w-full min-h-[80px] resize-none" onChange={e => setNewTask({...newTask, message: e.target.value})} placeholder="Additional details..." />
                        </div>
                        
                        {!editingTask && (
                            <div className="flex items-center gap-4 col-span-4 p-4 bg-[#f8faff] rounded-2xl border border-[#ebf0ff] cursor-pointer hover:bg-[#f0f4ff] transition-colors" onClick={() => setAddToOutlook(!addToOutlook)}>
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${addToOutlook ? 'bg-[#2447d7] border-[#2447d7]' : 'bg-white border-[#cbd5e0]'}`}>
                                    {addToOutlook && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-black text-[#1a202c]">Sync with Outlook Calendar</span>
                                    <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wide">Automatically add this to your Microsoft 365 schedule</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" className="p-[10px_24px] rounded-xl text-sm font-bold text-[#718096] hover:bg-[#f8fafc] transition-all" onClick={onClose}>Discard</button>
                        <button type="submit" disabled={isSyncingOutlook} className="bg-[#2447d7] text-white p-[10px_36px] rounded-xl text-sm font-black shadow-lg shadow-[#2447d7]/25 hover:bg-[#1732a3] hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-70 flex items-center gap-2 uppercase tracking-wider">
                            {isSyncingOutlook && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {isSyncingOutlook ? 'Syncing...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
