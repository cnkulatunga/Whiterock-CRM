'use client';

import { useState } from 'react';
import { notes as initialNotes } from '@/data/dummy';

export default function NotesCard() {
    const [notes, setNotes] = useState(initialNotes);
    const [input, setInput] = useState('');

    const addNote = () => {
        if (!input.trim()) return;
        const newNote = {
            id: Date.now(),
            text: input,
            date: new Date().toLocaleString(),
            pinned: false,
            highlighted: false,
        };
        setNotes([newNote, ...notes]);
        setInput('');
    };

    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-6 py-3 border-b border-amber-100 flex items-center justify-between bg-[#fefce8]">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-clipboard-list text-amber-600 text-[10px]"></i>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-900">My Notes</h3>
                </div>
                <button
                    onClick={() => setNotes([])}
                    className="text-[8px] font-black uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2 bg-[#fffdf0]/50">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={`${note.pinned ? 'bg-[#eff6ff] border-[#dbeafe]' : 'bg-white border-slate-100'
                            } border p-3 rounded-xl relative group transition-all`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                {note.pinned && (
                                    <span className="bg-[#dbeafe] text-[#1e40af] text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <i className="fa-solid fa-thumbtack text-[7px] text-rose-500"></i> PINNED
                                    </span>
                                )}
                                <span className="text-[8px] font-bold text-slate-400">{note.date}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-slate-400 hover:text-amber-500">
                                    <i className="fa-solid fa-highlighter text-[9px]"></i>
                                </button>
                                <button className={`text-${note.pinned ? 'rose-500' : 'slate-400'} hover:text-rose-500`}>
                                    <i className="fa-solid fa-thumbtack text-[9px]"></i>
                                </button>
                                <button
                                    onClick={() => setNotes(notes.filter((n) => n.id !== note.id))}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <i className="fa-solid fa-trash-can text-[9px]"></i>
                                </button>
                            </div>
                        </div>
                        <p
                            className={`text-[10px] font-medium leading-relaxed ${note.highlighted ? 'bg-yellow-100' : 'text-slate-700'
                                }`}
                        >
                            {note.text}
                        </p>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-amber-100 flex gap-2 items-center bg-white">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    className="flex-1 bg-white border border-amber-100 rounded-lg px-3 py-2 text-[10px] font-medium focus:outline-none focus:border-amber-400 placeholder:text-slate-300"
                    placeholder="Type a note & press Enter..."
                />
                <button
                    onClick={addNote}
                    className="bg-[#fbbf24] hover:bg-[#f59e0b] text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
