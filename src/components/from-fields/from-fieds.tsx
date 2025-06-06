import { memo } from "react";
import { useParams } from "next/navigation";
import { InputTypes, Languages } from "@/constants/enums";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Checkbox from "./checkbox";
import { IFormField } from "@/app/types/app";
import { ValidationError } from "@/app/validations/auth";

// واجهة الخصائص مع دعم التحقق وتخصيص اللغة
interface Props extends Omit<IFormField, "type"> {
  name: string;
  type: InputTypes;
  error?: ValidationError | string;
  label?: string;
  isArabic?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidationChange?: (isValid: boolean) => void;
  pattern: string;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel: string;
  autoFocus?: boolean;
}

// مكون FormFields لعرض حقول النموذج بناءً على النوع مع تحسين الأداء
const FormFields = memo(
  ({
    type,
    error,
    name,
    label,
    isArabic,
    value,
    onChange,
    onValidationChange,
    pattern,
    placeholder,
    disabled,
    ariaLabel,
    autoFocus,
    ...restProps
  }: Props) => {
    // تحديد اللغة بناءً على المعامل أو المسار
    const params = useParams();
    const locale = isArabic ?? (params?.locale === Languages.ARABIC);

    // استخراج الخطأ الخاص بالحقل بشكل موحد
    const fieldError =
      error && typeof error === "object" && name
        ? error[name]?.[0] || ""
        : typeof error === "string"
        ? error
        : undefined;

    // التحقق من صحة الإدخال
    const handleValidation = (inputValue: string) => {
      if (onValidationChange) {
        const isValid = inputValue.length >= 2;
        onValidationChange(isValid);
      }
    };

    // عرض الحقل المناسب بناءً على النوع
    const renderField = (): React.ReactNode => {
      console.log(`[FormFields] Rendering ${name}: type=${type}, value=${value || restProps.defaultValue || ""}`);
      switch (type) {
        case InputTypes.EMAIL:
        case InputTypes.TEXT:
        case InputTypes.URL:
          return (
            <TextField
              isArabic={locale}
              name={name}
              label={label}
              type={type === InputTypes.EMAIL ? "email" : type === InputTypes.URL ? "url" : "text"}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(`[TextField] ${name} changed to: ${e.target.value}`);
                onChange?.(e);
                handleValidation(e.target.value);
              }}
              error={fieldError}
              pattern={pattern}
              placeholder={placeholder}
              disabled={disabled}
              ariaLabel={ariaLabel}
              autoFocus={autoFocus}
              {...restProps}
            />
          );

        case InputTypes.PASSWORD:
          return (
            <PasswordField
              isArabic={locale}
              name={name}
              label={label}
              type={InputTypes.PASSWORD}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(`[PasswordField] ${name} changed to: ${e.target.value}`);
                onChange?.(e);
                handleValidation(e.target.value);
              }}
              error={fieldError}
              placeholder={placeholder}
              disabled={disabled}
              ariaLabel={ariaLabel}
              pattern={pattern}
              autoFocus={autoFocus}
              {...restProps}
            />
          );

        case InputTypes.CHECKBOX:
          return (
            <Checkbox
              name={name}
              label={label}
              checked={value === "true" || restProps.defaultValue === "true" || false}
              error={fieldError}
              onCheckedChange={(checked) => {
                console.log(`[Checkbox] ${name} changed to: ${checked}`);
                onChange?.({ target: { name, value: checked.toString() } } as React.ChangeEvent<HTMLInputElement>);
                handleValidation(checked.toString());
              }}
              disabled={disabled}
              aria-label={ariaLabel}
              autoFocus={autoFocus}
              {...restProps}
            />
          );

        default:
          console.warn(`Unsupported input type: ${type}`);
          return null;
      }
    };

    return <>{renderField()}</>;
  }
);

// تحديد اسم العرض لتسهيل التصحيح
FormFields.displayName = "FormFields";

export default FormFields;