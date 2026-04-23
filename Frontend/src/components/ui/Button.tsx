import { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "indigo";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-black",
  secondary:
    "bg-slate-100 text-slate-600 hover:bg-slate-200",
  danger:
    "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  ghost:
    "bg-transparent text-slate-500 hover:bg-slate-100",
  indigo:
    "bg-indigo-600 text-white hover:bg-indigo-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[8px]",
  md: "px-4 py-2 text-[9px]",
  lg: "px-6 py-3 text-[10px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      icon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center gap-2 font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer border-none",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
