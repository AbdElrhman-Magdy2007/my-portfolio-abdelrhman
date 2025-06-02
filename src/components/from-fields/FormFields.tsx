import React from "react";
import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

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

interface Props {
  type: InputTypes;
  name: string;
  label: string;
  error?: string;
  value: string;
  defaultValue?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select or radio
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  ariaLabel?: string;
}

const FormFields: React.FC<Props> = ({
  type,
  name,
  label,
  error,
  value,
  defaultValue,
  onChange,
  placeholder,
  required,
  options,
  className,
  disabled,
  min,
  max,
  step,
  pattern,
  ariaLabel,
}) => {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    required,
    className: cn(
      "form-input",
      error ? "border-red-500" : "",
      className
    ),
    disabled,
    min,
    max,
    step,
    pattern,
    "aria-label": ariaLabel || label,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${name}-error` : undefined,
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label text-indigo-300 font-medium text-sm">
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
        <p
          id={`${name}-error`}
          className="text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
          aria-live="polite"
        >
          <span className="text-red-400">⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormFields;