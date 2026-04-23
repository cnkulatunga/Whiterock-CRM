"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";

const MODULES = [
  { key:"tasks",    label:"Tasks & Followups",  icon:"fa-tasks" },
  { key:"leads",    label:"Lead Management",    icon:"fa-user-group" },
  { key:"pipeline", label:"Loan Pipeline",      icon:"fa-diagram-project" },
  { key:"lenders",  label:"Lender Management",  icon:"fa-hand-holding-dollar" },
  { key:"docs",     label:"Document Vault",     icon:"fa-folder-open" },
  { key:"users",    label:"User Management",    icon:"fa-user-gear" },
  { key:"reports",  label:"Reporting Hub",      icon:"fa-chart-line" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string|null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list().then((r) => r.data),
    retry: false,
  });

  const users: any[] = Array.isArray(data) ? data : (data?.results ?? []);
  const filtered = users.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const ROLE_BADGE: Record<string,{bg:string,color:string}> = {
    "Admin":            { bg:"#eff6ff", color:"#2563eb" },
    "Team Leader":      { bg:"#ecfeff", color:"#0e7490" },
    "Tele Agent":       { bg:"#f0fdf4", color:"#15803d" },
    "Accounts Manager": { bg:"#fef3c7", color:"#92400e" },
  };

  return (
    <div style={{ display:"flex", height:"100vh", flexGrow:1, minWidth:0, background:"#fff" }}>

      {/* Left: Add User form */}
      <div style={{ width:400, background:"#fff", borderRight:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"0 16px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:48 }}>
          <h2 style={{ fontSize:9, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Add New User</h2>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#7c3aed" }} />
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:12, display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:2, display:"block" }}>Full Name *</label>
              <input placeholder="Sarah Collins" style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"5px 9px", fontSize:10, fontWeight:500, outline:"none", color:"#1e293b" }} />
            </div>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:2, display:"block" }}>Designation</label>
              <input placeholder="Senior Broker" style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"5px 9px", fontSize:10, fontWeight:500, outline:"none", color:"#1e293b" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:2, display:"block" }}>Email Address *</label>
            <input type="email" placeholder="sarah@whiterock.com" style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"5px 9px", fontSize:10, fontWeight:500, outline:"none", color:"#1e293b" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:2, display:"block" }}>Role *</label>
              <select style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"5px 9px", fontSize:10, fontWeight:500, outline:"none" }}>
                <option value="">Select Role</option>
                <option>Admin</option><option>Team Leader</option><option>Tele Agent</option><option>Accounts Manager</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:2, display:"block" }}>Status</label>
              <select style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"5px 9px", fontSize:10, fontWeight:500, outline:"none" }}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          {/* Modules */}
          <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:8, marginTop:4 }}>
            <p style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#cbd5e1", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
              <i className="fa-solid fa-puzzle-piece" style={{ fontSize:8 }} /> Modules
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {MODULES.map((m) => (
                <div key={m.key} style={{ background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 8px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <i className={`fa-solid ${m.icon}`} style={{ fontSize:9, color:"#94a3b8" }} />
                    <span style={{ fontSize:9, fontWeight:600, color:"#374151" }}>{m.label}</span>
                  </div>
                  <label style={{ position:"relative", display:"inline-block", width:28, height:15, flexShrink:0 }}>
                    <input type="checkbox" style={{ opacity:0, width:0, height:0, position:"absolute" }} />
                    <span style={{ position:"absolute", cursor:"pointer", top:0, left:0, right:0, bottom:0, background:"#e2e8f0", borderRadius:99, transition:".2s" }} />
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button style={{ width:"100%", padding:"10px 0", background:"#0f172a", color:"#fff", border:"none", borderRadius:8, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", cursor:"pointer", marginTop:4 }}>
            <i className="fa-solid fa-plus" style={{ marginRight:6 }} />Add User
          </button>
        </div>
      </div>

      {/* Right: Team Directory */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"0 16px", background:"#0f172a", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", gap:12, minHeight:48 }}>
          <h2 style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#fff", flexShrink:0 }}>Team Directory</h2>
          <div style={{ position:"relative", flex:1, maxWidth:300 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:8, color:"rgba(255,255,255,.3)" }} />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search team..." style={{ width:"100%", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"5px 10px 5px 26px", fontSize:9, fontWeight:600, color:"#fff", outline:"none" }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:0, borderLeft:"1px solid rgba(255,255,255,.1)", paddingLeft:12, marginLeft:"auto" }}>
            {[["Total",users.length,"#fff"],["Live",users.filter((u:any)=>u.status==="Active").length,"#4ade80"],["Off",users.filter((u:any)=>u.status!=="Active").length,"#fca5a5"]].map(([l,v,c])=>(
              <div key={l as string} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 10px", borderRight:"1px solid rgba(255,255,255,.1)" }}>
                <span style={{ fontSize:13, fontWeight:900, color:c as string }}>{v}</span>
                <span style={{ fontSize:7, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".05em" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead style={{ position:"sticky", top:0, background:"#f8fafc", borderBottom:"1px solid #e2e8f0", zIndex:10 }}>
              <tr>
                <th style={{ width:32, padding:"12px 12px" }} />
                {["Team Member","Role","Permissions","Status","Action"].map((h)=>(
                  <th key={h} style={{ padding:"12px 16px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>No users found</td></tr>
              ) : filtered.map((u:any) => {
                const rb = ROLE_BADGE[u.role] ?? { bg:"#f1f5f9", color:"#475569" };
                const isOpen = expanded === u.id?.toString();
                const activeMods = Object.keys(u.modules||{}).filter((k)=>u.modules[k]);
                return (
                  <>
                    <tr key={u.id} onClick={()=>setExpanded(isOpen?null:u.id?.toString())} style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", background:isOpen?"#f8fafc":"#fff" }}>
                      <td style={{ padding:"10px 12px", textAlign:"center" }}>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize:8, color:isOpen?"#4f46e5":"#cbd5e1", transform:isOpen?"rotate(90deg)":"none", transition:".2s" }} />
                      </td>
                      <td style={{ padding:"10px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:u.avatarBg||"#0f172a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:900, flexShrink:0 }}>{u.avatar}</div>
                          <div>
                            <p style={{ fontSize:10, fontWeight:700, color:"#0f172a" }}>{u.name}</p>
                            <p style={{ fontSize:8, color:"#94a3b8", fontWeight:500 }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 16px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 7px", borderRadius:99, fontSize:8, fontWeight:800, textTransform:"uppercase", background:rb.bg, color:rb.color }}>{u.role}</span>
                      </td>
                      <td style={{ padding:"10px 16px" }}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, maxWidth:200 }}>
                          {activeMods.slice(0,3).map((m)=>(
                            <span key={m} style={{ padding:"1px 6px", background:"#f1f5f9", color:"#64748b", borderRadius:4, fontSize:7, fontWeight:700, textTransform:"uppercase" }}>{m}</span>
                          ))}
                          {activeMods.length > 3 && <span style={{ fontSize:7, fontWeight:700, color:"#94a3b8" }}>+{activeMods.length-3} more</span>}
                        </div>
                      </td>
                      <td style={{ padding:"10px 16px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 7px", borderRadius:99, fontSize:8, fontWeight:800, textTransform:"uppercase", background:u.status==="Active"?"#dcfce7":"#f1f5f9", color:u.status==="Active"?"#15803d":"#94a3b8" }}>{u.status}</span>
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"right" }}>
                        <button style={{ fontSize:10, color:"#94a3b8", background:"none", border:"none", cursor:"pointer", marginRight:8 }}><i className="fa-solid fa-pen" /></button>
                        <button style={{ fontSize:10, color:"#94a3b8", background:"none", border:"none", cursor:"pointer" }}><i className="fa-solid fa-trash" /></button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={u.id+"_detail"} style={{ background:"#f8fafc", borderBottom:"2px solid #e2e8f0" }}>
                        <td colSpan={6} style={{ padding:"16px 24px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Bio</div>
                              <div style={{ fontSize:9, fontWeight:700, color:"#4f46e5" }}>{u.designation||"—"}</div>
                              <div style={{ fontSize:9, fontWeight:700, color:"#0f172a", marginTop:4 }}>{u.joinedDate||"—"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Contact</div>
                              <div style={{ fontSize:9, fontWeight:600, color:"#2563eb" }}>{u.email}</div>
                              <div style={{ fontSize:9, fontWeight:700, color:"#0f172a", marginTop:4 }}>{u.phone||"No Number"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Access</div>
                              {activeMods.map((m)=>(
                                <div key={m} style={{ fontSize:9, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                                  <i className="fa-solid fa-circle" style={{ fontSize:4, color:"#22c55e" }} />
                                  {MODULES.find((x)=>x.key===m)?.label||m}
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Features</div>
                              {Object.keys(u.features||{}).filter((k)=>u.features[k]).map((f)=>(
                                <div key={f} style={{ fontSize:9, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                                  <i className="fa-solid fa-bolt" style={{ fontSize:8, color:"#f59e0b" }} />{f}
                                </div>
                              ))}
                            </div>
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
  );
}
