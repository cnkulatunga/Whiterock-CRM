"use client";
import Link from "next/link";

const PAYOUTS = [
  { id:"AF-028", name:"A. Thompson",    lender:"Lloyds Bank",    amount:"£4,250",  status:"PENDING SUBMISSION", statusBg:"#fef3c7", statusColor:"#b45309", sent:"2h ago" },
  { id:"AF-027", name:"Global Logistics",lender:"Funding Circle", amount:"£12,800", status:"LENDER REVIEW",      statusBg:"#dbeafe", statusColor:"#1d4ed8", sent:"Yesterday" },
  { id:"AF-026", name:"Retail Ventures", lender:"Allica Bank",    amount:"£7,400",  status:"PENDING SUBMISSION", statusBg:"#fef3c7", statusColor:"#b45309", sent:"5h ago" },
  { id:"AF-025", name:"Cresthold Dev",   lender:"Shawbrook",      amount:"£9,100",  status:"LENDER REVIEW",      statusBg:"#dbeafe", statusColor:"#1d4ed8", sent:"1d ago" },
];

export function PayoutsCard() {
  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280 }}>
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,.5)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-hand-holding-dollar" style={{ color:"#fff", fontSize:12 }} />
          </div>
          <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Pending Payouts</h3>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:8, fontWeight:900, color:"#94a3b8", textTransform:"uppercase" }}>Total:</span>
          <span style={{ fontSize:10, fontWeight:900, color:"#16a34a" }}>£124,500</span>
        </div>
      </div>
      <div style={{ flex:1, padding:8, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
        {PAYOUTS.map((p) => (
          <Link key={p.id} href={`/pipeline/${p.id}`} style={{ padding:8, background:"#fff", border:"1px solid #f1f5f9", borderRadius:12, display:"flex", flexDirection:"column", gap:4, textDecoration:"none", transition:"border-color .15s", cursor:"pointer" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:8, fontWeight:900, color:"#4f46e5" }}>#{p.id}</span>
                  <span style={{ fontSize:9, fontWeight:900, color:"#0f172a" }}>{p.name}</span>
                </div>
                <p style={{ fontSize:6, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginTop:4 }}>Lender: {p.lender}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:9, fontWeight:900, color:"#0f172a" }}>{p.amount}</div>
                <span style={{ fontSize:5, fontWeight:900, color:"#22c55e", textTransform:"uppercase", letterSpacing:".05em", display:"block", marginTop:4 }}>Est. Payout</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:4, marginTop:2, borderTop:"1px solid #f8fafc" }}>
              <span style={{ fontSize:5, fontWeight:900, padding:"2px 6px", borderRadius:4, background:p.statusBg, color:p.statusColor, textTransform:"uppercase" }}>{p.status}</span>
              <span style={{ fontSize:6, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" }}>Sent: {p.sent}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
