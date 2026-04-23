"use client";
import { useState } from "react";
import Link from "next/link";

const MOCK_LEADS = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: [["James","Oliver","Henry","Liam","Noah"],["Smith","Johnson","Williams","Brown","Jones"]]
    .map(a => a[Math.floor(Math.random()*a.length)]).join(" "),
  status: ["hot","warm","cool"][Math.floor(Math.random()*3)] as "hot"|"warm"|"cool",
  loanAmt: (Math.floor(Math.random()*750)+50)*1000,
  bizName: ["Solar Experts","Retail Hub","Tech Solutions","Global Log","Urban Cafe"][Math.floor(Math.random()*5)] + " " + (i+101),
}));

const STATUS_STYLE = {
  hot:  { bg:"#fee2e2", color:"#b91c1c", border:"#fecaca", icon:"fa-fire" },
  warm: { bg:"#fef3c7", color:"#b45309", border:"#fde68a", icon:"fa-bolt" },
  cool: { bg:"#dbeafe", color:"#1d4ed8", border:"#bfdbfe", icon:"fa-snowflake" },
};

export function LeadPortfolioCard({ stats }: { stats?: any }) {
  const [filter, setFilter] = useState<"all"|"hot"|"warm"|"cool">("all");

  const visible = (filter === "all" ? MOCK_LEADS : MOCK_LEADS.filter(l => l.status === filter)).slice(0, 10);

  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280 }}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(248,250,252,.5)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-list-check" style={{ color:"#fff", fontSize:10 }} />
          </div>
          <h3 style={{ fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Lead Portfolio</h3>
        </div>
        <div style={{ display:"flex", background:"#fff", border:"1px solid #e2e8f0", boxShadow:"0 1px 3px rgba(0,0,0,.05)", borderRadius:8, padding:2 }}>
          {(["all","hot","warm","cool"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"2px 6px", fontSize:7, fontWeight:900, textTransform:"uppercase", letterSpacing:".05em", borderRadius:6, border:"none", cursor:"pointer", background: filter===f?"#0f172a":"transparent", color: filter===f?"#fff": f==="hot"?"#dc2626":f==="warm"?"#d97706":f==="cool"?"#2563eb":"#475569", transition:"all .15s" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"0 12px 4px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #f8fafc" }}>
              <th style={{ width:"60%", paddingBottom:8, fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left" }}>Client</th>
              <th style={{ width:"20%", paddingBottom:8, fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"center" }}>Status</th>
              <th style={{ width:"20%", paddingBottom:8, fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"right" }}>#</th>
            </tr>
          </thead>
        </table>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"0 12px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
          <tbody>
            {visible.map(l => {
              const ss = STATUS_STYLE[l.status];
              return (
                <tr key={l.id} onClick={() => window.location.href=`/pipeline/AF-${String(l.id).padStart(3,"0")}`} style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer" }}>
                  <td style={{ width:"60%", padding:"10px 0" }}>
                    <div style={{ fontSize:9, fontWeight:900, color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</div>
                    <div style={{ fontSize:7, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".03em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.bizName}</div>
                  </td>
                  <td style={{ width:"20%", padding:"10px 0", textAlign:"center" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:2, padding:"1px 4px", borderRadius:4, fontSize:6, fontWeight:900, textTransform:"uppercase", background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>
                      <i className={`fa-solid ${ss.icon}`} style={{ fontSize:6 }} /> {l.status}
                    </span>
                  </td>
                  <td style={{ width:"20%", padding:"10px 0", textAlign:"right" }}>
                    <div style={{ fontSize:8, fontWeight:900, color:"#0f172a" }}>£{(l.loanAmt/1000).toFixed(0)}k</div>
                    <div style={{ fontSize:6, fontWeight:700, color:"#94a3b8" }}>#{String(l.id).padStart(3,"0")}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
