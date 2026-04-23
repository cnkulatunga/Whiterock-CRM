import { clsx } from "clsx";
import type { LeadStatus, TaskStatus } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "hot" | "warm" | "cool" | "active" | "inactive" | "default";
  className?: string;
}

const variants = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-700",
  cool: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  default: "bg-slate-100 text-slate-600",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, "hot" | "warm" | "cool"> = {
    Hot: "hot",
    Warm: "warm",
    Cool: "cool",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    "To Do": "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-100 text-blue-700",
    Complete: "bg-emerald-100 text-emerald-700",
    Overdue: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide",
        map[status]
      )}
    >
      {status}
    </span>
  );
}
