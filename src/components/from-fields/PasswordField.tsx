import { useState } from "react";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Languages } from "@/constants/enums";
import { Label } from "../ui/label";
import clsx from "clsx";
import { IFormField } from "@/app/types/app";
import { ValidationError } from "@/app/validations/auth";

interface Props extends IFormField {
  error?: ValidationError | string;
  defaultValue?: string | number;
  onValidationChange?: (isValid: boolean) => void; // دالة لإبلاغ الوالد بحالة التحقق
  isArabic?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  pattern: string;
  autoFocus?: boolean;
}

const PasswordField = ({
  label,
  name,
  placeholder,
  disabled,
  autoFocus,
  error,
  defaultValue,
  onValidationChange,
  isArabic,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(defaultValue || "");
  const [localError, setLocalError] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as Languages) || Languages.ENGLISH;

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // دالة التحقق من طول كلمة المرور
  const validatePassword = (value: string) => {
    if (value.length < 6 && value.length > 0) {
      setLocalError("Password must be at least 6 characters");
      onValidationChange?.(false);
      return false;
    } else if (value.length > 40) {
      setLocalError("Password must be less than 40 characters");
      onValidationChange?.(false);
      return false;
    } else {
      setLocalError(null);
      onValidationChange?.(true);
      return true;
    }
  };

  // معالجة تغيير قيمة الحقل
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // استخراج الخطأ من الخاصية error أو استخدام الخطأ المحلي
  const fieldError =
    error && typeof error === "object" && name
      ? error[name]?.[0] || ""
      : typeof error === "string"
      ? error
      : localError;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className="capitalize text-indigo-700">
          {label}
        </Label>
      )}

      <div className="relative flex items-center text-indigo-700">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
          name={name}
          id={name}
          value={password}
          onChange={handleChange}
          aria-invalid={!!fieldError}
          aria-describedby={fieldError ? `${name}-error` : undefined}
          className={clsx({
            "border-red-500 focus:ring-red-500": !!fieldError,
          })}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={clsx("absolute", {
            "left-3": locale === Languages.ARABIC,
            "right-3": locale !== Languages.ARABIC,
          })}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {fieldError && (
        <p
          id={`${name}-error`}
          className="text-sm font-medium text-red-600 mt-2"
        >
          {fieldError}
        </p>
      )}
    </div>
  );
};

export default PasswordField;