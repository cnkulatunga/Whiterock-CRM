'use client';

import { useState, useEffect } from 'react';
import { notes as initialNotes } from '@/data/dummy';

type Note = { id: number; text: string; date: string; pinned: boolean; highlighted: boolean };

export default function NotesCard() {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetch('/api/notes')
            .then(res => res.ok ? res.json() : Promise.reject('API Error'))
            .then(data => setNotes(Array.isArray(data) ? data : initialNotes))
            .catch(err => {
                console.error('Notes fetch error:', err);
                setNotes(initialNotes);
            });
    }, []);

    const addNote = async () => {
        if (!input.trim()) return;
        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input })
        });
        if (res.ok) {
            const newNote = await res.json();
            setNotes([newNote, ...notes]);
            setInput('');
        }
    };

    const togglePin = async (id: number) => {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        const res = await fetch('/api/notes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, pinned: !note.pinned })
        });
        if (res.ok) {
            setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
        }
    };

    const toggleHighlight = async (id: number) => {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        const res = await fetch('/api/notes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, highlighted: !note.highlighted })
        });
        if (res.ok) {
            setNotes(notes.map(n => n.id === id ? { ...n, highlighted: !n.highlighted } : n));
        }
    };

    const deleteNote = async (id: number) => {
        const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setNotes(notes.filter(n => n.id !== id));
        }
    };

    const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return (
        <div className="glass-card card-h-std flex flex-col">
            <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                <i className="fa-solid fa-clipboard-list" style={{ color: '#fbbf24', fontSize: 13, flexShrink: 0 }}></i>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>My Notes</p>
                    <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Personal Notepad</p>
                </div>
                <button onClick={() => setNotes([])} style={{ fontSize: 10, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '.05em', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Clear All
                </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2 bg-[#fffdf0]/50">
                {sorted.map((note) => (
                    <div key={note.id}
                        className={`${note.pinned ? 'bg-[#eff6ff] border-[#dbeafe]' : note.highlighted ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100'} border p-3 rounded-xl relative group transition-all`}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                {note.pinned && (
                                    <span className="bg-[#dbeafe] text-[#1e40af] text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <i className="fa-solid fa-thumbtack text-[10px] text-rose-500"></i> PINNED
                                    </span>
                                )}
                                <span className="text-[10px] font-bold text-slate-400">{note.date}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => toggleHighlight(note.id)} className={`${note.highlighted ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'} transition-colors`}>
                                    <i className="fa-solid fa-highlighter text-[9px]"></i>
                                </button>
                                <button onClick={() => togglePin(note.id)} className={`${note.pinned ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'} transition-colors`}>
                                    <i className="fa-solid fa-thumbtack text-[9px]"></i>
                                </button>
                                <button onClick={() => deleteNote(note.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <i className="fa-solid fa-trash-can text-[9px]"></i>
                                </button>
                            </div>
                        </div>
                        <p className={`text-[10px] font-medium leading-relaxed ${note.highlighted ? 'bg-yellow-100 px-1 rounded' : 'text-slate-700'}`}>
                            {note.text}
                        </p>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-amber-100 flex gap-2 items-center bg-white">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    className="flex-1 bg-white border border-amber-100 rounded-lg px-3 py-2 text-[10px] font-medium focus:outline-none focus:border-amber-400 placeholder:text-slate-300"
                    placeholder="Type a note & press Enter..." />
                <button onClick={addNote} className="bg-[#fbbf24] hover:bg-[#f59e0b] text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                    Add
                </button>
            </div>
        </div>
    );
}
