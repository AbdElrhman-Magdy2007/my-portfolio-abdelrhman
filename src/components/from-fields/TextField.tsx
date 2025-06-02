/* eslint-disable react/display-name */
import { forwardRef, memo } from "react";
import clsx from "clsx";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { IFormField } from "@/app/types/app";

interface Props extends IFormField {
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  isArabic: boolean;
  value?: string | number;
  pattern: string;
}

const TextField = memo(
  forwardRef<HTMLInputElement, Props>(
    (
      {
        name,
        label,
        type = "text",
        placeholder,
        disabled,
        autoFocus,
        defaultValue,
        value,
        pattern,
        onChange,
        readOnly,
        error,
        isArabic,
      },
      ref
    ) => {
      const displayLabel = label || name;

      return (
        <div dir={isArabic ? "rtl" : "ltr"} className="form-field space-y-2 text-indigo-700">
          {/* Label */}
          <Label
            htmlFor={name}
            className={clsx(
              "block text-sm font-medium text-indigo-700 dark:text-black",
              "text-start" // يعتمد على dir تلقائيًا
            )}
          >
            {displayLabel}
          </Label>

          {/* Input Field */}
          <Input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            value={value}
            pattern={pattern}
            onChange={onChange}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={clsx(
              "block w-full border rounded-lg transition-all focus:ring-2 focus:ring-offset-2",
              "py-2 ps-4 pe-4", // بدل px-4 لدعم الاتجاه
              {
                "border-red-500 focus:ring-red-500": error,
                "border-indigo-500 focus:ring-indigo-500 dark:border-indigo-500 dark:focus:ring-indigo-400":
                  !error,
                "bg-gray-100 cursor-not-allowed dark:bg-indigo-500": disabled || readOnly,
              }
            )}
          />

          {/* Error Message */}
          {error && (
            <p id={`${name}-error`} className="text-sm font-medium text-red-500 text-start">
              {error}
            </p>
          )}
        </div>
      );
    }
  )
);

export default TextField;
