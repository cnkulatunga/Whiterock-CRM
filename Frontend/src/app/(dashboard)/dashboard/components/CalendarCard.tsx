"use client";
import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Seed some event dots
const EVENT_DAYS = new Set([1,3,5,7,10,14,18,22]);

export function CalendarCard() {
  const today = new Date();
  const [curDate, setCurDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<number|null>(null);

  const year = curDate.getFullYear();
  const month = curDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const changeMonth = (delta: number) => {
    setCurDate(new Date(year, month + delta, 1));
    setSelected(null);
  };

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:280 }}>
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,.5)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-calendar-days" style={{ color:"#fff", fontSize:12 }} />
          </div>
          <h3 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Operational Calendar</h3>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => changeMonth(-1)} style={{ width:24, height:24, borderRadius:6, background:"#f8fafc", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", transition:"all .15s" }}>
            <i className="fa-solid fa-chevron-left" style={{ fontSize:8 }} />
          </button>
          <span style={{ fontSize:9, fontWeight:900, color:"#0f172a", textTransform:"uppercase", minWidth:90, textAlign:"center" }}>{MONTHS[month]} {year}</span>
          <button onClick={() => changeMonth(1)} style={{ width:24, height:24, borderRadius:6, background:"#f8fafc", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", transition:"all .15s" }}>
            <i className="fa-solid fa-chevron-right" style={{ fontSize:8 }} />
          </button>
        </div>
      </div>

      <div style={{ flex:1, padding:"8px 12px" }}>
        {/* Day headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} style={{ textAlign:"center", fontSize:7, fontWeight:900, color:"#94a3b8", textTransform:"uppercase" }}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
          {/* Prev month padding */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`prev-${i}`} style={{ height:26, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#e2e8f0" }}>
              {prevDays - firstDay + i + 1}
            </div>
          ))}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const today_ = isToday(d);
            const sel = selected === d;
            const hasEvent = EVENT_DAYS.has(d);
            return (
              <div
                key={d}
                onClick={() => setSelected(sel ? null : d)}
                style={{
                  height:26, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:900, borderRadius:7, cursor:"pointer",
                  position:"relative", transition:"all .15s",
                  background: today_?"#0f172a": sel?"#4f46e5":"transparent",
                  color: today_||sel?"#fff":"#0f172a",
                  boxShadow: sel?"0 4px 12px rgba(99,102,241,.3)":"none",
                }}
              >
                {d}
                {hasEvent && (
                  <div style={{ position:"absolute", bottom:1, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background: today_||sel?"rgba(255,255,255,.8)":"#4f46e5" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
