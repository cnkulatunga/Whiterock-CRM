"use client";
import { useState } from "react";

interface License { type:string; name:string; date:string; remind:string; status:string; statusCls:{bg:string;color:string}; desc:string; }

const INIT: License[] = [
  { type:"License", name:"FCA Regulatory License", date:"24 May 2026", remind:"30", status:"ACTIVE", statusCls:{bg:"#dcfce7",color:"#15803d"}, desc:"Financial Conduct Authority regulatory license for brokerage operations." },
];

export function LicensesCard() {
  const [view, setView] = useState<"list"|"form"|"detail">("list");
  const [licenses, setLicenses] = useState<License[]>(INIT);
  const [selected, setSelected] = useState<License|null>(null);

  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280, overflow:"hidden" }}>

      {/* Header */}
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,.5)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {view !== "list" && (
            <button onClick={() => setView("list")} style={{ width:28, height:28, borderRadius:8, background:"#f1f5f9", color:"#475569", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-arrow-left" style={{ fontSize:10 }} />
            </button>
          )}
          <div style={{ width:32, height:32, borderRadius:8, background:"#dc2626", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-file-shield" style={{ color:"#fff", fontSize:12 }} />
          </div>
          <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>
            {view === "detail" ? selected?.name : "Licenses & Insurance"}
          </h3>
        </div>
        {view === "list" && (
          <button onClick={() => setView("form")} style={{ width:24, height:24, borderRadius:8, background:"#0f172a", color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-plus" style={{ fontSize:10 }} />
          </button>
        )}
        {view === "detail" && (
          <div style={{ display:"flex", gap:6 }}>
            <button style={{ width:28, height:28, borderRadius:8, background:"#0f172a", color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-pen" style={{ fontSize:10 }} />
            </button>
            <button onClick={() => { setLicenses(licenses.filter(l => l.name !== selected?.name)); setView("list"); }} style={{ width:28, height:28, borderRadius:8, background:"#fef2f2", color:"#dc2626", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-trash-can" style={{ fontSize:10 }} />
            </button>
          </div>
        )}
      </div>

      {/* List */}
      {view === "list" && (
        <div style={{ flex:1, padding:16, overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
          {licenses.map((l, i) => (
            <div key={i} onClick={() => { setSelected(l); setView("detail"); }} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:12, cursor:"pointer", transition:"all .15s" }}>
              <div style={{ padding:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div>
                    <h4 style={{ fontSize:10, fontWeight:900, color:"#0f172a" }}>{l.name}</h4>
                    <p style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginTop:2 }}>Expires: {l.date}</p>
                  </div>
                  <span style={{ fontSize:7, fontWeight:900, padding:"2px 6px", borderRadius:4, background:l.statusCls.bg, color:l.statusCls.color }}>{l.status}</span>
                </div>
                <span style={{ fontSize:7, fontWeight:700, color:"#dc2626", textTransform:"uppercase", display:"flex", alignItems:"center", gap:4 }}>
                  <i className="fa-solid fa-bell" style={{ fontSize:7 }} /> Remind {l.remind} days before
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      {view === "form" && (
        <div style={{ flex:1, padding:12, background:"rgba(248,250,252,.5)", display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Type</label>
              <select style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }}>
                <option>License</option><option>Insurance</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Name</label>
              <input placeholder="e.g. FCA License" style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Description</label>
            <textarea rows={2} style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none", resize:"none" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Expiry Date</label>
              <input type="date" style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }} />
            </div>
            <div>
              <label style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", display:"block", marginBottom:2 }}>Remind Period</label>
              <select style={{ width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 8px", fontSize:9, outline:"none" }}>
                <option>30 Days Before</option><option>14 Days Before</option><option>7 Days Before</option>
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"auto" }}>
            <button onClick={() => setView("list")} style={{ flex:1, padding:"8px 0", background:"#dc2626", color:"#fff", border:"none", borderRadius:8, fontSize:8, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Save</button>
            <button onClick={() => setView("list")} style={{ padding:"8px 16px", background:"#e2e8f0", color:"#475569", border:"none", borderRadius:8, fontSize:8, fontWeight:900, textTransform:"uppercase", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Detail */}
      {view === "detail" && selected && (
        <div style={{ flex:1, padding:12, display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:7, fontWeight:900, color:"#dc2626", textTransform:"uppercase", padding:"2px 6px", background:"#fef2f2", borderRadius:4 }}>{selected.type}</span>
            <span style={{ fontSize:7, fontWeight:900, padding:"2px 6px", borderRadius:4, background:selected.statusCls.bg, color:selected.statusCls.color }}>{selected.status}</span>
          </div>
          {[["Expiry Date", selected.date, "fa-calendar-days", "#94a3b8"], ["Reminder", `${selected.remind} days before expiry`, "fa-bell", "#dc2626"], ["Description", selected.desc, "fa-align-left", "#94a3b8"]].map(([label, val, icon, ic]) => (
            <div key={label as string} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:8, background:"#f8fafc", borderRadius:8 }}>
              <i className={`fa-solid ${icon}`} style={{ fontSize:8, color:ic as string, marginTop:2, width:12, flexShrink:0 }} />
              <div>
                <p style={{ fontSize:6.5, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{label}</p>
                <p style={{ fontSize:9, fontWeight:900, color:"#0f172a" }}>{val}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
