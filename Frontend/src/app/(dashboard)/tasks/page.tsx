"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, leadsApi } from "@/lib/api";

const TASK_TYPES = ["Call","Meeting","Follow-up","Email","Document","Research","Outbound"];
const TYPE_EMOJI: Record<string,string> = { Call:"📞", Meeting:"🤝", "Follow-up":"🔁", Email:"📨", Document:"📄", Research:"📊", Outbound:"📞" };
const STATUS_STYLE: Record<string,{bg:string,color:string}> = {
  "To Do":      { bg:"#f1f5f9", color:"#475569" },
  "In Progress":{ bg:"#eff6ff", color:"#2563eb" },
  "Complete":   { bg:"#f0fdf4", color:"#16a34a" },
  "Overdue":    { bg:"#fef2f2", color:"#dc2626" },
};
const LEAD_STYLE: Record<string,{bg:string,color:string}> = {
  Hot:  { bg:"#fef2f2", color:"#dc2626" },
  Warm: { bg:"#fffbeb", color:"#d97706" },
  Cool: { bg:"#eff6ff", color:"#2563eb" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function TasksPage() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string|null>(null);
  const [calDate, setCalDate] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [selectedDay, setSelectedDay] = useState<number|null>(null);
  const [form, setForm] = useState({ title:"", assignee:"Thanushika", leadId:"", type:"Call", taskStatus:"To Do", leadStatus:"Warm", phone:"", email:"", date: new Date().toISOString().slice(0,10), time:"14:30", notes:"" });

  const today = new Date();
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.list().then((r) => r.data),
    retry: false,
  });

  const { data: leadsData } = useQuery({
    queryKey: ["leads-dropdown"],
    queryFn: () => leadsApi.list().then((r) => r.data),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (d: any) => tasksApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks"] }); setForm(f => ({ ...f, title:"", notes:"" })); },
  });

  const tasks = data?.results ?? [];
  const active = tasks.filter((t:any) => ["To Do","In Progress"].includes(t.taskStatus)).length;
  const leads: any[] = leadsData?.results ?? [];

  // Tasks for selected day
  const dayTasks = selectedDay ? tasks.filter((t:any) => {
    const d = new Date(t.date);
    return d.getDate() === selectedDay && d.getMonth() === month && d.getFullYear() === year;
  }) : [];

  // Days that have tasks
  const taskDays = new Set(tasks.map((t:any) => {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) return d.getDate();
    return null;
  }).filter(Boolean));

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find((l:any) => l.id === leadId || l.caseId === leadId);
    setForm(f => ({ ...f, leadId, phone: lead?.phoneNumber || "", email: lead?.emailAddress || "" }));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", flexGrow:1, minWidth:0, background:"#f8fafc" }}>

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <i className="fa-solid fa-tasks" style={{ color:"#4f46e5", fontSize:16 }} />
          <div>
            <h1 style={{ fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Integrated Task Hub</h1>
            <p style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginTop:2 }}>Alpha Funding CRM</p>
          </div>
        </div>
      </div>

      {/* 4-col grid matching original HTML */}
      <div style={{ flex:1, overflow:"hidden", display:"grid", gridTemplateColumns:"240px 220px 1fr 240px", gap:12, padding:12 }}>

        {/* Col 1: Create Task */}
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ padding:"10px 14px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Create New Task</span>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
          </div>
          <div style={{ flex:1, padding:12, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Task Description</label>
              <input type="text" placeholder="Title..." value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Assignee</label>
                <select value={form.assignee} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                  <option>Thanushika</option><option>Ravindu</option><option>Priya</option><option>Amal</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Lead</label>
                <select value={form.leadId} onChange={e=>handleLeadSelect(e.target.value)} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                  <option value="">Select lead...</option>
                  {leads.map((l:any) => <option key={l.id} value={l.id}>{l.fullName} — {l.companyName}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Task Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                  {TASK_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Task Status</label>
                <select value={form.taskStatus} onChange={e=>setForm(f=>({...f,taskStatus:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                  <option>To Do</option><option>In Progress</option><option>Complete</option><option>Overdue</option>
                </select>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Lead Status</label>
                <select value={form.leadStatus} onChange={e=>setForm(f=>({...f,leadStatus:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }}>
                  <option>Hot</option><option>Warm</option><option>Cool</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Phone</label>
                <input type="tel" placeholder="077..." value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none" }} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Date</label>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, outline:"none" }} />
              </div>
              <div>
                <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Time</label>
                <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, outline:"none" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", marginBottom:4, display:"block" }}>Notes</label>
              <textarea rows={4} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ width:"100%", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:500, outline:"none", resize:"none" }} />
            </div>
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} style={{ width:"100%", padding:"8px 0", background:"#0f172a", color:"#fff", border:"none", borderRadius:8, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", cursor:"pointer", opacity: createMutation.isPending ? 0.7 : 1 }}>
              {createMutation.isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>

        {/* Col 2: Calendar */}
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ padding:"10px 14px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#0f172a" }}>Calendar View</span>
            <span style={{ fontSize:9, fontWeight:700, color:"#94a3b8", fontFamily:"monospace" }}>{year}</span>
          </div>
          <div style={{ flex:1, padding:12, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {/* Month nav */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <button onClick={()=>setCalDate(new Date(year,month-1,1))} style={{ width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", border:"none", background:"none", cursor:"pointer", color:"#94a3b8", transition:"all .15s" }}>
                <i className="fa-solid fa-chevron-left" style={{ fontSize:8 }} />
              </button>
              <span style={{ fontSize:9, fontWeight:800, color:"#0f172a", textTransform:"uppercase", letterSpacing:".08em" }}>{MONTHS[month]}</span>
              <button onClick={()=>setCalDate(new Date(year,month+1,1))} style={{ width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", border:"none", background:"none", cursor:"pointer", color:"#94a3b8", transition:"all .15s" }}>
                <i className="fa-solid fa-chevron-right" style={{ fontSize:8 }} />
              </button>
            </div>
            {/* Day headers */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:4 }}>
              {["S","M","T","W","T","F","S"].map((d,i) => (
                <div key={i} style={{ textAlign:"center", fontSize:9, fontWeight:900, color:"#94a3b8", textTransform:"uppercase" }}>{d}</div>
              ))}
            </div>
            {/* Days grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:8 }}>
              {Array.from({length:firstDay},(_,i)=>(
                <div key={`p${i}`} style={{ height:26, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:500, color:"#e2e8f0" }}>{prevDays-firstDay+i+1}</div>
              ))}
              {Array.from({length:daysInMonth},(_,i)=>{
                const d = i+1;
                const tod = isToday(d);
                const sel = selectedDay === d;
                const hasTask = taskDays.has(d);
                return (
                  <div key={d} onClick={()=>setSelectedDay(sel?null:d)} style={{ height:26, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, borderRadius:7, cursor:"pointer", position:"relative", transition:"all .15s", background:tod?"#111827":sel?"#6366f1":"transparent", color:tod||sel?"#fff":"#1e293b" }}>
                    {d}
                    {hasTask && <div style={{ position:"absolute", bottom:1, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:tod||sel?"rgba(255,255,255,.8)":"#6366f1" }} />}
                  </div>
                );
              })}
            </div>
            {/* Day tasks */}
            <div style={{ flex:1, overflowY:"auto" }}>
              <label style={{ fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#94a3b8", display:"block", marginBottom:8 }}>
                {selectedDay ? `${MONTHS[month]} ${selectedDay} Tasks` : "Today's Tasks"}
              </label>
              {dayTasks.length === 0 ? (
                <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", padding:"20px 0" }}>No tasks for this day</div>
              ) : dayTasks.map((t:any) => (
                <div key={t.id} style={{ padding:"6px 8px", background:"#f8fafc", borderRadius:8, marginBottom:6, borderLeft:"3px solid #6366f1" }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#0f172a" }}>{t.title}</div>
                  <div style={{ fontSize:8, color:"#94a3b8", marginTop:2 }}>{t.time} · {t.assignee}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: All Tasks Table */}
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ background:"#0f172a", padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#fff" }}>All Tasks</span>
            <span style={{ fontSize:8, fontWeight:700, color:"#64748b", textTransform:"uppercase" }}>{active} active</span>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={{ position:"sticky", top:0, background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                <tr>
                  {["Task Details","Lead","Schedule","Task Status","Lead Status"].map((h) => (
                    <th key={h} style={{ padding:"8px 16px", fontSize:8, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", textAlign:"left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>Loading...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding:"40px", textAlign:"center", fontSize:10, color:"#94a3b8" }}>No tasks yet</td></tr>
                ) : tasks.map((t:any) => {
                  const ts = STATUS_STYLE[t.taskStatus] ?? STATUS_STYLE["To Do"];
                  const ls = LEAD_STYLE[t.leadStatus] ?? LEAD_STYLE["Warm"];
                  const isOpen = expanded === t.id;
                  return (
                    <>
                      <tr key={t.id} onClick={() => setExpanded(isOpen ? null : t.id)} style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", background: isOpen?"#eef2ff":"#fff", transition:"background .1s" }}>
                        <td style={{ padding:"10px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <i className="fa-solid fa-chevron-right" style={{ fontSize:8, color: isOpen?"#4f46e5":"#cbd5e1", transform: isOpen?"rotate(90deg)":"none", transition:".2s" }} />
                            <div>
                              <div style={{ fontSize:10, fontWeight:700, color:"#0f172a" }}>{t.title}</div>
                              <div style={{ fontSize:7, fontWeight:700, color:"#4f46e5", textTransform:"uppercase", marginTop:2 }}>{TYPE_EMOJI[t.type]} {t.type}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"10px 16px" }}>
                          <div style={{ fontSize:10, fontWeight:700, color:"#374151" }}>{t.client || "—"}</div>
                        </td>
                        <td style={{ padding:"10px 16px" }}>
                          <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8" }}>{t.date} {t.time}</div>
                        </td>
                        <td style={{ padding:"10px 16px" }}>
                          <span style={{ fontSize:8, fontWeight:700, padding:"2px 8px", borderRadius:6, background:ts.bg, color:ts.color }}>{t.taskStatus}</span>
                        </td>
                        <td style={{ padding:"10px 16px" }}>
                          <span style={{ fontSize:8, fontWeight:700, padding:"2px 8px", borderRadius:6, background:ls.bg, color:ls.color }}>{t.leadStatus}</span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={t.id+"_detail"} style={{ background:"#eef2ff", borderBottom:"1px solid #c7d2fe" }}>
                          <td colSpan={5} style={{ padding:"12px 32px" }}>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px 20px", fontSize:10 }}>
                              {[["Assignee",t.assignee||"—"],["Phone",t.phone||"—"],["Email",t.email||"—"],["Notes",t.notes||"—"]].map(([l,v]) => (
                                <div key={l}>
                                  <div style={{ fontSize:7, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", marginBottom:2 }}>{l}</div>
                                  <div style={{ fontSize:10, fontWeight:700, color:"#0f172a" }}>{v}</div>
                                </div>
                              ))}
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
          <div style={{ padding:"8px 16px", borderTop:"1px solid #f1f5f9", background:"rgba(248,250,252,.3)", textAlign:"center" }}>
            <button onClick={()=>qc.invalidateQueries({queryKey:["tasks"]})} style={{ fontSize:8, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", background:"none", border:"none", cursor:"pointer" }}>Refresh</button>
          </div>
        </div>

        {/* Col 4: Lender Promotions */}
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ padding:"10px 14px", borderBottom:"1px solid #fde68a", background:"#fffbeb", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:8, background:"#f59e0b", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="fa-solid fa-tags" style={{ color:"#fff", fontSize:10 }} />
            </div>
            <span style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#78350f" }}>Lender Promotions</span>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#f59e0b", marginLeft:"auto", animation:"pulse 1.5s infinite" }} />
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {[
              { status:"Active", statusColor:"#10b981", lender:"Funding Circle", name:"1% Fee Rebate", detail:"Bonus commission on all asset finance deals this month.", exp:"Exp: 15 May" },
              { status:"Active", statusColor:"#10b981", lender:"Allica Bank", name:"Fast-Track Processing", detail:"Guaranteed 24-hour turnaround on commercial mortgage apps.", exp:"Exp: 22 Apr" },
              { status:"Active", statusColor:"#10b981", lender:"Westpac", name:"Zero Arrangement Fee", detail:"No arrangement fee on SME loans £100k–£500k this month.", exp:"Exp: 28 Apr" },
              { status:"Expired", statusColor:"#ef4444", lender:"Lloyds Bank", name:"0.25% Rate Cut", detail:"All new business expansion loans over £250k.", exp:"Exp: 10 Apr" },
            ].map((p) => (
              <div key={p.name} style={{ padding:"10px 14px", borderBottom:"1px solid #f8fafc", opacity: p.status==="Expired"?.6:1, cursor:"pointer", transition:"background .15s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <span style={{ background:p.statusColor, color:"#fff", padding:"1px 5px", borderRadius:4, fontSize:7, fontWeight:800 }}>{p.status}</span>
                  <span style={{ fontSize:7, fontWeight:700, color:"#94a3b8" }}>{p.exp}</span>
                </div>
                <div style={{ fontSize:10, fontWeight:800, color:"#0f172a", marginBottom:3 }}>{p.lender}: {p.name}</div>
                <div style={{ fontSize:8, color:"#64748b", lineHeight:1.5 }}>{p.detail}</div>
                <div style={{ marginTop:6, paddingTop:6, borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <button style={{ fontSize:8, fontWeight:700, color:"#4f46e5", background:"#f1f5f9", border:"none", borderRadius:6, padding:"3px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                    <i className="fa-solid fa-file-pdf" /> View Doc
                  </button>
                  <i className="fa-solid fa-chevron-right" style={{ color:"#cbd5e1", fontSize:8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.2)} }`}</style>
    </div>
  );
}
