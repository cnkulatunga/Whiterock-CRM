"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "@/lib/api";

const CAT_STYLE: Record<string,{icon:string,bg:string,color:string}> = {
  "Knowledge Base": { icon:"fa-solid fa-book-open",       bg:"#dbeafe", color:"#1d4ed8" },
  "Guides":         { icon:"fa-solid fa-map",             bg:"#f3e8ff", color:"#7e22ce" },
  "FAQs":           { icon:"fa-solid fa-circle-question", bg:"#fef3c7", color:"#b45309" },
  "Products":       { icon:"fa-solid fa-box",             bg:"#d1fae5", color:"#065f46" },
  "Policies":       { icon:"fa-solid fa-shield-halved",   bg:"#fee2e2", color:"#b91c1c" },
  "Scripts":        { icon:"fa-solid fa-terminal",        bg:"#f1f5f9", color:"#334155" },
};
const FILE_ICONS: Record<string,{icon:string,bg:string,color:string}> = {
  pdf:  { icon:"fa-solid fa-file-pdf",        bg:"#fee2e2", color:"#dc2626" },
  docx: { icon:"fa-solid fa-file-word",       bg:"#dbeafe", color:"#1d4ed8" },
  xlsx: { icon:"fa-solid fa-file-excel",      bg:"#d1fae5", color:"#059669" },
  png:  { icon:"fa-solid fa-file-image",      bg:"#f3e8ff", color:"#7e22ce" },
  jpg:  { icon:"fa-solid fa-file-image",      bg:"#f3e8ff", color:"#7e22ce" },
};
const PRESET_CATS = ["Knowledge Base","Guides","FAQs","Products","Policies","Scripts"];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [view, setView] = useState<"list"|"grid">("list");

  const { data, isLoading } = useQuery({
    queryKey: ["documents", catFilter, search],
    queryFn: () => documentsApi.list({ category: catFilter === "All" ? undefined : catFilter, search: search || undefined }).then((r) => r.data),
    retry: false,
  });

  const docs: any[] = data?.results ?? [];

  const getFileIcon = (type: string) => FILE_ICONS[type?.toLowerCase()] ?? { icon:"fa-solid fa-file", bg:"#f1f5f9", color:"#475569" };
  const getCatStyle = (cat: string) => CAT_STYLE[cat] ?? { icon:"fa-solid fa-tag", bg:"#fdf4ff", color:"#86198f" };

  return (
    <div style={{ display:"flex", height:"100vh", flexGrow:1, minWidth:0, background:"#fff" }}>

      {/* Left: Upload Panel */}
      <div style={{ width:420, background:"#fff", borderRight:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"0 16px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:48, background:"rgba(248,250,252,.5)" }}>
          <h2 style={{ fontSize:9, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Upload Document</h2>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#6366f1" }} />
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
          {/* Upload zone */}
          <div style={{ border:"2px dashed #e2e8f0", borderRadius:10, padding:"48px 16px", textAlign:"center", cursor:"pointer", background:"#f8fafc", transition:"all .2s" }}>
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize:24, color:"#a5b4fc", display:"block", marginBottom:8 }} />
            <p style={{ fontSize:10, fontWeight:700, color:"#374151", marginBottom:4 }}>Drop files here or <span style={{ color:"#6366f1" }}>browse</span></p>
            <p style={{ fontSize:8, color:"#94a3b8" }}>PDF, DOCX, XLSX, PNG — Max 20 MB each</p>
          </div>

          {/* Document Details */}
          <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:10, marginTop:4 }}>
            <p style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#cbd5e1", marginBottom:7, display:"flex", alignItems:"center", gap:5 }}>
              <i className="fa-solid fa-tag" style={{ fontSize:8 }} /> Document Details
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Title *</label>
                <input placeholder="e.g. Home Loan Product Guide 2026" style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10.5, fontWeight:500, outline:"none", color:"#1e293b" }} />
              </div>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:3, display:"block" }}>Description</label>
                <textarea rows={4} placeholder="Brief description..." style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:10.5, fontWeight:500, outline:"none", resize:"none", color:"#1e293b" }} />
              </div>
            </div>
          </div>

          {/* Category */}
          <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:10 }}>
            <p style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#cbd5e1", marginBottom:7, display:"flex", alignItems:"center", gap:5 }}>
              <i className="fa-solid fa-tags" style={{ fontSize:8 }} /> Category
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
              {PRESET_CATS.map((cat) => (
                <span key={cat} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", background:"#f1f5f9", borderRadius:6, fontSize:9, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".03em", border:"1px solid #e2e8f0", cursor:"pointer" }}>{cat}</span>
              ))}
            </div>
          </div>

          <button style={{ width:"100%", padding:"10px 0", background:"#0f172a", color:"#fff", border:"none", borderRadius:8, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize:10 }} /> Upload Document
          </button>
        </div>
      </div>

      {/* Right: Vault */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Dark header */}
        <div style={{ padding:"0 16px", background:"#0f172a", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", gap:12, minHeight:48 }}>
          <i className="fa-solid fa-vault" style={{ color:"#818cf8", fontSize:13, flexShrink:0 }} />
          <h2 style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#fff", flexShrink:0 }}>Document Vault</h2>
          <span style={{ fontSize:8, fontWeight:700, color:"#64748b", fontFamily:"monospace" }}>{docs.length} docs</span>
          <div style={{ position:"relative", flex:1 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:8, color:"rgba(255,255,255,.3)" }} />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search documents..." style={{ width:"100%", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"5px 10px 5px 26px", fontSize:9, fontWeight:600, color:"#fff", outline:"none" }} />
          </div>
          <select value={catFilter} onChange={(e)=>setCatFilter(e.target.value)} style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"5px 22px 5px 9px", fontSize:9, fontWeight:700, color:"#d1d5db", outline:"none" }}>
            <option value="All">All Categories</option>
            {PRESET_CATS.map((c)=><option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ display:"flex", alignItems:"center", gap:2, background:"rgba(255,255,255,.05)", borderRadius:8, padding:2 }}>
            {(["grid","list"] as const).map((v)=>(
              <button key={v} onClick={()=>setView(v)} style={{ padding:"5px 8px", borderRadius:6, fontSize:10, color: view===v?"#fff":"#94a3b8", cursor:"pointer", border:"none", background: view===v?"rgba(255,255,255,.12)":"transparent" }}>
                <i className={`fa-solid ${v==="grid"?"fa-grip":"fa-list"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Document list */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {isLoading ? (
            <div style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>Loading...</div>
          ) : docs.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", textAlign:"center" }}>
              <div style={{ width:56, height:56, background:"#f8fafc", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                <i className="fa-solid fa-folder-open" style={{ fontSize:24, color:"#e2e8f0" }} />
              </div>
              <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8" }}>No documents found</p>
              <p style={{ fontSize:9, color:"#cbd5e1", marginTop:4 }}>Upload your first document</p>
            </div>
          ) : view === "list" ? (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={{ position:"sticky", top:0, background:"#f8fafc", borderBottom:"1px solid #e2e8f0", zIndex:10 }}>
                <tr>
                  {["Document","Category","Date"].map((h)=>(
                    <th key={h} style={{ padding:"8px 16px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left" }}>{h}</th>
                  ))}
                  <th style={{ width:24 }} />
                </tr>
              </thead>
              <tbody>
                {docs.map((d:any) => {
                  const fi = getFileIcon(d.fileType);
                  const cs = getCatStyle(d.category);
                  return (
                    <tr key={d.id} style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", transition:"background .1s" }}>
                      <td style={{ padding:"10px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:28, height:28, borderRadius:8, background:fi.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <i className={fi.icon} style={{ fontSize:11, color:fi.color }} />
                          </div>
                          <div>
                            <p style={{ fontSize:10, fontWeight:700, color:"#0f172a" }}>{d.title}</p>
                            <p style={{ fontSize:7, color:"#94a3b8", marginTop:2 }}>{d.filename} · {d.fileSize}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <i className={cs.icon} style={{ fontSize:9, color:cs.color }} />
                          <span style={{ fontSize:9, fontWeight:600, color:"#374151" }}>{d.category}</span>
                        </div>
                      </td>
                      <td style={{ padding:"10px 16px" }}>
                        <span style={{ fontSize:9, fontFamily:"monospace", color:"#94a3b8" }}>
                          {new Date(d.uploadedAt).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"2-digit"})}
                        </span>
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"center" }} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, padding:16, alignContent:"start" }}>
              {docs.map((d:any) => {
                const cs = getCatStyle(d.category);
                return (
                  <div key={d.id} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:10, padding:14, cursor:"pointer", transition:"all .15s" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                      <div style={{ width:36, height:36, borderRadius:12, background:cs.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className={cs.icon} style={{ fontSize:14, color:cs.color }} />
                      </div>
                    </div>
                    <p style={{ fontSize:11, fontWeight:700, color:"#0f172a", lineHeight:1.3, marginBottom:4 }}>{d.title}</p>
                    <p style={{ fontSize:8, color:"#94a3b8", marginBottom:12 }}>{d.filename}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid #f8fafc" }}>
                      <span style={{ fontSize:8, fontWeight:700, color:cs.color }}>{d.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding:"12px 16px", borderTop:"1px solid #f8fafc", background:"rgba(248,250,252,.3)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em" }}>Showing {docs.length} documents</span>
          <button style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", background:"none", border:"none", cursor:"pointer" }}>
            <i className="fa-solid fa-download" style={{ marginRight:4 }} />Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
