"use client";
import { useState } from "react";

const INIT_NOTIFS = [
  { id:1, unread:true,  iconBg:"#fee2e2", iconColor:"#b91c1c", icon:"fa-triangle-exclamation", title:"3 documents overdue",    body:"Action needed on pending client documents.", time:"2 min ago" },
  { id:2, unread:true,  iconBg:"#fef3c7", iconColor:"#b45309", icon:"fa-clock",                title:"Follow-ups due today",    body:"12 leads require follow-up before 17:00.",   time:"15 min ago" },
  { id:3, unread:true,  iconBg:"#dbeafe", iconColor:"#1d4ed8", icon:"fa-diagram-project",      title:"Pipeline updated",        body:"Amal moved 2 leads to Negotiation stage.",   time:"1 hr ago" },
  { id:4, unread:false, iconBg:"#dcfce7", iconColor:"#15803d", icon:"fa-user-plus",            title:"New lead assigned",       body:"James Smith has been assigned to your team.", time:"3 hrs ago" },
  { id:5, unread:false, iconBg:"#f5f3ff", iconColor:"#7c3aed", icon:"fa-hand-holding-dollar",  title:"Payout approved",         body:"£12,400 payout for ABC Corp approved.",       time:"Yesterday" },
];

export function NotifPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const unread = notifs.filter(n => n.unread).length;

  return (
    <div style={{ position:"fixed", top:70, right:20, width:340, background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 20px 50px rgba(0,0,0,0.12)", zIndex:500, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:800, color:"#0f172a" }}>Notifications</div>
          <div style={{ fontSize:8, fontWeight:700, color:"#94a3b8", marginTop:1 }}>{unread} unread</div>
        </div>
        <button onClick={() => setNotifs(notifs.map(n => ({ ...n, unread:false })))} style={{ fontSize:8, fontWeight:800, color:"#6366f1", background:"none", border:"none", cursor:"pointer", textTransform:"uppercase", letterSpacing:".05em" }}>Mark all read</button>
      </div>
      <div style={{ maxHeight:360, overflowY:"auto" }}>
        {notifs.map(n => (
          <div key={n.id} onClick={() => setNotifs(notifs.map(x => x.id===n.id ? {...x,unread:false} : x))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 16px", borderBottom:"1px solid #f8fafc", cursor:"pointer", background:n.unread?"#fafbff":"#fff", transition:"background .15s" }}>
            <div style={{ width:32, height:32, borderRadius:10, background:n.iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={`fa-solid ${n.icon}`} style={{ color:n.iconColor, fontSize:12 }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, fontWeight:n.unread?800:600, color:"#0f172a", lineHeight:1.3 }}>{n.title}</div>
              <div style={{ fontSize:8, color:"#64748b", marginTop:2, lineHeight:1.4 }}>{n.body}</div>
              <div style={{ fontSize:7, color:"#94a3b8", marginTop:3, fontWeight:700 }}>{n.time}</div>
            </div>
            {n.unread && <div style={{ width:6, height:6, borderRadius:"50%", background:"#6366f1", flexShrink:0, marginTop:5 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 16px", borderTop:"1px solid #f1f5f9", textAlign:"center" }}>
        <button onClick={() => setNotifs([])} style={{ fontSize:8, fontWeight:800, color:"#94a3b8", background:"none", border:"none", cursor:"pointer", textTransform:"uppercase", letterSpacing:".05em" }}>Clear All</button>
      </div>
    </div>
  );
}
