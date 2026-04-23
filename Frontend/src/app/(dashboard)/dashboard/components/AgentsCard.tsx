"use client";

const AGENTS = [
  { name:"Thanushika M.", init:"TM", color:"#4f46e5", email:"thanushika@whiterock.com", phone:"+44 7700 900123", status:"ACTIVE",  leads:42 },
  { name:"John Smith",    init:"JS", color:"#94a3b8", email:"john.smith@whiterock.com", phone:"+44 7700 900555", status:"OFFLINE", leads:28 },
  { name:"Sarah Jones",   init:"SJ", color:"#ef4444", email:"sarah.jones@whiterock.com",phone:"+44 7700 900222", status:"ACTIVE",  leads:35 },
  { name:"Michael Brown", init:"MB", color:"#14b8a6", email:"michael.b@whiterock.com",  phone:"+44 7700 900333", status:"ACTIVE",  leads:19 },
];

export function AgentsCard() {
  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280 }}>
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Online Agents</h3>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e" }} />
          <span style={{ fontSize:8, fontWeight:900, color:"#94a3b8", textTransform:"uppercase" }}>Live Now</span>
        </div>
      </div>
      <div style={{ flex:1, padding:12, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
        {AGENTS.map((a) => (
          <div key={a.name} style={{ padding:"8px 12px", background:"#fff", border:"1px solid #f1f5f9", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", transition:"all .15s", opacity: a.status==="OFFLINE"?.8:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:a.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:900, flexShrink:0 }}>{a.init}</div>
              <div>
                <h4 style={{ fontSize:10, fontWeight:900, color:"#0f172a", lineHeight:1.2 }}>{a.name}</h4>
                <p style={{ fontSize:7, fontWeight:700, color:"#64748b", marginTop:2, display:"flex", alignItems:"center", gap:6 }}>
                  <i className="fa-solid fa-envelope" style={{ fontSize:8, width:12 }} /> {a.email}
                </p>
                <p style={{ fontSize:7, fontWeight:700, color:"#64748b", marginTop:2, display:"flex", alignItems:"center", gap:6 }}>
                  <i className="fa-solid fa-phone" style={{ fontSize:8, width:12 }} /> {a.phone}
                </p>
              </div>
            </div>
            <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              <span style={{ fontSize:6, fontWeight:900, padding:"2px 6px", borderRadius:4, background:a.status==="ACTIVE"?"#dcfce7":"#f1f5f9", color:a.status==="ACTIVE"?"#15803d":"#94a3b8", textTransform:"uppercase" }}>{a.status}</span>
              <span style={{ fontSize:7, fontWeight:900, color:a.status==="ACTIVE"?"#4f46e5":"#94a3b8", textTransform:"uppercase", letterSpacing:".05em" }}>Leads: {a.leads}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
