"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { lendersApi } from "@/lib/api";

const MOCK_PROMOS = [
  { id:1, lender:"Funding Circle", name:"1% Fee Rebate",         offer:"Bonus commission on all asset finance deals this month.",                    expiry:"15 May 2026", active:true  },
  { id:2, lender:"Allica Bank",    name:"Fast-Track Processing",  offer:"Guaranteed 24-hour turnaround on commercial mortgage apps.",                 expiry:"22 Apr 2026", active:true  },
  { id:3, lender:"Westpac",        name:"Zero Arrangement Fee",   offer:"No arrangement fee on SME loans £100k–£500k this month.",                   expiry:"28 Apr 2026", active:true  },
  { id:4, lender:"Lloyds Bank",    name:"0.25% Rate Cut",         offer:"All new business expansion loans over £250k.",                               expiry:"10 Apr 2026", active:false },
  { id:5, lender:"ANZ Bank",       name:"Q1 Cashback",            offer:"$2000 cashback for first home owners on settlements over $400k.",            expiry:"30 Jun 2026", active:true  },
];

export default function LendersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState<string|null>(null);
  const [promoSearch, setPromoSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["lenders"],
    queryFn: () => lendersApi.list().then((r) => r.data),
    retry: false,
  });

  const lenders: any[] = Array.isArray(data) ? data : [];
  const filtered = lenders.filter((l) =>
    (statusFilter === "All" || l.status === statusFilter) &&
    (!search || l.name.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredPromos = MOCK_PROMOS.filter((p) =>
    !promoSearch || p.lender.toLowerCase().includes(promoSearch.toLowerCase()) || p.name.toLowerCase().includes(promoSearch.toLowerCase())
  );

  const getInitials = (name: string) => name.split(" ").slice(0,2).map((w:string)=>w[0]).join("").toUpperCase();

  return (
    <div style={{ display:"grid", gridTemplateColumns:"480px 1fr 300px", gap:12, height:"100vh", padding:12, flexGrow:1, minWidth:0 }}>

      {/* Left panel: Add Lender form */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 1px 2px rgba(0,0,0,.05)" }}>
        <div style={{ padding:"0 16px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:48 }}>
          <h2 style={{ fontSize:9, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Add New Lender</h2>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#94a3b8" }} />
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
          {[["Lender Name *","text","e.g. ANZ Bank"],["Trading Name","text","Trading as..."],["Account Manager","text","Full name"],["Lender Email","email","contact@lender.com"]].map(([label,type,ph])=>(
            <div key={label as string}>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>{label}</label>
              <input type={type as string} placeholder={ph as string} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10.5, fontWeight:500, outline:"none", color:"#1e293b" }} />
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Status</label>
              <select style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Type</label>
              <select style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                <option>Bank</option><option>Non-Bank</option><option>Credit Union</option>
              </select>
            </div>
          </div>
          <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:10, marginTop:4 }}>
            <p style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#cbd5e1", marginBottom:7, display:"flex", alignItems:"center", gap:5 }}>
              <i className="fa-solid fa-location-dot" style={{ fontSize:8 }} /> Address
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Trading Address</label>
                <input placeholder="123 Main St, Sydney NSW 2000" style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10, fontWeight:500, outline:"none", color:"#1e293b" }} />
              </div>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Registered Address</label>
                <input placeholder="Same as trading or different..." style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10, fontWeight:500, outline:"none", color:"#1e293b" }} />
              </div>
            </div>
          </div>
          <div>
            <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Notes</label>
            <textarea rows={3} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10, fontWeight:500, outline:"none", resize:"none" }} />
          </div>
          <button style={{ width:"100%", padding:"10px 0", background:"#0f172a", color:"#fff", border:"none", borderRadius:8, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", cursor:"pointer" }}>
            <i className="fa-solid fa-plus" style={{ marginRight:6 }} />Add Lender
          </button>
        </div>
      </div>

      {/* Middle panel: Lender table */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 1px 2px rgba(0,0,0,.05)" }}>
        {/* Dark header */}
        <div style={{ padding:"0 16px", background:"#0f172a", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", gap:12, minHeight:48 }}>
          <h2 style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#fff", flexShrink:0 }}>Lender Database</h2>
          <span style={{ fontSize:8, fontWeight:700, color:"#64748b", fontFamily:"monospace", flexShrink:0 }}>{filtered.length} records</span>
          <div style={{ position:"relative", flex:1, maxWidth:300 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:8, color:"rgba(255,255,255,.3)" }} />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search lenders..." style={{ width:"100%", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"5px 10px 5px 26px", fontSize:9, fontWeight:600, color:"#fff", outline:"none" }} />
          </div>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"5px 22px 5px 9px", fontSize:9, fontWeight:700, color:"#d1d5db", outline:"none" }}>
            <option value="All">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
          </select>
          <div style={{ display:"flex", alignItems:"center", gap:0, borderLeft:"1px solid rgba(255,255,255,.1)", paddingLeft:12, marginLeft:4 }}>
            {[["Total",lenders.length,"#fff"],["Active",lenders.filter(l=>l.status==="Active").length,"#4ade80"],["Inactive",lenders.filter(l=>l.status==="Inactive").length,"#fca5a5"]].map(([label,val,color])=>(
              <div key={label as string} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 10px", borderRight:"1px solid rgba(255,255,255,.1)" }}>
                <span style={{ fontSize:13, fontWeight:900, color:color as string }}>{val}</span>
                <span style={{ fontSize:7, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".05em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ flex:1, overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead style={{ position:"sticky", top:0, background:"#f8fafc", borderBottom:"1px solid #e2e8f0", zIndex:10 }}>
              <tr>
                <th style={{ padding:"6px 12px", width:32 }} />
                {["Lender","Account Manager","Categories","Status"].map((h)=>(
                  <th key={h} style={{ padding:"6px 12px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left" }}>{h}</th>
                ))}
                <th style={{ padding:"6px 12px", width:24 }} />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>No lenders found</td></tr>
              ) : filtered.map((l:any) => {
                const isOpen = expanded === l.id;
                return (
                  <>
                    <tr key={l.id} onClick={()=>setExpanded(isOpen?null:l.id)} style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", background:isOpen?"#f8fafc":"#fff", transition:"background .1s" }}>
                      <td style={{ padding:"8px 12px", textAlign:"center" }}>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color:isOpen?"#4f46e5":"#cbd5e1", transform:isOpen?"rotate(90deg)":"none", transition:".2s" }} />
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:28, height:28, borderRadius:8, background:"#334155", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:900, flexShrink:0 }}>{getInitials(l.name)}</div>
                          <div>
                            <div style={{ fontSize:10, fontWeight:700, color:"#0f172a" }}>{l.name}</div>
                            <div style={{ fontSize:7, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".03em" }}>{l.tradingName || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ fontSize:10, fontWeight:600, color:"#374151" }}>{l.accountManager || "—"}</div>
                        <div style={{ fontSize:7, color:"#94a3b8", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:120 }}>{l.managerEmail || ""}</div>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {(l.categories||[]).slice(0,2).map((c:string)=>(
                            <span key={c} style={{ display:"inline-flex", alignItems:"center", padding:"3px 8px", background:"#f1f5f9", borderRadius:6, fontSize:9, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".03em" }}>{c}</span>
                          ))}
                          {(l.categories||[]).length > 2 && <span style={{ fontSize:9, fontWeight:700, color:"#94a3b8" }}>+{l.categories.length-2}</span>}
                        </div>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 7px", borderRadius:99, fontSize:8, fontWeight:800, textTransform:"uppercase", background:l.status==="Active"?"#dcfce7":"#f1f5f9", color:l.status==="Active"?"#15803d":"#94a3b8", border:`1px solid ${l.status==="Active"?"#bbf7d0":"#e2e8f0"}` }}>
                          <i className={`fa-solid ${l.status==="Active"?"fa-circle-check":"fa-circle-xmark"}`} style={{ marginRight:4, fontSize:7 }} />{l.status}
                        </span>
                      </td>
                      <td style={{ padding:"8px 12px", textAlign:"center" }}>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color:"#cbd5e1" }} />
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={l.id+"_detail"} style={{ background:"#f8fafc", borderBottom:"2px solid #e2e8f0" }}>
                        <td colSpan={6} style={{ padding:"16px 24px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Contact</div>
                              <div style={{ fontSize:9, fontWeight:700, color:"#0f172a" }}>{l.email || "—"}</div>
                              <div style={{ fontSize:9, fontWeight:700, color:"#0f172a", marginTop:4 }}>{l.accountManager || "—"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Address</div>
                              <div style={{ fontSize:9, fontWeight:600, color:"#374151", lineHeight:1.5 }}>{l.tradingAddress || "—"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:8 }}>Notes</div>
                              <div style={{ fontSize:9, color:"#64748b", lineHeight:1.5 }}>{l.notes || "—"}</div>
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
        <div style={{ padding:"12px 16px", borderTop:"1px solid #f8fafc", background:"rgba(248,250,252,.3)", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em" }}>Showing {filtered.length} lenders</span>
          <button style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", background:"none", border:"none", cursor:"pointer" }}>
            <i className="fa-solid fa-download" style={{ marginRight:4 }} />Export CSV
          </button>
        </div>
      </div>

      {/* Right panel: Active Promotions */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 1px 2px rgba(0,0,0,.05)" }}>
        <div style={{ padding:"0 16px", background:"#1e293b", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", gap:8, minHeight:48 }}>
          <i className="fa-solid fa-bullhorn" style={{ color:"#94a3b8", fontSize:11 }} />
          <h2 style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#fff", flex:1 }}>Active Promotions</h2>
          <span style={{ fontSize:8, fontWeight:700, color:"#64748b", fontFamily:"monospace" }}>{filteredPromos.filter(p=>p.active).length}</span>
        </div>
        {/* Search */}
        <div style={{ padding:"8px 12px", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ position:"relative" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", fontSize:8, color:"#94a3b8" }} />
            <input value={promoSearch} onChange={(e)=>setPromoSearch(e.target.value)} placeholder="Search promotions..." style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:7, padding:"5px 10px 5px 24px", fontSize:9, fontWeight:600, color:"#1e293b", outline:"none" }} />
          </div>
        </div>
        {/* Promo list */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {filteredPromos.map((p) => (
            <div key={p.id} style={{ padding:"10px 14px", borderBottom:"1px solid #f8fafc", opacity:p.active?1:0.55, transition:"background .15s", cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <span style={{ background:p.active?"#10b981":"#ef4444", color:"#fff", padding:"1px 5px", borderRadius:4, fontSize:7, fontWeight:800, textTransform:"uppercase" }}>{p.active?"Active":"Expired"}</span>
                <span style={{ fontSize:7, fontWeight:700, color:"#94a3b8" }}>Exp: {p.expiry}</span>
              </div>
              <div style={{ fontSize:10, fontWeight:800, color:"#0f172a", marginBottom:3 }}>{p.lender}: {p.name}</div>
              <div style={{ fontSize:8, color:"#64748b", lineHeight:1.5 }}>{p.offer}</div>
              <div style={{ marginTop:6, paddingTop:6, borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <button style={{ fontSize:8, fontWeight:700, color:"#4f46e5", background:"#f1f5f9", border:"none", borderRadius:6, padding:"3px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                  <i className="fa-solid fa-file-pdf" /> View Doc
                </button>
                {p.active && <span style={{ fontSize:8, fontWeight:700, color:"#10b981", fontStyle:"italic" }}>Auto-Applied</span>}
              </div>
            </div>
          ))}
          {filteredPromos.length === 0 && (
            <div style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>No promotions found</div>
          )}
        </div>
        <div style={{ padding:"8px 12px", borderTop:"1px solid #f8fafc", background:"rgba(248,250,252,.3)" }}>
          <span style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em" }}>{filteredPromos.filter(p=>p.active).length} active promotions</span>
        </div>
      </div>
    </div>
  );
}
