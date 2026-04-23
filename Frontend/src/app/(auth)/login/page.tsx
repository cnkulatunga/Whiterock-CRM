"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore, ROLE_LANDING } from "@/store/authStore";
import toast from "react-hot-toast";

const DEMO_ROLES = [
  { name: "Super Admin",    email: "admin@taskflow.com",      role: "Admin",            avatar: "SA", avatarBg: "#6366f1", roleBg: "#eef2ff", roleColor: "#4f46e5",  access: "Full System Access" },
  { name: "Amal Jayasekera",email: "amal@taskflow.com",       role: "Team Leader",      avatar: "AJ", avatarBg: "#0891b2", roleBg: "#ecfeff", roleColor: "#0e7490",  access: "Leads · Pipeline · Team Reports" },
  { name: "Thanushika R.",  email: "thanushika@taskflow.com", role: "Tele Agent",       avatar: "TR", avatarBg: "#16a34a", roleBg: "#f0fdf4", roleColor: "#15803d",  access: "Leads · Tasks · Follow-ups" },
  { name: "Nirosha K.",     email: "nirosha@taskflow.com",    role: "Accounts Manager", avatar: "NK", avatarBg: "#d97706", roleBg: "#fef3c7", roleColor: "#92400e",  access: "Payouts · Lenders · Documents" },
];

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [quickLoading, setQuickLoading] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: tokens } = await authApi.login(data.email, data.password);
      setTokens(tokens.access, tokens.refresh);
      const { data: me } = await authApi.me();
      setUser(me);
      router.push(ROLE_LANDING[me.role as keyof typeof ROLE_LANDING] ?? "/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const handleQuickLogin = async (idx: number) => {
    const role = DEMO_ROLES[idx];
    setQuickLoading(idx);
    try {
      const { data: tokens } = await authApi.login(role.email, "Pass@123");
      setTokens(tokens.access, tokens.refresh);
      const { data: me } = await authApi.me();
      setUser(me);
      router.push(ROLE_LANDING[me.role as keyof typeof ROLE_LANDING] ?? "/dashboard");
    } catch {
      toast.error("Quick login failed — check backend");
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left branding panel */}
      <div className="w-[420px] flex-shrink-0 bg-navy flex flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at -80px -80px, rgba(99,102,241,.18) 0%, transparent 70%), radial-gradient(circle at 120% 120%, rgba(16,185,129,.12) 0%, transparent 70%)",
          }}
        />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">AF</span>
          </div>
          <div>
            <p className="text-white font-black text-sm">Alpha Funding CRM</p>
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">
              Enterprise Edition
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-white font-black text-3xl leading-tight tracking-tight mb-3">
            Precision Lending,<br />Simplified.
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The all-in-one platform for managing leads, loans, teams and
            documents — built for modern mortgage brokers.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { color: "#6366f1", text: "Real-time Pipeline Intelligence" },
              { color: "#10b981", text: "Role-Based Access Control" },
              { color: "#f59e0b", text: "Automated Document Vault" },
              { color: "#ec4899", text: "Live Team Activity Monitor" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-slate-400 text-xs font-semibold">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-slate-600 text-[10px] font-semibold relative z-10">
          © 2026 Alpha Funding CRM. Secure Enterprise Access.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            Welcome back
          </h2>
          <p className="text-slate-400 text-xs font-medium mb-7">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@alphafunding.com"
                className="input-field"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[8px] text-red-500 font-bold mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[8px] text-red-500 font-bold mt-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-[8px] text-slate-400 mt-1.5">
                Demo password:{" "}
                <code className="bg-slate-100 px-1 rounded text-slate-600">
                  Pass@123
                </code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"24px 0 16px" }}>
            <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
            <span style={{ fontSize:9, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".1em", whiteSpace:"nowrap" }}>Quick Login</span>
            <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
          </div>

          {/* Role cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {DEMO_ROLES.map((r, i) => (
              <button
                key={r.email}
                onClick={() => handleQuickLogin(i)}
                disabled={quickLoading !== null}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:10, cursor:"pointer", transition:"all .15s", textAlign:"left", opacity: quickLoading !== null && quickLoading !== i ? 0.5 : 1 }}
              >
                <div style={{ width:32, height:32, borderRadius:9, background:r.avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fff", flexShrink:0 }}>
                  {quickLoading === i ? <span style={{ width:12, height:12, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .6s linear infinite" }} /> : r.avatar}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#0f172a" }}>{r.name}</div>
                  <div style={{ fontSize:9, fontWeight:600, color:"#94a3b8", marginTop:1 }}>{r.email}</div>
                </div>
                <span style={{ fontSize:8, fontWeight:800, padding:"2px 7px", borderRadius:99, background:r.roleBg, color:r.roleColor, textTransform:"uppercase", letterSpacing:".04em", flexShrink:0 }}>{r.role}</span>
                <i className="fa-solid fa-chevron-right" style={{ fontSize:9, color:"#cbd5e1", flexShrink:0 }} />
              </button>
            ))}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
