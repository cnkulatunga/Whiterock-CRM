import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={clsx(
        "glass-card",
        hover && "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function CardHeader({ children, className, dark }: CardHeaderProps) {
  return (
    <div
      className={clsx(
        "px-5 py-3 border-b flex items-center justify-between",
        dark
          ? "bg-slate-900 border-white/5"
          : "bg-white border-slate-100",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  dark?: boolean;
}

export function CardTitle({ children, icon, dark }: CardTitleProps) {
  return (
    <h3
      className={clsx(
        "text-[11px] font-black uppercase tracking-widest flex items-center gap-2",
        dark ? "text-white" : "text-slate-900"
      )}
    >
      {icon}
      {children}
    </h3>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={clsx("flex-1 overflow-y-auto p-4", className)}>
      {children}
    </div>
  );
}
