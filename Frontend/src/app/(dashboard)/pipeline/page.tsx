"use client";
import { useState } from "react";
import Link from "next/link";

const STAGES = [
  { key:"collecting", label:"Doc Collection", icon:"fa-solid fa-file-arrow-up", headerBg:"#f1f5f9", headerColor:"#475569", bodyBg:"#f8fafc" },
  { key:"verified",   label:"Doc Verified",   icon:"fa-solid fa-file-circle-check", headerBg:"#eff6ff", headerColor:"#1d4ed8", bodyBg:"#f0f7ff" },
  { key:"lender",     label:"Lender Selection",icon:"fa-solid fa-building-columns", headerBg:"#f5f3ff", headerColor:"#6d28d9", bodyBg:"#f6f4ff" },
  { key:"approved",   label:"Loan Approved",  icon:"fa-solid fa-circle-check", headerBg:"#f0fdf4", headerColor:"#166534", bodyBg:"#f2fdf5" },
  { key:"rejected",   label:"Rejected",       icon:"fa-solid fa-circle-xmark", headerBg:"#fef2f2", headerColor:"#b91c1c", bodyBg:"#fff5f5" },
];

const MOCK_LEADS = [
  { id:"AL-902", name:"Robert Miller",  business:"Miller Logistics", amount:"£12,000", agent:"Sarah Jenkins", stage:"collecting", priority:"hot",  days:2 },
  { id:"AF-550", name:"Priya Singh",    business:"Singh Media",      amount:"£450,000",agent:"James White",   stage:"collecting", priority:"warm", days:1 },
  { id:"AF-027", name:"John Smith",     business:"ABC Corp",         amount:"£55,000", agent:"Sarah Jenkins", stage:"lender",     priority:"hot",  days:4 },
  { id:"AL-339", name:"Mike Johnson",   business:"Urban Scaffolding",amount:"£85,000", agent:"James White",   stage:"verified",   priority:"cool", days:5 },
  { id:"AF-001", name:"David Brown",    business:"Miller Logistics", amount:"£150,000",agent:"Sarah Jenkins", stage:"approved",   priority:"hot",  days:12 },
  { id:"AL-209", name:"Kevin Malone",   business:"Malone Paints",    amount:"£25,000", agent:"James White",   stage:"rejected",   priority:"cool", days:1 },
];

const PRIO_STYLE: Record<string,{bg:string,color:string}> = {
  hot:  { bg:"#fee2e2", color:"#ef4444" },
  warm: { bg:"#fef3c7", color:"#f59e0b" },
  cool: { bg:"#dcfce7", color:"#22c55e" },
};

export default function PipelinePage() {
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filtered = leads.filter((l) =>
    (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase())) &&
    (!priorityFilter || l.priority === priorityFilter)
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", flexGrow:1, minWidth:0, background:"#fafafa" }}>

      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <i className="fa-solid fa-diagram-project" style={{ color:"#4f46e5", fontSize:16 }} />
          <h1 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Loan Pipeline Board</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ position:"relative" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:9, color:"#94a3b8" }} />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search case or client..." style={{ background:"#fff", border:"1px solid #cbd5e1", borderRadius:7, padding:"6px 12px 6px 28px", fontSize:10, fontWeight:600, color:"#1e293b", outline:"none", width:200 }} />
          </div>
          <select value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value)} style={{ background:"#fff", border:"1px solid #cbd5e1", borderRadius:7, padding:"6px 12px", fontSize:10, fontWeight:600, color:"#1e293b", outline:"none" }}>
            <option value="">All Lead Temp</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
          </select>
          <Link href="/leads/register" style={{ background:"#0f172a", color:"#fff", textDecoration:"none", borderRadius:8, padding:"6px 14px", fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", display:"flex", alignItems:"center", gap:6 }}>
            <i className="fa-solid fa-plus" style={{ fontSize:8 }} /> Add Lead
          </Link>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ flex:1, overflowX:"auto", overflowY:"hidden", padding:16, display:"flex", gap:12, alignItems:"flex-start" }}>
        {STAGES.map((stage) => {
          const stageLeads = filtered.filter((l) => l.stage === stage.key);
          return (
            <div key={stage.key} style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:8, height:"100%" }}>
              {/* Stage header */}
              <div style={{ borderRadius:"10px 10px 0 0", padding:"10px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, background:stage.headerBg }}>
                <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", display:"flex", alignItems:"center", gap:7, color:stage.headerColor }}>
                  <i className={stage.icon} /> {stage.label}
                </span>
                <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:20, background:"rgba(255,255,255,.55)", color:stage.headerColor }}>{stageLeads.length}</span>
              </div>
              {/* Stage body */}
              <div style={{ flex:1, borderRadius:"0 0 10px 10px", padding:8, overflowY:"auto", display:"flex", flexDirection:"column", gap:7, minHeight:200, background:stage.bodyBg }}>
                {stageLeads.map((lead) => {
                  const ps = PRIO_STYLE[lead.priority];
                  return (
                    <div key={lead.id} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:9, padding:"8px 9px", cursor:"pointer", transition:"box-shadow .15s" }}>
                      <div style={{ background:"#f8fafc", margin:"-8px -9px 8px", padding:"6px 12px", borderRadius:"9px 9px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:12, fontWeight:900, color:"#0f172a" }}>{lead.amount}</span>
                        <span style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" }}>{lead.id}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                        <div style={{ fontSize:10, fontWeight:900, color:"#0f172a" }}>{lead.name}</div>
                        <div style={{ width:3, height:3, borderRadius:"50%", background:"#e2e8f0" }} />
                        <div style={{ fontSize:9, fontWeight:900, color:"#4f46e5", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.business}</div>
                      </div>
                      <div style={{ marginBottom:8, padding:"4px 8px", background:"rgba(248,250,252,.5)", borderLeft:"2px solid #e2e8f0" }}>
                        <div style={{ fontSize:9, color:"#64748b", fontStyle:"italic" }}>Agent: {lead.agent}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #f8fafc", paddingTop:6 }}>
                        <span style={{ fontSize:7.5, fontWeight:900, textTransform:"uppercase", padding:"2px 6px", borderRadius:4, background:ps.bg, color:ps.color }}>{lead.priority}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <Link href={`/pipeline/${lead.id}`} style={{ height:20, padding:"0 10px", background:"#f8fafc", color:"#4f46e5", borderRadius:99, display:"flex", alignItems:"center", gap:4, fontSize:7, fontWeight:900, textTransform:"uppercase", textDecoration:"none", border:"1px solid #e0e7ff" }}>
                            <i className="fa-solid fa-eye" style={{ fontSize:8 }} /> VIEW
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {stageLeads.length === 0 && (
                  <div style={{ textAlign:"center", padding:"20px 0", fontSize:9, color:"#cbd5e1" }}>No leads</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
