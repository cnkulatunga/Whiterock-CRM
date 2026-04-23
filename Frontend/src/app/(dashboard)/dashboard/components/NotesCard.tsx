"use client";
import { useState } from "react";

interface Note { id: number; text: string; date: string; pinned: boolean; highlighted: boolean; }

export function NotesCard() {
  const [notes, setNotes] = useState<Note[]>([
    { id:1, text:"System audit scheduled for Monday morning.", date:"2026-04-09 · 01:54 PM", pinned:true, highlighted:false },
  ]);
  const [input, setInput] = useState("");

  const addNote = () => {
    if (!input.trim()) return;
    const now = new Date();
    setNotes([{ id: Date.now(), text: input.trim(), date: now.toISOString().slice(0,10) + " · " + now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), pinned:false, highlighted:false }, ...notes]);
    setInput("");
  };

  const deleteNote = (id: number) => setNotes(notes.filter(n => n.id !== id));
  const togglePin = (id: number) => setNotes(notes.map(n => n.id===id ? {...n, pinned:!n.pinned} : n));
  const toggleHighlight = (id: number) => setNotes(notes.map(n => n.id===id ? {...n, highlighted:!n.highlighted} : n));

  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280 }}>
      <div style={{ padding:"12px 24px", borderBottom:"1px solid #fde68a", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fefce8" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <i className="fa-solid fa-clipboard-list" style={{ color:"#d97706", fontSize:10 }} />
          <h3 style={{ fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:".05em", color:"#78350f" }}>My Notes</h3>
        </div>
        <button onClick={() => setNotes([])} style={{ fontSize:8, fontWeight:900, textTransform:"uppercase", letterSpacing:".05em", color:"#b45309", background:"none", border:"none", cursor:"pointer" }}>Clear All</button>
      </div>

      <div style={{ flex:1, padding:12, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, background:"rgba(255,253,240,.5)" }}>
        {notes.length === 0 && <p style={{ fontSize:9, color:"#94a3b8", textAlign:"center", padding:"20px 0" }}>No notes yet</p>}
        {notes.map(n => (
          <div key={n.id} style={{ background: n.pinned?"#eff6ff":"#fff", border:`1px solid ${n.pinned?"#dbeafe":"#fde68a"}`, padding:12, borderRadius:12, position:"relative" }} className="group">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {n.pinned && (
                  <span style={{ background:"#dbeafe", color:"#1e40af", fontSize:7, fontWeight:900, padding:"1px 6px", borderRadius:4, display:"flex", alignItems:"center", gap:4 }}>
                    <i className="fa-solid fa-thumbtack" style={{ color:"#f43f5e", fontSize:7 }} /> PINNED
                  </span>
                )}
                <span style={{ fontSize:8, fontWeight:700, color:"rgba(180,83,9,.6)" }}>{n.date}</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => toggleHighlight(n.id)} style={{ background:"none", border:"none", cursor:"pointer", color: n.highlighted?"#f59e0b":"#94a3b8", fontSize:9 }}><i className="fa-solid fa-highlighter" /></button>
                <button onClick={() => togglePin(n.id)} style={{ background:"none", border:"none", cursor:"pointer", color: n.pinned?"#f43f5e":"#94a3b8", fontSize:9 }}><i className="fa-solid fa-thumbtack" /></button>
                <button onClick={() => deleteNote(n.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontSize:9 }}><i className="fa-solid fa-trash-can" /></button>
              </div>
            </div>
            <p style={{ fontSize:10, fontWeight:500, color:"#334155", lineHeight:1.6, background: n.highlighted?"#fef3c7":"transparent", padding: n.highlighted?"2px 4px":"0", borderRadius:4 }}>{n.text}</p>
          </div>
        ))}
      </div>

      <div style={{ padding:12, borderTop:"1px solid #fde68a", display:"flex", gap:8, background:"#fff" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addNote()}
          placeholder="Type a note & press Enter..."
          style={{ flex:1, background:"#fff", border:"1px solid #fde68a", borderRadius:8, padding:"8px 12px", fontSize:10, fontWeight:500, outline:"none" }}
        />
        <button onClick={addNote} style={{ background:"#fbbf24", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:9, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Add</button>
      </div>
    </div>
  );
}
