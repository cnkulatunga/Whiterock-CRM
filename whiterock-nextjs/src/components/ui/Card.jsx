import { clsx } from 'clsx';

export function Card({ children, className, hover = false, padding = true }) {
  return (
    <div
      className={clsx(
        'bg-white border border-surface-border rounded-[20px]',
        'shadow-[0_4px_20px_rgba(0,0,0,0.03)]',
        hover && 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        padding && 'p-5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, delta, icon, color = '#2447d7', className }) {
  return (
    <Card hover className={clsx('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[.05em] text-subtle">{label}</p>
        {icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[13px]"
            style={{ background: color }}
          >
            <i className={icon} />
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-navy tracking-tight">{value}</p>
      {delta !== undefined && (
        <p className={clsx('text-[9px] font-bold flex items-center gap-1', delta >= 0 ? 'text-green-600' : 'text-red-500')}>
          <i className={`fas fa-arrow-${delta >= 0 ? 'up' : 'down'} text-[8px]`} />
          {Math.abs(delta)}% vs last month
        </p>
      )}
    </Card>
  );
}

export function PanelCard({ children, className }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-[12px] border border-surface-border',
        'shadow-[0_1px_2px_rgba(0,0,0,.05)] flex flex-col overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({ title, subtitle, actions, icon }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border flex-shrink-0">
      <div className="flex items-center gap-2.5">
        {icon && <div className="w-6 h-6 rounded-lg bg-brand-50 flex items-center justify-center"><i className={`${icon} text-[10px] text-brand`} /></div>}
        <div>
          <p className="text-[11px] font-black text-navy">{title}</p>
          {subtitle && <p className="text-[9px] text-muted font-medium">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
