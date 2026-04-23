"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, ROLE_NAV } from "@/store/authStore";

const NAV_ITEMS = [
  { key: "dashboard", href: "/dashboard", icon: "fa-solid fa-gauge-high", label: "Dashboard" },
  { key: "tasks",     href: "/tasks",     icon: "fa-solid fa-tasks",       label: "Tasks" },
  { key: "leads",     href: "/leads",     icon: "fa-solid fa-user-group",  label: "Leads" },
  { key: "pipeline",  href: "/pipeline",  icon: "fa-solid fa-diagram-project", label: "Pipeline" },
  { key: "lenders",   href: "/lenders",   icon: "fa-solid fa-hand-holding-dollar", label: "Lenders" },
  { key: "docs",      href: "/documents", icon: "fa-solid fa-folder-open", label: "Docs" },
  { key: "users",     href: "/users",     icon: "fa-solid fa-user-gear",   label: "Users" },
  { key: "reports",   href: "/reports",   icon: "fa-solid fa-chart-line",  label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const allowed = user ? ROLE_NAV[user.role] : [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav style={{
      width: 70,
      background: "#0f172a",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 0",
      gap: 4,
      borderRight: "1px solid #1e293b",
      flexShrink: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 24 }}>
        <img
          src="/logo/alpha.png"
          alt="Alpha Funding"
          style={{ width: 38, height: 38, objectFit: "contain", borderRadius: 8 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Nav Items */}
      {NAV_ITEMS.filter((item) => allowed.includes(item.key)).map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.key}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: active ? "#fff" : "#94a3b8",
              transition: "all .2s",
              cursor: "pointer",
              textDecoration: "none",
              padding: "6px 4px",
              borderRadius: 8,
              width: 54,
              background: active ? "rgba(255,255,255,.08)" : "transparent",
            }}
            onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; } }}
            onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
          >
            <i className={item.icon} style={{ fontSize: 14 }} />
            <span style={{
              fontSize: 7,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".05em",
              textAlign: "center",
              lineHeight: 1,
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* Profile */}
      <Link
        href="/profile"
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 4, color: "#94a3b8", textDecoration: "none",
          padding: "6px 4px", borderRadius: 8, width: 54, transition: "all .2s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <i className="fa-solid fa-circle-user" style={{ fontSize: 14 }} />
        <span style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
          Profile
        </span>
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 4, color: "#94a3b8", background: "none", border: "none",
          cursor: "pointer", padding: "6px 4px", borderRadius: 8, width: 54,
          marginBottom: 8, transition: "all .2s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 14 }} />
        <span style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
          Logout
        </span>
      </button>
    </nav>
  );
}
