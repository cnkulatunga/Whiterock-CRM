"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api";
import toast from "react-hot-toast";
import type { Lead, LeadStatus, PaginatedResponse } from "@/types";

// ── Constants ────────────────────────────────────────────────────────────────
const INDUSTRY_OPTIONS = [
  "Software","Hardware","IT Services","Telecommunications","E-commerce",
  "Digital Media","Robotics","Pharmaceuticals","Medical Devices","Hospitals",
  "Health Insurance","BioTechnology","Wellness","Insurance","Investment Banking",
  "Venture Capital","Accounting","Aerospace",
];
const BANK_OPTIONS = [
  "Santander","HSBC","Lloyds Bank","Starling","NatWest","Barclays","Metro Bank",
  "Royal Bank of Scotland","The Co-operative Bank","The Cumberland","Tide","TSB",
  "Ulster Bank","Unity Trust Bank","Zempler",
];
const LEAD_SOURCE_OPTIONS = [
  "Advertisement","Cold Call","Web","External Referral","Sales Email Alias",
  "Employee Referral","Online Store","Partner","Public Relations","Seminar Partner",
  "Internal Seminar","Trade Show","Chat",
];
const TASK_TYPE_OPTIONS = ["Call","Meeting","Follow-up","Email","Document","Research","Outbound"];

// ── Types ────────────────────────────────────────────────────────────────────
type TabId = "details" | "tasks" | "ai" | "notes" | "docs";

interface LocalNote { text: string; by: string; date: string; }
interface LocalTask { id: number; type: string; date: string; desc: string; }
interface LocalDoc {
  id: number; name: string; size: string | null; type: string;
  status: "Pending" | "Approved" | "Rejected" | "Reupload";
  dataUrl: string | null; uploadedAt: string;
}

type FormData = Omit<Partial<Lead>, "payoutStatus"> & { [key: string]: string | boolean | undefined };

function emptyForm(): FormData {
  return {
    title: "", fullName: "", dob: "", companyName: "", companyHouseNumber: "",
    businessAnnualTurnover: "", jobTitle: "", industry: "", emailAddress: "",
    phoneNumber: "", preferredContact: "Email", homeOwner: "Yes",
    timeAtCurrentAddress: "", residentialAddress: "", previousAddress: "",
    loanAmount: "", loanPurpose: "", existingLoan: "No", overdraftFacility: "No",
    companyBank: "", leadSource: "", fundingTimeline: "", previousAlphaFundingLoan: "No",
    creditConsent: "Yes", additionalComments: "", status: "Warm", stage: "Create Lead",
    caseId: "",
  };
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg: Record<LeadStatus, { bg: string; color: string }> = {
    Hot:  { bg: "#fee2e2", color: "#b91c1c" },
    Warm: { bg: "#fef3c7", color: "#b45309" },
    Cool: { bg: "#dbeafe", color: "#1d4ed8" },
  };
  const s = cfg[status] ?? cfg.Warm;
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:99,
      fontSize:8,fontWeight:800,letterSpacing:".04em",textTransform:"uppercase",
      whiteSpace:"nowrap",background:s.bg,color:s.color,
    }}>{status}</span>
  );
}

function initials(name: string) {
  return (name || "?").split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function dotColor(status?: string) {
  if (status === "Hot") return "#ef4444";
  if (status === "Warm") return "#f59e0b";
  return "#3b82f6";
}

export default function LeadsPage() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("tasks");
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm());
  const [showExistingLoan, setShowExistingLoan] = useState(false);
  const [notes, setNotes] = useState<Record<string, LocalNote[]>>({});
  const [tasks, setTasks] = useState<Record<string, LocalTask[]>>({});
  const [docs, setDocs] = useState<Record<string, LocalDoc[]>>({});
  const [noteText, setNoteText] = useState("");
  const [taskType, setTaskType] = useState("Call");
  const [taskDate, setTaskDate] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [aiText, setAiText] = useState<Record<string, string>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<LocalDoc | null>(null);
  const docFileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<Lead>>({
    queryKey: ["leads", search, statusFilter],
    queryFn: () =>
      leadsApi.list({ search, status: statusFilter === "All" ? undefined : statusFilter })
        .then(r => r.data),
  });

  const leads = data?.results ?? [];
  const total = leads.length;
  const hot = leads.filter(l => l.status === "Hot").length;
  const warm = leads.filter(l => l.status === "Warm").length;

  const createMutation = useMutation({
    mutationFn: (d: Partial<Lead>) => leadsApi.create(d),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created");
      setIsCreateMode(false);
      setIsEditMode(false);
      setSelectedLead(res.data);
      setFormData({ ...emptyForm(), ...res.data });
      setActiveTab("tasks");
    },
    onError: () => toast.error("Failed to create lead"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      leadsApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead saved");
      setIsEditMode(false);
      setSelectedLead(res.data);
    },
    onError: () => toast.error("Failed to save lead"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
      setSelectedLead(null);
      setFormData(emptyForm());
      setIsEditMode(false);
    },
    onError: () => toast.error("Failed to delete lead"),
  });

  function selectLead(lead: Lead) {
    setSelectedLead(lead);
    setFormData({ ...emptyForm(), ...lead });
    setIsEditMode(false);
    setIsCreateMode(false);
    setShowExistingLoan(lead.existingLoan === "Yes");
    setActiveTab("tasks");
  }

  function enterCreateMode() {
    setIsCreateMode(true);
    setIsEditMode(true);
    setSelectedLead(null);
    setFormData(emptyForm());
    setShowExistingLoan(false);
    setActiveTab("details");
  }

  function exitCreateMode() {
    setIsCreateMode(false);
    setIsEditMode(false);
    if (selectedLead) setFormData({ ...emptyForm(), ...selectedLead });
  }

  function toggleEditMode() {
    if (isEditMode) {
      setIsEditMode(false);
      if (selectedLead) setFormData({ ...emptyForm(), ...selectedLead });
    } else {
      setIsEditMode(true);
    }
  }

  function handleSave() {
    if (!formData.fullName) { toast.error("Full Name is required"); return; }
    if (isCreateMode) {
      createMutation.mutate(formData as Partial<Lead>);
    } else if (selectedLead) {
      updateMutation.mutate({ id: selectedLead.id, data: formData as Partial<Lead> });
    }
  }

  function handleDelete() {
    if (!selectedLead) return;
    if (!confirm("Delete this lead?")) return;
    deleteMutation.mutate(selectedLead.id);
  }

  function setField(key: string, value: string) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function addNote() {
    if (!noteText.trim() || !selectedLead) return;
    const note: LocalNote = {
      text: noteText.trim(), by: "Admin",
      date: new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }),
    };
    setNotes(prev => ({ ...prev, [selectedLead.id]: [note, ...(prev[selectedLead.id] ?? [])] }));
    setNoteText("");
  }

  function addTask() {
    if (!taskDesc.trim() || !selectedLead) return;
    const task: LocalTask = { id: Date.now(), type: taskType, date: taskDate, desc: taskDesc.trim() };
    setTasks(prev => ({ ...prev, [selectedLead.id]: [task, ...(prev[selectedLead.id] ?? [])] }));
    setTaskDesc("");
    setTaskDate("");
  }

  function addDocFiles(files: FileList | null) {
    if (!files || !selectedLead) return;
    const key = selectedLead.id;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const doc: LocalDoc = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          type: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
          status: "Pending",
          dataUrl: ev.target?.result as string ?? null,
          uploadedAt: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
        };
        setDocs(prev => ({ ...prev, [key]: [...(prev[key] ?? []), doc] }));
      };
      reader.readAsDataURL(file);
    });
  }

  function deleteDocItem(docId: number) {
    if (!selectedLead) return;
    setDocs(prev => ({ ...prev, [selectedLead.id]: (prev[selectedLead.id] ?? []).filter(d => d.id !== docId) }));
  }

  function generateAI() {
    if (!selectedLead) return;
    setAiGenerating(true);
    setTimeout(() => {
      const l = selectedLead;
      const summary = `${l.fullName} is a ${l.status?.toLowerCase()} lead from ${l.companyName ?? "an unknown company"} in the ${l.industry ?? "unspecified"} industry. They are seeking ${l.loanAmount ?? "an unspecified amount"} for ${l.loanPurpose ?? "unspecified purposes"}. The lead was sourced via ${l.leadSource ?? "unknown channel"} and their preferred contact method is ${l.preferredContact ?? "email"}. Credit consent: ${l.creditConsent ?? "unknown"}.`;
      setAiText(prev => ({ ...prev, [selectedLead.id]: summary }));
      setAiGenerating(false);
    }, 800);
  }

  const currentKey = selectedLead?.id ?? "";
  const leadNotes = notes[currentKey] ?? [];
  const leadTasks = tasks[currentKey] ?? [];
  const leadDocs = docs[currentKey] ?? [];
  const aiSummary = aiText[currentKey];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <style>{`
        .form-input-premium{width:100%;background:#fdfdfd;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:10px;font-weight:600;color:#1e293b;outline:none;transition:all 0.2s;box-sizing:border-box;font-family:inherit;}
        .form-input-premium:focus:not(:disabled){border-color:#2447d7;background:white;box-shadow:0 0 0 4px rgba(36,71,215,0.05);}
        .form-input-premium:disabled{background:#f8fafc;border-color:#f1f5f9;color:#64748b;cursor:not-allowed;}
        .label-premium{font-size:9px;font-weight:700;color:#475569;margin-bottom:4px;display:block;}
        .detail-scrollbar::-webkit-scrollbar{width:3px;}
        .detail-scrollbar::-webkit-scrollbar-track{background:transparent;}
        .detail-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
        .lead-row:hover{background:#f8fafc;}
        .lead-row.selected{background:#f0f4ff;}
        .dtab{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:8px;border:none;background:none;font-size:8px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:all .15s;font-family:inherit;white-space:nowrap;}
        .dtab:hover{background:#f8fafc;color:#475569;}
        .dtab.active{background:#ebf0ff;color:#2447d7;}
        .sec-hdr{font-size:9px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px;border-bottom:2px solid #f1f5f9;padding-bottom:8px;display:flex;align-items:center;gap:6px;}
        .radio-btn{display:flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:10px;font-size:9px;font-weight:600;cursor:pointer;transition:all 0.2s;user-select:none;background:white;color:#64748b;}
        .radio-btn.active{border-color:#2447d7;background:#ebf0ff;color:#2447d7;}
        .dark-sel{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:5px 22px 5px 9px;font-size:9px;font-weight:700;color:#d1d5db;outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;}
        .dark-sel option{background:#1e293b;color:#fff;}
      `}</style>

      <div style={{display:"flex",gap:12,height:"100%",padding:12,background:"#f8fafc",minWidth:0,overflow:"hidden"}}>

        {/* LEFT PANEL */}
        {!isCreateMode && (
          <section style={{flex:1,minWidth:0,background:"#fff",borderRadius:24,border:"1px solid #f1f5f9",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 4px 25px rgba(0,0,0,.04)"}}>
            {/* Header */}
            <div style={{padding:"0 16px",background:"#111827",display:"flex",alignItems:"center",gap:12,minHeight:48,flexShrink:0,borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#fff",flexShrink:0,margin:0}}>Lead Database</h2>
              <span style={{fontSize:8,fontWeight:700,color:"#6b7280",fontFamily:"monospace",flexShrink:0}}>{data?.count ?? 0} records</span>
              <div style={{position:"relative",flex:1,minWidth:80}}>
                <svg style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,.3)",width:10,height:10}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Search leads..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{width:"100%",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"5px 10px 5px 26px",fontSize:9,fontWeight:600,color:"#fff",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <button onClick={enterCreateMode} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:8,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",flexShrink:0}}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                Add Lead
              </button>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="dark-sel">
                <option value="All">All Status</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cool">Cool</option>
              </select>
              <div style={{display:"flex",alignItems:"center",flexShrink:0,borderLeft:"1px solid rgba(255,255,255,.1)",paddingLeft:12,marginLeft:4}}>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderRight:"1px solid rgba(255,255,255,.1)"}}>
                  <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>{total}</span>
                  <span style={{fontSize:7,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em"}}>Total</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderRight:"1px solid rgba(255,255,255,.1)"}}>
                  <span style={{fontSize:13,fontWeight:900,color:"#fee2e2"}}>{hot}</span>
                  <span style={{fontSize:7,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em"}}>Hot</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px"}}>
                  <span style={{fontSize:13,fontWeight:900,color:"#fef3c7"}}>{warm}</span>
                  <span style={{fontSize:7,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em"}}>Warm</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{flex:1,overflowY:"auto"}} className="detail-scrollbar">
              <table style={{width:"100%",textAlign:"left",borderCollapse:"collapse"}}>
                <thead style={{position:"sticky",top:0,background:"#f9fafb",borderBottom:"1px solid #f3f4f6",zIndex:10}}>
                  <tr>
                    {["Lead","Company","Need","Status",""].map(h=>(
                      <th key={h} style={{padding:"6px 12px",fontSize:8,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} style={{textAlign:"center",padding:32,fontSize:10,color:"#94a3b8"}}>Loading...</td></tr>
                  ) : leads.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:"center",padding:48,fontSize:10,color:"#94a3b8"}}>No leads found</td></tr>
                  ) : leads.map(lead=>(
                    <tr key={lead.id} className={`lead-row${selectedLead?.id===lead.id?" selected":""}`}
                      onClick={()=>selectLead(lead)} style={{cursor:"pointer",borderBottom:"1px solid #f9fafb"}}>
                      <td style={{padding:"8px 12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:28,height:28,borderRadius:8,background:"#0f172a",color:"#fff",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{initials(lead.fullName)}</div>
                          <div>
                            <p style={{fontSize:10,fontWeight:700,color:"#0f172a",margin:0}}>{lead.fullName}</p>
                            <p style={{fontSize:8,color:"#94a3b8",fontFamily:"monospace",margin:0}}>{lead.caseId}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <p style={{fontSize:10,fontWeight:600,color:"#1e293b",margin:0}}>{lead.companyName}</p>
                        <p style={{fontSize:8,color:"#94a3b8",margin:0}}>{lead.industry}</p>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <p style={{fontSize:10,fontWeight:700,color:"#0f172a",margin:0}}>{lead.loanAmount}</p>
                        <p style={{fontSize:8,color:"#94a3b8",margin:0}}>{lead.loanPurpose}</p>
                      </td>
                      <td style={{padding:"8px 12px"}}><StatusBadge status={lead.status}/></td>
                      <td style={{padding:"8px 6px",width:24}}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{padding:"10px 16px",borderTop:"1px solid #f1f5f9",background:"rgba(249,250,251,.3)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <span style={{fontSize:8,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em"}}>{data?.count ?? 0} lead records</span>
              <button onClick={enterCreateMode} style={{fontSize:8,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                New Lead
              </button>
            </div>
          </section>
        )}

        {/* RIGHT PANEL */}
        <div style={{
          width:isCreateMode?"100%":480,flex:isCreateMode?1:undefined,
          display:"flex",flexDirection:"column",
          borderLeft:isCreateMode?"none":"1px solid #f3f4f6",
          background:"#fff",
          borderRadius:isCreateMode?24:0,
          border:isCreateMode?"1px solid #f1f5f9":undefined,
          boxShadow:isCreateMode?"0 4px 25px rgba(0,0,0,.04)":undefined,
          overflow:"hidden",transition:"all 0.3s ease",
        }}>

          {/* Panel Header */}
          <div style={{padding:"8px 12px",borderBottom:"1px solid #f9fafb",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {isCreateMode && (
                <button onClick={exitCreateMode} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0}}>
                  <div style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",background:"#f1f5f9",border:"1px solid #e2e8f0"}}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  </div>
                  <span style={{fontSize:9,fontWeight:900,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em"}}>Dashboard</span>
                </button>
              )}
              <div>
                {isCreateMode ? (
                  <h2 style={{fontSize:11,fontWeight:900,color:"#0f172a",textTransform:"uppercase",letterSpacing:"0.08em",margin:0}}>Register New Lead</h2>
                ) : (
                  <>
                    <h2 style={{fontSize:12,fontWeight:900,color:"#0f172a",lineHeight:1,margin:0}}>
                      {selectedLead ? selectedLead.fullName : "SELECT A LEAD"}
                    </h2>
                    <p style={{fontSize:9,color:"#2447d7",fontWeight:800,marginTop:2,letterSpacing:"0.06em"}}>
                      {selectedLead ? selectedLead.caseId : "CHOOSE FROM THE LIST"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,paddingRight:16,borderRight:"1px solid #f1f5f9"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <label style={{fontSize:8,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.04em"}}>Status</label>
                  <select value={formData.status ?? "Warm"} onChange={e=>setField("status",e.target.value)}
                    style={{width:64,height:24,padding:"0 6px",fontSize:9,fontWeight:700,border:"1px solid #e2e8f0",borderRadius:6,background:"rgba(249,250,251,.5)",outline:"none"}}>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cool">Cool</option>
                  </select>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <label style={{fontSize:8,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.04em"}}>ID</label>
                  <input type="text" value={formData.caseId ?? ""} disabled
                    style={{width:80,height:24,padding:"0 6px",fontSize:9,fontFamily:"monospace",fontWeight:700,border:"1px solid #e2e8f0",borderRadius:6,background:"rgba(249,250,251,.5)",outline:"none",color:"#2563eb"}}/>
                </div>
              </div>
              {!isCreateMode && (
                <button onClick={toggleEditMode} style={{height:28,padding:"0 12px",background:"#0f172a",color:"#fff",fontSize:8,fontWeight:700,borderRadius:8,border:"none",textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer"}}>
                  {isEditMode ? "Discard" : "Edit Lead"}
                </button>
              )}
              {(isEditMode || isCreateMode) && (
                <button onClick={handleSave} disabled={isSaving} style={{height:28,padding:"0 12px",background:"#d97706",color:"#fff",fontSize:8,fontWeight:700,borderRadius:8,border:"none",textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",opacity:isSaving?0.7:1}}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              )}
              <div style={{width:6,height:6,borderRadius:"50%",background:dotColor(formData.status),flexShrink:0}}/>
            </div>
          </div>

          {/* Tab Nav */}
          {!isCreateMode && (
            <div style={{display:"flex",alignItems:"center",gap:2,padding:"6px 12px",borderBottom:"1px solid #f1f5f9",background:"#fff",flexShrink:0}}>
              {([
                {id:"details",icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",label:"Contact Info"},
                {id:"tasks",icon:"M9 11l3 3L22 4",label:"Follow-ups"},
                {id:"ai",icon:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",label:"AI Summary"},
                {id:"notes",icon:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",label:"Notes"},
                {id:"docs",icon:"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",label:"Documents"},
              ] as {id:TabId;icon:string;label:string}[]).map(t=>(
                <button key={t.id} className={`dtab${activeTab===t.id?" active":""}`} onClick={()=>setActiveTab(t.id)}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={t.icon}/></svg>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div style={{flex:1,overflowY:"auto",background:"#fcfcfd"}} className="detail-scrollbar">

            {/* DETAILS / CONTACT INFO TAB */}
            {(activeTab === "details" || isCreateMode) && (
              <div style={{padding:isCreateMode?"15px 25px":"16px",display:"flex",flexDirection:"column",gap:24}}>

                {/* Contact Information */}
                <section>
                  <h3 className="sec-hdr">Contact Information</h3>
                  <div style={{display:"grid",gridTemplateColumns:isCreateMode?"repeat(3,1fr)":"repeat(2,1fr)",gap:"12px 16px"}}>
                    <div>
                      <label className="label-premium">Title <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="e.g. Mr, Mrs, Dr..." value={formData.title??""} onChange={e=>setField("title",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Full Name <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="e.g. Jonathan Doe" value={formData.fullName??""} onChange={e=>setField("fullName",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Date of Birth <span style={{color:"#ef4444"}}>*</span></label>
                      <input type="date" className="form-input-premium" value={formData.dob??""} onChange={e=>setField("dob",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Company Name <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="Registered name..." value={formData.companyName??""} onChange={e=>setField("companyName",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Company House Number <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="e.g. 12345678" value={formData.companyHouseNumber??""} onChange={e=>setField("companyHouseNumber",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Business Annual Turnover <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="£0.00" value={formData.businessAnnualTurnover??""} onChange={e=>setField("businessAnnualTurnover",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Job Title / Position</label>
                      <input className="form-input-premium" placeholder="Managing Director" value={formData.jobTitle??""} onChange={e=>setField("jobTitle",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Industry</label>
                      <select className="form-input-premium" value={formData.industry??""} onChange={e=>setField("industry",e.target.value)} disabled={!isEditMode}>
                        <option value="">Select industry...</option>
                        {INDUSTRY_OPTIONS.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Email Address <span style={{color:"#ef4444"}}>*</span></label>
                      <input type="email" className="form-input-premium" placeholder="client@example.com" value={formData.emailAddress??""} onChange={e=>setField("emailAddress",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Phone Number <span style={{color:"#ef4444"}}>*</span></label>
                      <input type="tel" className="form-input-premium" placeholder="+44 77..." value={formData.phoneNumber??""} onChange={e=>setField("phoneNumber",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div style={{gridColumn:isCreateMode?"span 1":"span 2"}}>
                      <label className="label-premium">Preferred Method</label>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {["Email","Phone","WhatsApp","Other"].map(m=>(
                          <div key={m} className={`radio-btn${formData.preferredContact===m?" active":""}`}
                            onClick={()=>isEditMode&&setField("preferredContact",m)}
                            style={{fontSize:9,padding:"6px 10px",cursor:isEditMode?"pointer":"default"}}>
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label-premium">Home Owner <span style={{color:"#ef4444"}}>*</span></label>
                      <select className="form-input-premium" value={formData.homeOwner??""} onChange={e=>setField("homeOwner",e.target.value)} disabled={!isEditMode}>
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Time at Current Address</label>
                      <input className="form-input-premium" placeholder="e.g. 3 years" value={formData.timeAtCurrentAddress??""} onChange={e=>setField("timeAtCurrentAddress",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div style={{gridColumn:"span 2"}}>
                      <label className="label-premium">Residential Address <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="Full address..." value={formData.residentialAddress??""} onChange={e=>setField("residentialAddress",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div style={{gridColumn:"span 2"}}>
                      <label className="label-premium">Previous Address</label>
                      <input className="form-input-premium" placeholder="Previous if < 3 years..." value={formData.previousAddress??""} onChange={e=>setField("previousAddress",e.target.value)} disabled={!isEditMode}/>
                    </div>
                  </div>
                </section>

                {/* Loan Details */}
                <section>
                  <h3 className="sec-hdr">Loan Details</h3>
                  <div style={{display:"grid",gridTemplateColumns:isCreateMode?"repeat(3,1fr)":"repeat(2,1fr)",gap:"12px 16px"}}>
                    <div>
                      <label className="label-premium">Amount Needed <span style={{color:"#ef4444"}}>*</span></label>
                      <input className="form-input-premium" placeholder="£0.00" value={formData.loanAmount??""} onChange={e=>setField("loanAmount",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Purpose of Taking Loan</label>
                      <input className="form-input-premium" placeholder="Business expansion..." value={formData.loanPurpose??""} onChange={e=>setField("loanPurpose",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Existing Loan</label>
                      <select className="form-input-premium" value={formData.existingLoan??""} onChange={e=>{setField("existingLoan",e.target.value);setShowExistingLoan(e.target.value==="Yes");}} disabled={!isEditMode}>
                        <option value="No">No</option><option value="Yes">Yes</option>
                      </select>
                    </div>
                    {showExistingLoan && (
                      <div style={{gridColumn:isCreateMode?"span 3":"span 2",background:"rgba(248,250,252,.5)",padding:16,borderRadius:16,border:"1px solid #f1f5f9"}}>
                        <p style={{fontSize:10,fontWeight:700,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Existing Indebtedness</p>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                          <input className="form-input-premium" placeholder="Lender Name" disabled={!isEditMode} style={{background:"#fff"}}/>
                          <input className="form-input-premium" placeholder="Amount Taken (£)" disabled={!isEditMode} style={{background:"#fff"}}/>
                          <input className="form-input-premium" placeholder="Interest Rate (%)" disabled={!isEditMode} style={{background:"#fff"}}/>
                          <input className="form-input-premium" placeholder="Monthly Repayment (£)" disabled={!isEditMode} style={{background:"#fff"}}/>
                          <input className="form-input-premium" placeholder="Loan Term" disabled={!isEditMode} style={{background:"#fff",gridColumn:"span 2"}}/>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="label-premium">Overdraft Facility</label>
                      <select className="form-input-premium" value={formData.overdraftFacility??""} onChange={e=>setField("overdraftFacility",e.target.value)} disabled={!isEditMode}>
                        <option>No</option><option>Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Which Bank is your Company with</label>
                      <select className="form-input-premium" value={formData.companyBank??""} onChange={e=>setField("companyBank",e.target.value)} disabled={!isEditMode}>
                        <option value="">Select a bank...</option>
                        {BANK_OPTIONS.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Lead Source</label>
                      <select className="form-input-premium" value={formData.leadSource??""} onChange={e=>setField("leadSource",e.target.value)} disabled={!isEditMode}>
                        <option value="">Select source...</option>
                        {LEAD_SOURCE_OPTIONS.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">How soon do you need this funding?</label>
                      <input className="form-input-premium" placeholder="e.g. Within 2 weeks" value={formData.fundingTimeline??""} onChange={e=>setField("fundingTimeline",e.target.value)} disabled={!isEditMode}/>
                    </div>
                    <div>
                      <label className="label-premium">Previous Alpha Funding Loan <span style={{color:"#ef4444"}}>*</span></label>
                      <select className="form-input-premium" value={formData.previousAlphaFundingLoan??""} onChange={e=>setField("previousAlphaFundingLoan",e.target.value)} disabled={!isEditMode}>
                        <option>No</option><option>Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Credit Search Consent <span style={{color:"#ef4444"}}>*</span></label>
                      <p style={{fontSize:7,color:"#6b7280",fontStyle:"italic",marginBottom:4}}>Does the client consent to a credit search being carried out?</p>
                      <select className="form-input-premium" value={formData.creditConsent??""} onChange={e=>setField("creditConsent",e.target.value)} disabled={!isEditMode}>
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Supporting Docs + Additional Comments */}
                <div style={{display:"grid",gridTemplateColumns:isCreateMode?"1fr 2fr":"1fr",gap:"12px 16px"}}>
                  <section>
                    <h3 className="sec-hdr" style={{marginBottom:6,paddingBottom:4}}>Supporting Documents</h3>
                    <div onClick={()=>docFileRef.current?.click()} style={{padding:8,border:"2px dashed #f1f5f9",borderRadius:8,background:"rgba(248,250,252,.1)",textAlign:"center",marginBottom:4,cursor:"pointer"}}>
                      <p style={{fontSize:7.5,fontWeight:900,color:"#d1d5db",textTransform:"uppercase",letterSpacing:"0.04em",margin:0}}>Drop Docs</p>
                      <input ref={docFileRef} type="file" multiple style={{display:"none"}} onChange={e=>addDocFiles(e.target.files)}/>
                    </div>
                  </section>
                  <section>
                    <h3 className="sec-hdr" style={{marginBottom:6,paddingBottom:4}}>Additional Comments</h3>
                    <textarea className="form-input-premium" rows={3} placeholder="Enter context/notes..." value={formData.additionalComments??""} onChange={e=>setField("additionalComments",e.target.value)} disabled={!isEditMode} style={{resize:"none",height:80}}/>
                  </section>
                </div>

                {/* Schedule Follow-up (edit mode only) */}
                {isEditMode && (
                  <section style={{background:"#f0f4ff",borderRadius:12,border:"1px solid #dbeafe",padding:16}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,borderBottom:"1px solid #bfdbfe",paddingBottom:8}}>
                      <h4 style={{fontSize:10,fontWeight:900,color:"#2447d7",textTransform:"uppercase",letterSpacing:"0.08em",margin:0}}>Schedule Follow-up</h4>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6"}}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:isCreateMode?"repeat(3,1fr)":"repeat(2,1fr)",gap:"10px 12px"}}>
                      <div style={{gridColumn:"span 2"}}>
                        <label className="label-premium">Task Description</label>
                        <input className="form-input-premium" placeholder="Title..." style={{background:"#fff"}} value={taskDesc} onChange={e=>setTaskDesc(e.target.value)}/>
                      </div>
                      <div>
                        <label className="label-premium">Task Type</label>
                        <select className="form-input-premium" style={{background:"#fff"}} value={taskType} onChange={e=>setTaskType(e.target.value)}>
                          {TASK_TYPE_OPTIONS.map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label-premium">Date</label>
                        <input type="date" className="form-input-premium" style={{background:"#fff"}} value={taskDate} onChange={e=>setTaskDate(e.target.value)}/>
                      </div>
                      <div style={{display:"flex",alignItems:"flex-end"}}>
                        <button onClick={addTask} style={{width:"100%",padding:"8px 0",background:"#2447d7",color:"#fff",fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.08em",border:"none",borderRadius:8,cursor:"pointer"}}>
                          Create Task
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Delete Lead */}
                {!isCreateMode && selectedLead && (
                  <div style={{paddingTop:16,borderTop:"1px solid #f1f5f9",marginTop:8}}>
                    <button onClick={handleDelete} style={{width:"100%",padding:"10px 0",border:"1px solid #fecaca",color:"#f87171",fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",background:"none",borderRadius:8,cursor:"pointer"}}>
                      Delete Lead
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FOLLOW-UPS TAB */}
            {activeTab === "tasks" && !isCreateMode && (
              <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                {leadTasks.length === 0 ? (
                  <p style={{fontSize:9,color:"#94a3b8",textAlign:"center",padding:"24px 0",fontStyle:"italic"}}>No tasks scheduled for this lead</p>
                ) : leadTasks.map(t=>{
                  const icons: Record<string,string> = {Call:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",Meeting:"M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",Email:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",Document:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"};
                  const icon = icons[t.type] ?? icons.Call;
                  return (
                    <div key={t.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,background:"#f1f5f9",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d={icon}/></svg>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:11,fontWeight:700,color:"#0f172a",margin:0}}>{t.desc}</p>
                        <p style={{fontSize:9,color:"#94a3b8",margin:"2px 0 0"}}>{t.type}{t.date ? " · " + t.date : ""}</p>
                      </div>
                    </div>
                  );
                })}
                <div style={{paddingTop:12,borderTop:"1px solid #f1f5f9"}}>
                  <p style={{fontSize:8,fontWeight:900,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Add Follow-up</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div>
                      <label className="label-premium">Type</label>
                      <select className="form-input-premium" style={{background:"#fff"}} value={taskType} onChange={e=>setTaskType(e.target.value)}>
                        {TASK_TYPE_OPTIONS.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Date</label>
                      <input type="date" className="form-input-premium" style={{background:"#fff"}} value={taskDate} onChange={e=>setTaskDate(e.target.value)}/>
                    </div>
                  </div>
                  <div style={{marginBottom:8}}>
                    <label className="label-premium">Description</label>
                    <input className="form-input-premium" style={{background:"#fff"}} placeholder="Task description..." value={taskDesc} onChange={e=>setTaskDesc(e.target.value)}/>
                  </div>
                  <button onClick={addTask} style={{width:"100%",padding:"8px 0",background:"#0f172a",color:"#fff",fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.08em",border:"none",borderRadius:8,cursor:"pointer"}}>
                    Add Task
                  </button>
                </div>
              </div>
            )}

            {/* AI SUMMARY TAB */}
            {activeTab === "ai" && !isCreateMode && (
              <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{background:"linear-gradient(135deg,#eef2ff,#f5f3ff)",border:"1px solid #e0e7ff",borderRadius:12,padding:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{width:32,height:32,background:"#4f46e5",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/></svg>
                    </div>
                    <div style={{flex:1}}>
                      <p style={{fontSize:11,fontWeight:800,color:"#3730a3",margin:0}}>AI Lead Summary</p>
                      <p style={{fontSize:8,color:"#6366f1",fontWeight:600,margin:0}}>Powered by lead data</p>
                    </div>
                    <button onClick={generateAI} disabled={aiGenerating} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:8,fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",cursor:"pointer",flexShrink:0,opacity:aiGenerating?0.7:1}}>
                      {aiGenerating ? "Generating..." : aiSummary ? "Regenerate" : "Generate"}
                    </button>
                  </div>
                  {!aiSummary ? (
                    <div style={{textAlign:"center",padding:"16px 0"}}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="2" style={{display:"block",margin:"0 auto 8px"}}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>
                      <p style={{fontSize:9,color:"#a5b4fc",fontWeight:600}}>Click Generate to create an AI summary for this lead</p>
                    </div>
                  ) : (
                    <p style={{fontSize:11,color:"#1e1b4b",lineHeight:1.8,fontStyle:"italic",margin:0}}>{aiSummary}</p>
                  )}
                </div>
                {aiSummary && selectedLead && (
                  <div style={{background:"#fff",border:"1px solid #f1f5f9",borderRadius:12,padding:12}}>
                    <p style={{fontSize:8,fontWeight:900,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Key Data Points</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {([["Status",selectedLead.status],["Amount",selectedLead.loanAmount],["Purpose",selectedLead.loanPurpose],["Bank",selectedLead.companyBank],["Industry",selectedLead.industry],["Source",selectedLead.leadSource],["Home Owner",selectedLead.homeOwner],["Credit",selectedLead.creditConsent]] as [string,string|undefined][]).filter(([,v])=>v).map(([k,v])=>(
                        <div key={k} style={{background:"#f8fafc",border:"1px solid #f1f5f9",borderRadius:8,padding:"8px 10px"}}>
                          <p style={{fontSize:7,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",margin:0}}>{k}</p>
                          <p style={{fontSize:10,fontWeight:700,color:"#0f172a",margin:"2px 0 0"}}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === "notes" && !isCreateMode && (
              <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                {leadNotes.length === 0 ? (
                  <p style={{fontSize:9,color:"#94a3b8",textAlign:"center",padding:"24px 0"}}>No notes yet</p>
                ) : leadNotes.map((n,i)=>{
                  const ini = (n.by||"A").split(" ").map((w:string)=>w[0]).join("").toUpperCase().slice(0,2);
                  return (
                    <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px"}}>
                      <p style={{fontSize:11,color:"#334155",lineHeight:1.6,margin:"0 0 10px"}}>{n.text}</p>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:22,height:22,background:"#e0e7ff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:7,fontWeight:900,color:"#4f46e5"}}>{ini}</span>
                        </div>
                        <p style={{fontSize:9,fontWeight:600,color:"#64748b",margin:0}}>{n.by}{n.date ? " · " + n.date : ""}</p>
                      </div>
                    </div>
                  );
                })}
                <div style={{paddingTop:12,borderTop:"1px solid #f1f5f9"}}>
                  <p style={{fontSize:8,fontWeight:900,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Add Note</p>
                  <textarea className="form-input-premium" rows={4} placeholder="Write a note..." style={{background:"#fff",resize:"none",marginBottom:8}} value={noteText} onChange={e=>setNoteText(e.target.value)}/>
                  <button onClick={addNote} style={{width:"100%",padding:"8px 0",background:"#0f172a",color:"#fff",fontSize:8,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.08em",border:"none",borderRadius:8,cursor:"pointer"}}>
                    Save Note
                  </button>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "docs" && !isCreateMode && (
              <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                <div
                  onClick={()=>docFileRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();(e.currentTarget as HTMLDivElement).style.borderColor="#2447d7";}}
                  onDragLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="#e2e8f0";}}
                  onDrop={e=>{e.preventDefault();(e.currentTarget as HTMLDivElement).style.borderColor="#e2e8f0";addDocFiles(e.dataTransfer.files);}}
                  style={{border:"2px dashed #e2e8f0",borderRadius:12,padding:20,textAlign:"center",cursor:"pointer",background:"#f8fafc",transition:"all .2s"}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{display:"block",margin:"0 auto 8px"}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <p style={{fontSize:10,fontWeight:700,color:"#6b7280",margin:0}}>Click or drag files to upload</p>
                  <p style={{fontSize:8,color:"#9ca3af",marginTop:4}}>PDF, JPG, PNG, XLSX accepted</p>
                  <input ref={docFileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx" style={{display:"none"}} onChange={e=>addDocFiles(e.target.files)}/>
                </div>
                {leadDocs.length === 0 ? (
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#cbd5e1"}}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{display:"block",margin:"0 auto 12px"}}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    <p style={{fontSize:10,fontWeight:700}}>No documents uploaded yet</p>
                  </div>
                ) : leadDocs.map(doc=>{
                  const iconMap: Record<string,string> = {PDF:"#ef4444",JPG:"#3b82f6",JPEG:"#3b82f6",PNG:"#3b82f6",XLSX:"#22c55e",XLS:"#22c55e",DOC:"#3b82f6",DOCX:"#3b82f6"};
                  const iconColor = iconMap[doc.type] ?? "#94a3b8";
                  const stCfg: Record<string,{bg:string;color:string;label:string}> = {
                    Pending:{bg:"#f1f5f9",color:"#475569",label:"Pending"},
                    Approved:{bg:"#dcfce7",color:"#15803d",label:"Approved"},
                    Rejected:{bg:"#fee2e2",color:"#b91c1c",label:"Rejected"},
                    Reupload:{bg:"#fef3c7",color:"#b45309",label:"Re-upload"},
                  };
                  const st = stCfg[doc.status] ?? stCfg.Pending;
                  return (
                    <div key={doc.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#fff",border:"1px solid #f1f5f9",borderRadius:12}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" style={{flexShrink:0}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:10,fontWeight:700,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",margin:0}}>{doc.name}</p>
                        <p style={{fontSize:8,color:"#94a3b8",marginTop:1}}>{doc.type}{doc.size ? " · " + doc.size : ""}{doc.uploadedAt ? " · " + doc.uploadedAt : ""}</p>
                      </div>
                      <span style={{fontSize:7,fontWeight:800,padding:"3px 8px",borderRadius:99,background:st.bg,color:st.color,textTransform:"uppercase",flexShrink:0}}>{st.label}</span>
                      <div style={{display:"flex",gap:4,flexShrink:0}}>
                        <button onClick={()=>setPreviewDoc(doc)} title="Preview" style={{width:26,height:26,borderRadius:6,background:"#f1f5f9",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button onClick={()=>deleteDocItem(doc.id)} title="Delete" style={{width:26,height:26,borderRadius:6,background:"#fee2e2",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>{/* end tab content */}
        </div>{/* end right panel */}
      </div>{/* end container */}

      {/* Doc Preview Modal */}
      {previewDoc && (
        <div onClick={()=>setPreviewDoc(null)} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(15,23,42,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,width:560,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,0.2)"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div>
                  <p style={{fontSize:11,fontWeight:800,color:"#0f172a",margin:0}}>{previewDoc.name}</p>
                  <p style={{fontSize:8,color:"#94a3b8",marginTop:2}}>{previewDoc.size ?? ""}{previewDoc.uploadedAt ? " · " + previewDoc.uploadedAt : ""}</p>
                </div>
              </div>
              <button onClick={()=>setPreviewDoc(null)} style={{width:28,height:28,borderRadius:"50%",background:"#f1f5f9",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{flex:1,overflow:"auto",padding:20,display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",borderRadius:"0 0 20px 20px",minHeight:300}}>
              {previewDoc.dataUrl && ["JPG","JPEG","PNG"].includes(previewDoc.type) ? (
                <img src={previewDoc.dataUrl} style={{maxWidth:"100%",maxHeight:400,borderRadius:8,objectFit:"contain"}} alt={previewDoc.name}/>
              ) : previewDoc.dataUrl && previewDoc.type === "PDF" ? (
                <iframe src={previewDoc.dataUrl} style={{width:"100%",height:400,border:"none",borderRadius:8}}/>
              ) : (
                <div style={{textAlign:"center"}}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1" style={{display:"block",margin:"0 auto"}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <p style={{fontSize:11,color:"#94a3b8",marginTop:12,fontWeight:600}}>{previewDoc.name}</p>
                  <p style={{fontSize:9,color:"#cbd5e1",marginTop:4}}>Preview not available for this file type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
