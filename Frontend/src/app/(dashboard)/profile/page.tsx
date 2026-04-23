"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", flexGrow:1, minWidth:0, background:"#f8fafc", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:24, padding:32, width:360, boxShadow:"0 4px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:user?.avatarBg||"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:24, fontWeight:900, marginBottom:12 }}>
            {user?.avatar}
          </div>
          <h2 style={{ fontSize:16, fontWeight:900, color:"#0f172a", marginBottom:4 }}>{user?.name}</h2>
          <span style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".08em", padding:"3px 10px", borderRadius:99, background:"#eef2ff", color:"#4f46e5" }}>{user?.role}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
          {[["Email", user?.email],["Role", user?.role]].map(([label,value])=>(
            <div key={label as string} style={{ background:"#f8fafc", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".06em", marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#0f172a" }}>{value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          style={{ width:"100%", padding:"10px 0", background:"#fef2f2", color:"#b91c1c", border:"1px solid #fecaca", borderRadius:10, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".08em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
        >
          <i className="fa-solid fa-right-from-bracket" /> Sign Out
        </button>
      </div>
    </div>
  );
}
