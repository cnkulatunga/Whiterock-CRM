"use client";
import Link from "next/link";

const PROMOS = [
  { badge:"Exclusive", badgeBg:"#4f46e5", badgeColor:"#fff", exp:"Exp: 30 Apr", name:"Lloyds Bank: 0.25% Rate Cut",    detail:"Applicable to all new business expansion loans...", bg:"rgba(238,242,255,.3)", border:"#c7d2fe" },
  { badge:"Bonus",     badgeBg:"#dcfce7", badgeColor:"#15803d", exp:"Exp: 15 May", name:"Funding Circle: 1% Fee Rebate",  detail:"Bonus commission on all asset finance deals...",    bg:"#fff",                border:"#f1f5f9" },
  { badge:"Limited",   badgeBg:"#fef3c7", badgeColor:"#b45309", exp:"Exp: 22 Apr", name:"Allica: Fast-Track Processing",  detail:"Guaranteed 24-hour turnaround on commercial...",    bg:"#fff",                border:"#f1f5f9" },
  { badge:"New",       badgeBg:"#fef2f2", badgeColor:"#b91c1c", exp:"Exp: 01 Jun", name:"Shawbrook: EV Finance",          detail:"Lowered rates for electric fleet vehicle funding...", bg:"#fff",               border:"#f1f5f9" },
];

export function PromotionsCard() {
  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280 }}>
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,.5)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-tags" style={{ color:"#fff", fontSize:12 }} />
          </div>
          <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Lender Promotions</h3>
        </div>
        <Link href="/lenders" style={{ fontSize:8, fontWeight:900, color:"#4f46e5", textDecoration:"none", textTransform:"uppercase" }}>Manage All</Link>
      </div>
      <div style={{ flex:1, padding:8, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
        {PROMOS.map((p) => (
          <div key={p.name} style={{ padding:8, background:p.bg, border:`1px solid ${p.border}`, borderRadius:12, display:"flex", flexDirection:"column", gap:4, transition:"border-color .15s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:5, fontWeight:900, padding:"2px 6px", borderRadius:4, background:p.badgeBg, color:p.badgeColor, textTransform:"uppercase" }}>{p.badge}</span>
              <span style={{ fontSize:6, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" }}>{p.exp}</span>
            </div>
            <div>
              <h4 style={{ fontSize:8, fontWeight:900, color:"#0f172a", lineHeight:1 }}>{p.name}</h4>
              <p style={{ fontSize:7, color:"#64748b", lineHeight:1, marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.detail}</p>
            </div>
            <div style={{ paddingTop:4, borderTop:`1px solid ${p.border}`, display:"flex", justifyContent:"flex-end" }}>
              <button style={{ fontSize:6, fontWeight:900, color:"#4f46e5", background:"none", border:"none", cursor:"pointer", textTransform:"uppercase", display:"flex", alignItems:"center", gap:4 }}>
                <i className="fa-solid fa-file-contract" /> View Doc
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
