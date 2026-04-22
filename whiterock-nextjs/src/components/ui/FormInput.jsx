'use client';
import { clsx } from 'clsx';
import { useState } from 'react';

export function FormField({ label, error, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[8px] font-black text-subtle uppercase tracking-[.08em]">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[8px] text-muted font-medium">{hint}</p>}
      {error && <p className="text-[8px] text-red-500 font-bold">{error}</p>}
    </div>
  );
}

export function Input({
  label,
  error,
  required,
  hint,
  icon,
  className,
  type = 'text',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[10px] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          className={clsx(
            'form-input-premium',
            icon && 'pl-8',
            type === 'password' && 'pr-8',
            error && 'border-red-300 bg-red-50',
            className
          )}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-subtle text-[10px]"
          >
            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} />
          </button>
        )}
      </div>
    </FormField>
  );
}

export function Select({ label, error, required, hint, options, className, ...props }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <select
        className={clsx(
          'form-input-premium appearance-none cursor-pointer',
          error && 'border-red-300 bg-red-50',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

export function Textarea({ label, error, required, hint, className, rows = 3, ...props }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <textarea
        rows={rows}
        className={clsx(
          'form-input-premium resize-none',
          error && 'border-red-300 bg-red-50',
          className
        )}
        {...props}
      />
    </FormField>
  );
}
