import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          "input-field",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[8px] font-bold text-red-500">{error}</p>
      )}
    </div>
  )
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={clsx("input-field", className)}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[8px] font-bold text-red-500">{error}</p>
      )}
    </div>
  )
);
Select.displayName = "Select";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx("input-field resize-none", className)}
        {...props}
      />
      {error && (
        <p className="text-[8px] font-bold text-red-500">{error}</p>
      )}
    </div>
  )
);
Textarea.displayName = "Textarea";
