import React from "react";
import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { IFormField } from "@/app/types/app";

// Define supported input types
type InputTypes =
  | "text"
  | "password"
  | "email"
  | "date"
  | "time"
  | "datetime-local"
  | "radio"
  | "select"
  | "textarea"
  | "checkbox"
  | "tel"
  | "url"
  | "hidden"
  | "number"; // Include number to support numeric inputs

interface Props extends Omit<IFormField, 'defaultValue'> {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
}

const FormFields = ({
  type,
  label,
  placeholder,
  error,
  value = '',
  onChange = () => {},
  disabled = false,
  className = '',
  ariaLabel,
  pattern,
  required = false,
  autoFocus = false,
  name,
  options = [],
}: Props) => {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    required,
    className: clsx(
      'w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700',
      'text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-blue-400',
      'transition-all duration-200 hover:shadow-md hover:shadow-blue-400/20',
      error ? 'border-red-500' : 'border-slate-700',
      className
    ),
    disabled,
    'aria-label': ariaLabel || label,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${name}-error` : undefined,
    autoFocus,
    ...(pattern ? { pattern } : {}),
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea {...inputProps} />
      ) : type === "select" && options ? (
        <select
          {...inputProps}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "radio" && options ? (
        <div className="radio-group">
          {options.map((option) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="form-radio"
                aria-label={option.label}
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <input type={type} {...inputProps} />
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormFields;