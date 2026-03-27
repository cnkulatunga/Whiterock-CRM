import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, createCalendarEvent, getCalendarEvents, getAccount } from '../../../services/outlookService';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { canManageTask } from '../../../utils/permissionUtils';
import { usePromotions } from '../../../context/PromotionsContext';
import TaskModal from '../../../components/modals/TaskModal';

const SuperAdminTasks = ({ tasks: initialTasks, setTasks, initialDate, notifyReminderSet }) => {
    const { promotions } = usePromotions();

    // Merge promotions as pseudo-tasks (read-only, never persisted to localStorage)
    const memoizedPromotions = React.useMemo(() => promotions.map(p => ({
        id: `promo-${p.id}`,
        title: `PROMO: ${p.lenderName}`,
        lead: p.description,
        date: p.startDate,
        endDate: p.endDate,
        time: '09:00',
        type: 'Promotion',
        status: 'Active',
        isPromotion: true,
        priority: 'High',
        fileName: p.fileName,
        fileData: p.fileData,
        assignedTo: 'Self'
    })), [promotions]);

    const tasks = React.useMemo(() => [...initialTasks, ...memoizedPromotions], [initialTasks, memoizedPromotions]);
    const { users } = useUsers();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const assignableUsers = users.filter(u => u.role !== 'Super Admin');

    const [filter, setFilter] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // All, Personal, Team
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const [viewMode, setViewMode] = useState('list');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [highlightTaskId, setHighlightTaskId] = useState(null);
    const taskRefs = useRef({});

    // Auto-highlight and scroll to task linked from dashboard
    useEffect(() => {
        if (location.state?.taskId) {
            setHighlightTaskId(location.state.taskId);
            setTimeout(() => {
                const el = taskRefs.current[location.state.taskId];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            const timer = setTimeout(() => setHighlightTaskId(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);


    const todayDate = new Date();
    const [calYear, setCalYear] = useState(todayDate.getFullYear());
    const [calMonth, setCalMonth] = useState(todayDate.getMonth());
    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSaveTask = (taskToSave) => {
        if (editingTask) {
            setTasks(tasks.map(t => t.id === taskToSave.id ? taskToSave : t));
        } else {
            setTasks([taskToSave, ...tasks]);
            if (notifyReminderSet) notifyReminderSet(taskToSave);
        }
        setIsAddingTask(false);
        setEditingTask(null);
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsAddingTask(true);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };


    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const updateTaskReminder = (id, newReminder) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const updatedTask = { ...t, reminder: newReminder };
                if (notifyReminderSet && newReminder !== 'none') notifyReminderSet(updatedTask);
                return updatedTask;
            }
            return t;
        }));
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.lead && task.lead.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filter === 'All' || task.status === filter;
        
        let matchesAssignment = true;
        if (assignmentFilter === 'Personal') {
            matchesAssignment = Array.isArray(task.assignedTo) ? task.assignedTo.includes('Self') : task.assignedTo === 'Self';
        } else if (assignmentFilter === 'Team') {
            matchesAssignment = Array.isArray(task.assignedTo) ? (task.assignedTo.length > 1 || (task.assignedTo.length === 1 && task.assignedTo[0] !== 'Self')) : task.assignedTo !== 'Self';
        }
        
        return matchesSearch && matchesStatus && matchesAssignment;
    });

    const renderCalendar = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
        const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
        const monthStr = String(calMonth + 1).padStart(2, '0');
        const cells = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
        const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const baseYear = new Date().getFullYear();
        const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => baseYear - 3 + i);

        return (
            <div className="grid grid-cols-[1fr_320px] gap-8 xl:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    {/* Month/Year Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-[#edf2f7] bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:border-[#2447d7] hover:text-[#2447d7] transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <select value={calMonth} onChange={e => setCalMonth(Number(e.target.value))} className="text-sm font-bold outline-none rounded-lg px-2 py-1 border border-[#edf2f7] bg-white text-[#1a202c] cursor-pointer focus:border-[#2447d7]">
                                {MONTH_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                            </select>
                            <select value={calYear} onChange={e => setCalYear(Number(e.target.value))} className="text-sm font-bold outline-none rounded-lg px-2 py-1 border border-[#edf2f7] bg-white text-[#1a202c] cursor-pointer focus:border-[#2447d7]">
                                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-[#edf2f7] bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:border-[#2447d7] hover:text-[#2447d7] transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-[#cbd5e0] tracking-widest pb-4 uppercase">{d}</div>
                        ))}
                        {cells.map((day, idx) => {
                            if (day === null) return <div key={`blank-${idx}`} />;
                            const dateStr = `${calYear}-${monthStr}-${String(day).padStart(2, '0')}`;
                            const dayTasks = tasks.filter(t => t.date === dateStr);
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === todayStr;
                            return (
                                <div
                                    key={day}
                                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 group hover:border-[#2447d7] hover:shadow-md
                                        ${isToday && !isSelected ? 'bg-[#eef2ff] border-[#2447d7]/30' : dayTasks.length > 0 ? 'bg-[#f8faff]' : 'bg-white'}
                                        ${isSelected ? 'border-[#2447d7] ring-4 ring-[#2447d7]/5 z-10' : isToday ? '' : 'border-[#edf2f7]'}
                                    `}
                                    onClick={() => setSelectedDate(dateStr)}
                                >
                                    <span className={`text-[13px] font-bold w-6 h-6 flex items-center justify-center rounded-full
                                        ${isToday ? 'bg-[#2447d7] text-white' : isSelected ? 'text-[#2447d7]' : 'text-[#718096] group-hover:text-[#2447d7]'}
                                    `}>{day}</span>
                                    <div className="flex gap-1 mt-1.5 flex-wrap justify-center px-1">
                                        {dayTasks.slice(0, 3).map(t => (
                                            <div
                                                key={t.id}
                                                className={`w-1.5 h-1.5 rounded-full ring-2 ring-white ${t.isPromotion ? 'bg-[#2447d7] animate-pulse' : t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#3b82f6]' : 'bg-[#f59e0b]'} ${t.assignedTo !== 'Self' && !t.isPromotion ? 'animate-pulse' : ''}`}
                                                title={t.title}
                                            ></div>
                                        ))}
                                        {dayTasks.length > 3 && <div className="w-1 h-1 bg-[#cbd5e0] rounded-full"></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm flex flex-col gap-5">
                        <div className="flex justify-between items-center pb-4 border-b border-[#f7fafc]">
                            <h3 className="text-[15px] font-bold text-[#1a202c]">Tasks for {selectedDate}</h3>
                            <button className="w-8 h-8 bg-[#2447d7] text-white rounded-lg flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-[#2447d7]/20" onClick={() => {
                                setEditingTask(null);
                                setIsAddingTask(true);
                            }}>
                                <IconPlus />
                            </button>

                        </div>
                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {tasks.filter(t => t.date === selectedDate).length > 0 ? (
                                tasks.filter(t => t.date === selectedDate).map(t => (
                                    <div key={t.id} className="p-4 bg-[#f8faff] rounded-xl border border-[#edf2f7] group hover:border-[#2447d7]/20 transition-all duration-300">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-10 rounded-full shrink-0 ${t.status === 'Completed' ? 'bg-[#10b981]' : t.status === 'In Progress' ? 'bg-[#3b82f6]' : 'bg-[#f59e0b]'}`}></div>
                                            <div className="flex flex-col gap-1 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[13px] font-bold text-[#1a202c] leading-tight">
                                                        {t.title}
                                                    </span>
                                                    {t.isPromotion && <span className="bg-[#2447d7] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">Active Promo</span>}
                                                    {t.assignedTo !== 'Self' && !t.isPromotion && <span className="bg-[#ebf0ff] text-[#2447d7] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Assigned</span>}
                                                </div>
                                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">{t.time} • {t.lead || 'Personal'}</span>
                                                {t.assignedTo && t.assignedTo !== 'Self' && (
                                                    <span className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md w-fit" style={{ background: isDark ? 'rgba(36,71,215,0.15)' : '#f0f4ff', color: '#2447d7' }}>
                                                        Assignee: {users.find(u => u.id.toString() === t.assignedTo.toString())?.name || t.assignedTo}
                                                    </span>
                                                )}
                                                {t.isPromotion && t.fileName && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-[#718096] truncate max-w-[150px]">{t.fileName}</span>
                                                        {t.fileData && (
                                                            <a href={t.fileData} download={t.fileName} className="text-[#2447d7] hover:underline text-[10px] font-bold uppercase transition-all">Download</a>
                                                        )}
                                                    </div>
                                                )}
                                                {t.createdBy && t.createdBy !== 'Super Admin' && !t.isPromotion && (
                                                    <span className="text-[9px] font-black mt-1 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit" style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' }}>
                                                        By: {t.createdBy}
                                                    </span>
                                                )}
                                                {canManageTask(t, user) && !t.isPromotion && (
                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#f1f5f9]">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleEditClick(t); }}
                                                            className="p-1 px-2 rounded-md bg-[#f8fafc] text-[#718096] hover:text-[#2447d7] hover:bg-[#eef2ff] transition-all text-[10px] font-bold border border-[#edf2f7]"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(t.id); }}
                                                            className="p-1 px-2 rounded-md bg-[#f8fafc] text-[#718096] hover:text-[#e53e3e] hover:bg-[#fff5f5] transition-all text-[10px] font-bold border border-[#edf2f7]"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center gap-3 text-center grayscale opacity-60">
                                    <IconCalendar size={32} />
                                    <p className="text-[13px] font-bold text-[#718096]">No tasks scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-center mb-10 sm:flex-col sm:items-start sm:gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-2xl">Global Tasks & Followups</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium">Monitor and manage all system tasks and assignments.</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-wrap">

                    <div className="flex p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
                        <button className={`p-[6px_16px] rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('list')}><div className="flex items-center gap-2"><IconList size={14} /> List</div></button>
                        <button className={`p-[6px_16px] rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`} onClick={() => setViewMode('calendar')}><div className="flex items-center gap-2"><IconCalendar size={14} /> Calendar</div></button>
                    </div>
                    <button className="bg-[#2447d7] text-white p-[10px_20px] rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-2 sm:w-full sm:justify-center" onClick={() => { setIsAddingTask(true); setEditingTask(null); }}>
                        <IconPlus /> <span>New Task</span>
                    </button>

                </div>
            </header>

            <TaskModal 
                isOpen={isAddingTask} 
                onClose={() => { setIsAddingTask(false); setEditingTask(null); }}
                onSave={handleSaveTask}
                editingTask={editingTask}
            />

            {viewMode === 'list' && (
                <div className="flex flex-wrap justify-between items-center mb-8 gap-5 md:flex-col md:items-stretch">
                    <div className="flex bg-[#f1f5f9] p-1 rounded-2xl border border-[#e2e8f0] w-fit shrink-0 sm:w-full overflow-x-auto no-scrollbar">
                        {['All', 'Personal', 'Team'].map(type => (
                            <button
                                key={type}
                                className={`p-[10px_24px] rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${assignmentFilter === type ? 'bg-white text-[#2447d7] shadow-sm ring-1 ring-[#2447d7]/10' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setAssignmentFilter(type)}
                            >
                                {type} Views
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 flex-1 justify-end max-w-[800px] md:max-w-full">
                        <div className="flex-1 min-w-[200px] bg-white border border-[#edf2f7] p-3 px-4 rounded-2xl flex items-center gap-3 shadow-sm focus-within:ring-4 focus-within:ring-[#2447d7]/5 focus-within:border-[#2447d7] transition-all">
                            <IconSearch />
                            <input
                                type="text"
                                className="bg-transparent border-none outline-none text-sm w-full text-[#1a202c] placeholder:text-[#a0aec0]"
                                placeholder="Search all tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-[#f1f5f9] p-1 rounded-2xl border border-[#e2e8f0] shrink-0 overflow-x-auto no-scrollbar max-w-full">
                            {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
                                <button
                                    key={s}
                                    className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${filter === s ? 'bg-white text-[#2447d7] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                    onClick={() => setFilter(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="flex flex-col gap-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div 
                                key={task.id} 
                                ref={el => taskRefs.current[task.id] = el}
                                className={`bg-white rounded-2xl border p-6 flex items-center justify-between gap-6 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group ${
                                    highlightTaskId === task.id 
                                        ? 'border-[#2447d7] ring-4 ring-[#2447d7]/20 shadow-[0_0_0_4px_rgba(36,71,215,0.1)] animate-pulse' 
                                        : 'border-[#edf2f7]'
                                }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${task.type === 'Call' ? 'bg-[#ebf0ff] text-[#2447d7]' : task.type === 'Document' ? 'bg-[#fff7ed] text-[#ea580c]' : task.type === 'Promotion' ? 'bg-[#2447d7] text-white' : 'bg-[#f0fdf4] text-[#16a34a]'}`}>
                                        {task.type === 'Call' && <IconPhone />}
                                        {task.type === 'Document' && <IconDoc />}
                                        {task.type === 'Promotion' ? <IconPlus /> : (task.type !== 'Call' && task.type !== 'Document' && <IconMeeting />)}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-[#1a202c]">{task.title}</h3>
                                            {task.isPromotion && <span className="bg-[#2447d7] text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider animate-pulse">Active Promo</span>}
                                            {task.assignedTo === 'Self' && !task.isPromotion ? (
                                                <span className="text-[9px] font-black text-[#a0aec0] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#edf2f7] uppercase tracking-wider whitespace-nowrap">Personal</span>
                                            ) : task.assignedTo && !task.isPromotion ? (
                                                <span className="flex items-center gap-1.5 text-[0.8rem] font-bold text-[#2447d7] bg-[#f0f4ff] px-2.5 py-1 rounded-lg">
                                                    Assignee: {users.find(u => u.id.toString() === task.assignedTo.toString())?.name || task.assignedTo}
                                                </span>
                                            ) : null}
                                            {task.createdBy && task.createdBy !== 'Super Admin' && !task.isPromotion && (
                                                <span className="bg-[#fff7ed] text-[#ea580c] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#ffedd5]">By: {task.createdBy}</span>
                                            )}

                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#718096]">
                                                <IconUser size={14} />
                                                {task.lead || 'Administrative'}
                                            </span>
                                            <span className="text-[12px] font-bold text-[#a0aec0] uppercase tracking-widest">{task.date} • {task.time}</span>
                                            {task.isPromotion && task.fileName && (
                                                <div className="flex items-center gap-3 mt-1 p-2 rounded-lg bg-[#f0f4ff]/50 border border-[#2447d7]/10">
                                                    <IconDoc />
                                                    <span className="text-[11px] font-medium text-[#4a5568]">{task.fileName}</span>
                                                    {task.fileData && (
                                                        <a href={task.fileData} download={task.fileName} className="ml-auto text-[10px] font-black text-[#2447d7] hover:underline uppercase tracking-wider">Download</a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                    {!task.isPromotion && (
                                        <div className="flex items-center gap-6">
                                            <select 
                                                className={`p-[10px_20px] rounded-xl text-sm font-bold border-2 outline-none transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:12px] pr-10
                                                    ${task.status === 'Completed' ? 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]' : task.status === 'In Progress' ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]' : 'bg-[#f8fafc] text-[#718096] border-[#edf2f7]'}
                                                `}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22${task.status === 'Completed' ? '%23166534' : task.status === 'In Progress' ? '%231d4ed8' : '%23718096'}%22%20stroke-width%3D%223%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E")` }}
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                            >
                                                <option>Pending</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                            </select>
                                            {canManageTask(task, user) && (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(task)}
                                                        className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-[#718096] flex items-center justify-center hover:bg-[#eef2ff] hover:text-[#2447d7] transition-all group/btn"
                                                        title="Edit Task"
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-[#718096] flex items-center justify-center hover:bg-[#fff5f5] hover:text-[#e53e3e] transition-all group/btn"
                                                        title="Delete Task"
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center bg-[#fdfdfd] rounded-[32px] border-2 border-dashed border-[#edf2f7]">
                            <IconCalendar size={48} className="mx-auto text-[#cbd5e0] mb-4" />
                            <p className="text-lg font-bold text-[#718096]">No tasks found</p>
                        </div>
                    )}
                </div>
            ) : (
                renderCalendar()
            )}
        </div>
    );
};

/* ── ICONS ── */
const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconDoc = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);
const IconMeeting = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconList = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);
const IconCalendar = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconUser = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);


export default SuperAdminTasks;
