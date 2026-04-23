"use client";
import { useState } from "react";

const TABS = ["analytics","logs","leads"] as const;
type Tab = typeof TABS[number];

const LOGS = [
  { id:1, ts:"2026-04-16 13:14:02", user:"system_admin", role:"admin",           category:"Auth",     action:"Failed Login Attempt", status:"Audit",       details:"Five consecutive failed attempts for user: sarah_j. Lockout triggered." },
  { id:2, ts:"2026-04-16 13:05:44", user:"sarah_j",      role:"tele_agent",      category:"Lead",     action:"Update",               status:"Operational", details:"Changed lead #8452 status from 'Contacted' to 'Processing'" },
  { id:3, ts:"2026-04-16 12:54:10", user:"m_thorne",     role:"account_manager", category:"Document", action:"Delete",               status:"Audit",       details:"Deleted document 'AML_Policy_Old.pdf' from Vault." },
  { id:4, ts:"2026-04-16 12:22:05", user:"e_chen",       role:"tele_agent",      category:"Auth",     action:"Login",                status:"Operational", details:"Successful authentication via Single Sign-On." },
  { id:5, ts:"2026-04-16 09:30:15", user:"system_admin", role:"admin",           category:"System",   action:"Update",               status:"Operational", details:"System configuration updated. SMTP mail handler tweaked." },
  { id:6, ts:"2026-04-16 09:30:15", user:"d_wallace",    role:"team_leader",     category:"Lead",     action:"Create",               status:"Operational", details:"Created new lead #8453 (Tom Haverford via direct entry)" },
];

const ROLE_BADGE: Record<string,{bg:string,color:string,border:string}> = {
  admin:           { bg:"#f1f5f9", color:"#334155", border:"#cbd5e1" },
  tele_agent:      { bg:"#eef2ff", color:"#4338ca", border:"#c7d2fe" },
  account_manager: { bg:"#ecfdf5", color:"#065f46", border:"#a7f3d0" },
  team_leader:     { bg:"#f5f3ff", color:"#4c1d95", border:"#ddd6fe" },
};

export default function ReportsPage() {
  const [tab, setTab] = useState<Tab>("analytics");
  const [expanded, setExpanded] = useState<number|null>(null);
  const [logSearch, setLogSearch] = useState("");

  const filteredLogs = LOGS.filter((l) =>
    !logSearch || l.user.includes(logSearch.toLowerCase()) || l.action.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", flexGrow:1, minWidth:0, background:"#fafafa" }}>

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 24px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, background:"#eef2ff", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-chart-line" style={{ color:"#4f46e5", fontSize:18 }} />
            </div>
            <div>
              <h1 style={{ fontSize:14, fontWeight:900, color:"#0f172a", letterSpacing:"-.01em" }}>System Intelligence</h1>
              <p style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginTop:2 }}>Performance & Operations Audit</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" }}>Period:</span>
            <select style={{ background:"#f8fafc", border:"1px solid #cbd5e1", borderRadius:6, padding:"6px 12px", fontSize:10, fontWeight:600, color:"#1e293b", outline:"none" }}>
              <option>Last 30 Days</option><option>This Quarter</option><option>Year to Date</option>
            </select>
            <button style={{ background:"#0f172a", color:"#fff", border:"none", borderRadius:8, padding:"6px 16px", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em", cursor:"pointer" }}>Apply</button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex", gap:0 }}>
          {[["analytics","fa-chart-bar","Analytics"],["logs","fa-shield-halved","Audit Logs"],["leads","fa-table","Lead Intelligence"]].map(([key,icon,label])=>(
            <button key={key} onClick={()=>setTab(key as Tab)} style={{ padding:"8px 16px", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:tab===key?"#0f172a":"#64748b", borderBottom:`2px solid ${tab===key?"#0f172a":"transparent"}`, cursor:"pointer", background:"none", border:"none", display:"flex", alignItems:"center", gap:6 }}>
              <i className={`fa-solid ${icon}`} style={{ fontSize:10 }} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 6px -1px rgba(0,0,0,0.02)" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <i className="fa-solid fa-headset" style={{ color:"#4338ca", fontSize:12 }} />
                  </div>
                  <h3 style={{ fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".1em" }}>Tele Agent Performance</h3>
                </div>
                <select style={{ background:"#f8fafc", border:"1px solid #cbd5e1", borderRadius:6, padding:"5px 12px", fontSize:10, fontWeight:600, color:"#1e293b", outline:"none" }}>
                  <option>Tele Agent</option><option>Account Manager</option><option>Team Leader</option>
                </select>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                    <tr>
                      {["Rank","Agent Name","Total Leads","Converted","Conv. Rate","Total Value"].map((h)=>(
                        <th key={h} style={{ padding:"10px 16px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".08em", textAlign:"left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank:1, name:"Sarah Jenkins",  role:"Senior Broker",  leads:458, converted:142, conv:31, value:"$54.2M" },
                      { rank:2, name:"Marcus Thorne",  role:"Broker",         leads:412, converted:115, conv:27, value:"$41.8M" },
                      { rank:3, name:"Emily Chen",     role:"Broker",         leads:389, converted:102, conv:26, value:"$36.5M" },
                      { rank:4, name:"David Wallace",  role:"Junior Broker",  leads:310, converted:78,  conv:25, value:"$29.1M" },
                    ].map((row) => (
                      <tr key={row.rank} style={{ borderBottom:"1px solid #f1f5f9" }}>
                        <td style={{ padding:"12px 16px", textAlign:"center" }}>
                          <span style={{ fontWeight:900, fontSize:14, color:row.rank===1?"#f59e0b":row.rank===2?"#94a3b8":row.rank===3?"#b45309":"#cbd5e1" }}>{row.rank}</span>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ fontSize:10, fontWeight:700, color:"#0f172a" }}>{row.name}</div>
                          <div style={{ fontSize:8, color:"#94a3b8", textTransform:"uppercase", marginTop:2 }}>{row.role}</div>
                        </td>
                        <td style={{ padding:"12px 16px", fontSize:10, fontWeight:700, color:"#4338ca" }}>{row.leads}</td>
                        <td style={{ padding:"12px 16px", fontSize:10, fontWeight:700, color:"#16a34a" }}>{row.converted}</td>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:64, height:6, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
                              <div style={{ width:`${row.conv}%`, height:"100%", background:"#6366f1", borderRadius:99 }} />
                            </div>
                            <span style={{ fontSize:9, fontWeight:700, color:"#374151" }}>{row.conv}%</span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 16px", fontSize:10, fontWeight:700, color:"#0f172a" }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {tab === "logs" && (
          <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"12px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:12, background:"rgba(248,250,252,.5)" }}>
                <div style={{ position:"relative", flex:1 }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:10, color:"#94a3b8" }} />
                  <input value={logSearch} onChange={(e)=>setLogSearch(e.target.value)} placeholder="Search by user or action..." style={{ width:"100%", background:"#fff", border:"1px solid #cbd5e1", borderRadius:6, padding:"6px 12px 6px 30px", fontSize:10, fontWeight:600, color:"#1e293b", outline:"none" }} />
                </div>
                {["All Users","All Actions","All"].map((p)=>(
                  <select key={p} style={{ background:"#fff", border:"1px solid #cbd5e1", borderRadius:6, padding:"6px 12px", fontSize:10, fontWeight:600, color:"#1e293b", outline:"none", width:130 }}>
                    <option>{p}</option>
                  </select>
                ))}
              </div>
              <div style={{ flex:1, overflowY:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead style={{ position:"sticky", top:0, background:"#fff", boxShadow:"0 1px 2px rgba(0,0,0,0.05)", zIndex:10 }}>
                    <tr>
                      <th style={{ width:32 }} />
                      {["Timestamp","User","Role","Category","Action","Status"].map((h)=>(
                        <th key={h} style={{ padding:"10px 16px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => {
                      const rb = ROLE_BADGE[log.role] ?? ROLE_BADGE["admin"];
                      const isOpen = expanded === log.id;
                      return (
                        <>
                          <tr key={log.id} onClick={()=>setExpanded(isOpen?null:log.id)} style={{ cursor:"pointer", borderBottom:"1px solid #f1f5f9" }}>
                            <td style={{ padding:"12px 16px", textAlign:"center" }}>
                              <i className="fa-solid fa-chevron-right" style={{ fontSize:8, color:isOpen?"#4f46e5":"#94a3b8", transform:isOpen?"rotate(90deg)":"none", transition:".2s" }} />
                            </td>
                            <td style={{ padding:"12px 16px", fontFamily:"monospace", fontSize:10, color:"#64748b" }}>{log.ts}</td>
                            <td style={{ padding:"12px 16px", fontSize:10, fontWeight:700, color:"#374151" }}>@{log.user}</td>
                            <td style={{ padding:"12px 16px" }}>
                              <span style={{ padding:"2px 7px", borderRadius:4, fontSize:8, fontWeight:700, background:rb.bg, color:rb.color, border:`1px solid ${rb.border}` }}>{log.role.replace("_"," ")}</span>
                            </td>
                            <td style={{ padding:"12px 16px" }}>
                              <span style={{ padding:"2px 6px", borderRadius:4, fontSize:8, fontWeight:700, background:"#f1f5f9", color:"#475569" }}>{log.category}</span>
                            </td>
                            <td style={{ padding:"12px 16px", fontSize:10, fontWeight:500, color:"#374151", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.action}</td>
                            <td style={{ padding:"12px 16px" }}>
                              {log.status === "Audit" ? (
                                <span style={{ background:"#fee2e2", color:"#b91c1c", padding:"2px 6px", borderRadius:4, fontSize:8, fontWeight:700 }}>
                                  <i className="fa-solid fa-magnifying-glass" style={{ marginRight:4 }} />Audit
                                </span>
                              ) : (
                                <span style={{ background:"#e0e7ff", color:"#4338ca", padding:"2px 6px", borderRadius:4, fontSize:8, fontWeight:700 }}>
                                  <i className="fa-solid fa-gear" style={{ marginRight:4 }} />Operational
                                </span>
                              )}
                            </td>
                          </tr>
                          {isOpen && (
                            <tr key={log.id+"_d"} style={{ background:"rgba(248,250,252,.5)", borderBottom:"1px solid #e2e8f0" }}>
                              <td colSpan={7} style={{ padding:"0" }}>
                                <div style={{ padding:"12px 16px", display:"grid", gap:8 }}>
                                  <span style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em" }}>Detailed Event Data</span>
                                  <p style={{ fontSize:10, color:"#374151", fontFamily:"monospace", background:"#f1f5f9", padding:8, borderRadius:6, border:"1px solid #e2e8f0" }}>{log.details}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Lead Intelligence Tab */}
        {tab === "leads" && (
          <div style={{ flex:1, overflowY:"auto", padding:16 }}>
            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden" }}>
              <div style={{ padding:"12px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <h3 style={{ fontSize:11, fontWeight:900, color:"#0f172a", letterSpacing:"-.01em" }}>Lead Intelligence</h3>
                  <p style={{ fontSize:9, color:"#94a3b8", fontWeight:600, marginTop:2 }}>26 records found</p>
                </div>
                <button style={{ background:"#0f172a", color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", fontSize:9, fontWeight:800, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                  <i className="fa-solid fa-file-csv" style={{ fontSize:10 }} /> CSV
                </button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                    <tr>
                      {["Lead Entity","Business Name","Personnel Flow","Application Stage","Lead Status","Amount","Bank","Lender Partner"].map((h)=>(
                        <th key={h} style={{ padding:"10px 12px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id:"AF-028", name:"Minosh Example", initials:"ME", business:"ex ABC", personnel:"Sarah White", ts:"2026-04-09", stage:"Completed", status:"Warm", amount:"3,456", bank:"Starling", lender:"NAB" },
                      { id:"AF-027", name:"ABC Corp",       initials:"A",  business:"ABCD",   personnel:"Cody Lane",   ts:"2026-04-08", stage:"Completed", status:"Warm", amount:"2,345", bank:"—",       lender:"Commonwealth Bank" },
                      { id:"AF-026", name:"Kavi",           initials:"K",  business:"—",      personnel:"Sarah White", ts:"2026-04-07", stage:"Docs Verified", status:"Warm", amount:"£34,567", bank:"—", lender:"—" },
                    ].map((row) => {
                      const stageStyle: Record<string,{bg:string,color:string,border:string}> = {
                        "Completed":     { bg:"#f0fdf4", color:"#166534", border:"#bbf7d0" },
                        "Docs Verified": { bg:"#f0f9ff", color:"#075985", border:"#bae6fd" },
                        "Collecting Docs":{ bg:"#f8fafc", color:"#475569", border:"#cbd5e1" },
                      };
                      const ss = stageStyle[row.stage] ?? stageStyle["Collecting Docs"];
                      return (
                        <tr key={row.id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                          <td style={{ padding:"10px 12px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:30, height:30, borderRadius:"50%", background:"#e0e7ff", color:"#4338ca", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{row.initials}</div>
                              <div>
                                <div style={{ fontSize:11, fontWeight:700, color:"#0f172a" }}>{row.name}</div>
                                <div style={{ fontSize:8, color:"#94a3b8", fontFamily:"monospace" }}>#{row.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"10px 12px", fontSize:10, fontWeight:500, color:"#374151" }}>{row.business}</td>
                          <td style={{ padding:"10px 12px" }}>
                            <div style={{ fontSize:10, fontWeight:600, color:"#374151" }}>{row.personnel}</div>
                            <div style={{ fontSize:8, color:"#94a3b8", fontFamily:"monospace", marginTop:2 }}>{row.ts}</div>
                          </td>
                          <td style={{ padding:"10px 12px" }}>
                            <span style={{ padding:"3px 8px", borderRadius:20, fontSize:8, fontWeight:700, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>{row.stage}</span>
                          </td>
                          <td style={{ padding:"10px 12px" }}>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 6px", borderRadius:20, fontSize:8, fontWeight:700, background:"#fffbeb", color:"#92400e", border:"1px solid #fde68a" }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:"#d97706", display:"inline-block" }} />{row.status}
                            </span>
                          </td>
                          <td style={{ padding:"10px 12px", fontSize:11, fontWeight:700, color:"#0f172a" }}>{row.amount}</td>
                          <td style={{ padding:"10px 12px", fontSize:10, color:"#374151" }}>{row.bank}</td>
                          <td style={{ padding:"10px 12px", fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".03em" }}>{row.lender}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
