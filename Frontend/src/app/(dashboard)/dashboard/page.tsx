"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { NotifPanel } from "./components/NotifPanel";
import { FollowupsCard } from "./components/FollowupsCard";
import { NotesCard } from "./components/NotesCard";
import { LicensesCard } from "./components/LicensesCard";
import { AgentsCard } from "./components/AgentsCard";
import { LeadPortfolioCard } from "./components/LeadPortfolioCard";
import { PayoutsCard } from "./components/PayoutsCard";
import { PromotionsCard } from "./components/PromotionsCard";
import { CalendarCard } from "./components/CalendarCard";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.stats().then((r) => r.data),
    retry: false,
  });

  const quickCards = [
    { href: "/leads", icon: "fa-solid fa-users", label: "Leads", value: stats?.totalLeads ?? "1,284", extra: "+12%", extraColor: "#22c55e", iconBg: "#eef2ff", iconColor: "#4f46e5", w: 140 },
    { href: "https://teams.microsoft.com", icon: "fa-brands fa-microsoft", label: "Connect", value: "TEAMS", iconBg: "#f8fafc", iconColor: "#4f46e5", w: 130, external: true },
    { href: "https://web.whatsapp.com", icon: "fa-brands fa-whatsapp", label: "Chat", value: "WHATSAPP", iconBg: "#f8fafc", iconColor: "#22c55e", w: 130, external: true },
    { href: "mailto:admin@taskflow.com", icon: "fa-solid fa-envelope", label: "Official", value: "MAIL HUB", iconBg: "#f8fafc", iconColor: "#0ea5e9", w: 130 },
    { href: "#", icon: "fa-solid fa-calculator", label: "Utility", value: "CALCULATOR", iconBg: "#f8fafc", iconColor: "#f59e0b", w: 130 },
    { href: "#", icon: "fa-solid fa-wand-magic-sparkles", label: "Layout", value: "DESIGN MODE", iconBg: "#f8fafc", iconColor: "#4f46e5", w: 130 },
    { href: "/documents", icon: "fa-solid fa-folder-open", label: "Docs", value: "UPLOAD", iconBg: "#eef2ff", iconColor: "#4f46e5", w: 130 },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", flexGrow:1, minWidth:0, background:"#f8fafc" }}>

      {/* ── Top Action Row ── */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"16px 24px 0", flexShrink:0, overflowX:"auto", minHeight:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"nowrap", flex:1, minWidth:0 }}>
          {quickCards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", padding:"10px 14px", display:"flex", alignItems:"center", gap:12, width:c.w, textDecoration:"none", transition:"all .3s", flexShrink:0 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)"; }}
            >
              <div style={{ width:32, height:32, borderRadius:8, background:c.iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={c.icon} style={{ fontSize:14, color:c.iconColor }} />
              </div>
              <div style={{ overflow:"hidden" }}>
                <div style={{ fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", lineHeight:1 }}>{c.label}</div>
                <div style={{ fontSize:10, fontWeight:900, color:"#0f172a", marginTop:4 }}>
                  {c.value}
                  {c.extra && <span style={{ fontSize:7, color:c.extraColor, marginLeft:4 }}>{c.extra}</span>}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Notification Bell */}
        <div style={{ position:"relative", flexShrink:0, marginLeft:8 }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{ width:40, height:40, borderRadius:12, background:"#fff", border:"1px solid #f1f5f9", boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", transition:"all .2s" }}
          >
            <i className="fa-solid fa-bell" style={{ fontSize:15, color:"#64748b" }} />
            <span style={{ position:"absolute", top:-4, right:-4, minWidth:16, height:16, background:"#ef4444", borderRadius:99, fontSize:8, fontWeight:900, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px", border:"2px solid #f8fafc" }}>3</span>
          </button>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        </div>
      </div>

      {/* ── Module Grid ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 0 16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16, padding:16, maxWidth:1800, margin:"0 auto" }}>
          <FollowupsCard />
          <NotesCard />
          <LicensesCard />
          <AgentsCard />
          <LeadPortfolioCard stats={stats} />
          <PayoutsCard />
          <PromotionsCard />
          <CalendarCard />
        </div>
      </div>

      {/* AI FAB */}
      <button
        onClick={() => setAiOpen(!aiOpen)}
        style={{ position:"fixed", bottom:24, right:24, width:56, height:56, background:"#2447d7", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:"0 10px 25px rgba(36,71,215,0.4)", cursor:"pointer", border:"none", zIndex:1000, transition:"all .3s cubic-bezier(.175,.885,.32,1.275)", transform: aiOpen?"scale(1.1) translateY(-5px)":"scale(1)" }}
      >
        <i className={`fa-solid ${aiOpen?"fa-xmark":"fa-robot"}`} style={{ fontSize:22 }} />
      </button>

      {/* AI Widget */}
      {aiOpen && (
        <div style={{ position:"fixed", bottom:"6rem", right:"1.5rem", width:320, background:"rgba(255,255,255,.97)", backdropFilter:"blur(15px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:28, boxShadow:"0 20px 50px rgba(0,0,0,0.1)", overflow:"hidden", display:"flex", flexDirection:"column", zIndex:999, animation:"widgetReveal .4s cubic-bezier(.175,.885,.32,1.275)" }}>
          <div style={{ padding:"12px 20px", borderBottom:"1px solid #f1f5f9", background:"rgba(255,255,255,.5)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#0f172a" }}>AI Assistant</div>
            <div style={{ fontSize:8, fontWeight:700, color:"#94a3b8", marginTop:1 }}>Alpha Funding CRM</div>
          </div>
          {[
            { icon:"fa-solid fa-chart-line", iconBg:"#eef2ff", iconColor:"#4f46e5", title:"Performance Summary", desc:"Get a quick overview of today's KPIs" },
            { icon:"fa-solid fa-user-group", iconBg:"#f0fdf4", iconColor:"#16a34a", title:"Lead Insights", desc:"Analyse your current lead pipeline" },
            { icon:"fa-solid fa-calendar-check", iconBg:"#fef3c7", iconColor:"#d97706", title:"Schedule Optimizer", desc:"Suggest best follow-up times" },
          ].map((opt) => (
            <div key={opt.title} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:16, cursor:"pointer", transition:"all .2s", borderBottom:"1px solid #f8fafc" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,.8)")}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
            >
              <div style={{ width:42, height:42, borderRadius:12, background:opt.iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(0,0,0,.05)" }}>
                <i className={opt.icon} style={{ color:opt.iconColor, fontSize:16 }} />
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#0f172a" }}>{opt.title}</div>
                <div style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes widgetReveal { from { opacity:0; transform:translateY(20px) scale(.9); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}
