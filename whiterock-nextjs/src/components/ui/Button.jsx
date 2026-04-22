'use client';
import { clsx } from 'clsx';

const variants = {
  primary:   'bg-navy text-white hover:bg-navy-800 active:scale-[.98] shadow-sm',
  brand:     'bg-brand text-white hover:bg-brand-600 active:scale-[.98] shadow-sm',
  secondary: 'bg-surface text-subtle border border-surface-border hover:bg-surface-border',
  ghost:     'text-subtle hover:bg-surface hover:text-navy',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:scale-[.98]',
  outline:   'border border-brand text-brand hover:bg-brand-50',
};

const sizes = {
  xs: 'px-2.5 py-1 text-[9px] rounded-lg',
  sm: 'px-3 py-1.5 text-[10px] rounded-lg',
  md: 'px-4 py-2 text-[11px] rounded-xl',
  lg: 'px-5 py-2.5 text-[12px] rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  icon,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="text-[11px]">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
