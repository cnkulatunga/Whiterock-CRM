"use client";
import { useState } from "react";
import Link from "next/link";

const INIT_FOLLOWUPS = [
  { priority:"Hot",  color:"#b91c1c", bg:"rgba(254,242,242,.5)", border:"#fecaca", time:"Today, 14:30", title:"Johnathan Doe - Contract Signature", desc:"Follow up on the pending expansion loan documentation. Client requires physical copies sent via courier.", client:"Johnathan Doe", id:"#AF-045" },
  { priority:"Warm", color:"#b45309", bg:"rgba(255,251,235,.5)", border:"#fde68a", time:"Tmr, 09:00",   title:"ABC Corp - Valuation Review",         desc:"Discuss the new asset valuation report with the client. Check if they agree with the commercial premises appraisal.", client:"ABC Corp", id:"#AF-022" },
  { priority:"Cool", color:"#475569", bg:"#f8fafc",              border:"#e2e8f0", time:"21 Apr, 11:30",title:"Sarah Smith - Courtesy Call",          desc:"Routine check-in call to ensure client is happy with the current application progress.", client:"Sarah Smith", id:"#AF-018" },
];

export function FollowupsCard() {
  const [view, setView] = useState<"list"|"form"|"detail">("list");
  const [selected, setSelected] = useState<typeof INIT_FOLLOWUPS[0]|null>(null);
  const [followups, setFollowups] = useState(INIT_FOLLOWUPS);

  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280, overflow:"hidden", transition:"all .3s" }}>

      {/* Header: List */}
      {view !== "detail" && (
        <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,.5)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {view === "form" && (
              <button onClick={() => setView("list")} style={{ width:28, height:28, borderRadius:8, background:"#f1f5f9", color:"#475569", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="fa-solid fa-arrow-left" style={{ fontSize:10 }} />
              </button>
            )}
            <div style={{ width:32, height:32, borderRadius:8, background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color:"#fff", fontSize:12 }} />
            </div>
            <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Upcoming Follow-ups</h3>
          </div>
          {view === "list" && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button onClick={() => setView("form")} style={{ width:24, height:24, borderRadius:8, background:"#0f172a", color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="fa-solid fa-plus" style={{ fontSize:10 }} />
              </button>
              <Link href="/tasks" style={{ fontSize:8, fontWeight:900, color:"#4f46e5", textDecoration:"none", textTransform:"uppercase" }}>View All</Link>
            </div>
          )}
        </div>
      )}

      {/* Header: Detail */}
      {view === "detail" && (
        <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,.5)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setView("list")} style={{ width:28, height:28, borderRadius:8, background:"#f1f5f9", color:"#475569", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-arrow-left" style={{ fontSize:10 }} />
            </button>
            <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Follow-up Details</h3>
          </div>
          <button style={{ width:28, height:28, borderRadius:8, background:"#0f172a", color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-pen" style={{ fontSize:10 }} />
          </button>
        </div>
      )}

      {/* List */}
      {view === "list" && (
        <div style={{ flex:1, padding:16, overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
          {followups.map((f, i) => (
            <div key={i} onClick={() => { setSelected(f); setView("detail"); }} style={{ padding:12, background:f.bg, border:`1px solid ${f.border}`, borderRadius:12, cursor:"pointer", transition:"all .15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:8, fontWeight:900, color:f.color, textTransform:"uppercase" }}>Priority: {f.priority}</span>
                <span style={{ fontSize:8, fontWeight:700, color:"#94a3b8" }}>{f.time}</span>
              </div>
              <h4 style={{ fontSize:10, fontWeight:900, color:"#0f172a" }}>{f.title}</h4>
              <p style={{ fontSize:8, color:"#64748b", marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Form */}
      {view === "form" && (
        <div style={{ flex:1, padding:12, background:"rgba(248,250,252,.5)", overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
          <div>
            <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Title / Subject</label>
            <input placeholder="e.g. Contract Signing" style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Priority</label>
              <select style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }}>
                <option>Hot</option><option>Warm</option><option>Cool</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Date & Time</label>
              <input type="datetime-local" style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Remarks</label>
            <textarea rows={2} style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none", resize:"none" }} />
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"auto" }}>
            <button onClick={() => setView("list")} style={{ flex:1, padding:"8px 0", background:"#4f46e5", color:"#fff", border:"none", borderRadius:8, fontSize:8, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Save Activity</button>
            <button onClick={() => setView("list")} style={{ padding:"8px 16px", background:"#e2e8f0", color:"#475569", border:"none", borderRadius:8, fontSize:8, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Detail View */}
      {view === "detail" && selected && (
        <div style={{ flex:1, padding:16, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:7, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", padding:"2px 8px", borderRadius:99, background: selected.priority==="Hot"?"#fee2e2":selected.priority==="Warm"?"#fef3c7":"#f8fafc", color:selected.color }}>{selected.priority}</span>
            <span style={{ fontSize:7, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" }}>{selected.time}</span>
          </div>
          <h2 style={{ fontSize:11, fontWeight:900, color:"#0f172a", lineHeight:1.3, marginBottom:12 }}>{selected.title}</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:10, background:"rgba(248,250,252,.5)", border:"1px solid #f1f5f9", borderRadius:12 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>
                <i className="fa-solid fa-user" style={{ fontSize:10, color:"#94a3b8" }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:6.5, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>Associated Lead</p>
                <p style={{ fontSize:9, fontWeight:900, color:"#0f172a" }}>{selected.client} <span style={{ color:"#4f46e5", marginLeft:4 }}>{selected.id}</span></p>
              </div>
            </div>
            <div style={{ padding:12, background:"#fff", border:"1px solid #f1f5f9", borderRadius:12 }}>
              <p style={{ fontSize:6.5, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                <i className="fa-solid fa-align-left" style={{ color:"#818cf8" }} /> Narrative & Remarks
              </p>
              <p style={{ fontSize:9, fontWeight:700, color:"#475569", lineHeight:1.6 }}>{selected.desc}</p>
            </div>
          </div>
          <div style={{ marginTop:16, paddingTop:12, borderTop:"1px solid #f8fafc", display:"flex", gap:8 }}>
            <button onClick={() => setView("list")} style={{ flex:1, padding:"8px 0", background:"#0f172a", color:"#fff", border:"none", borderRadius:8, fontSize:8, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Complete Task</button>
            <button style={{ padding:"8px 12px", background:"#f1f5f9", color:"#475569", border:"none", borderRadius:8, fontSize:8, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Reschedule</button>
          </div>
        </div>
      )}
    </div>
  );
}
