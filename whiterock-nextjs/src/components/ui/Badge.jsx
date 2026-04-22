import { clsx } from 'clsx';

const variants = {
  green:   'bg-green-100 text-green-700',
  red:     'bg-red-100 text-red-700',
  yellow:  'bg-yellow-100 text-yellow-700',
  blue:    'bg-brand-50 text-brand',
  purple:  'bg-purple-100 text-purple-700',
  gray:    'bg-surface text-subtle border border-surface-border',
  navy:    'bg-navy-800 text-white',
  indigo:  'bg-indigo-50 text-indigo-600',
  orange:  'bg-orange-100 text-orange-700',
};

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider whitespace-nowrap',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
