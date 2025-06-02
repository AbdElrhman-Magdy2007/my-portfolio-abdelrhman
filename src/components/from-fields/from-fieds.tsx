import { memo } from "react";
import { useParams } from "next/navigation";
import { InputTypes, Languages } from "@/constants/enums";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Checkbox from "./checkbox";
import { IFormField } from "@/app/types/app";
import { ValidationError } from "@/app/validations/auth";

interface Props extends Omit<IFormField, "type"> {
  name: string;
  type: InputTypes;
  error?: ValidationError | string;
  label?: string;
  isArabic?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const FormFields = memo((props: Props) => {
  const {
    type,
    error,
    name,
    label,
    isArabic,
    value,
    onChange,
    onValidationChange,
    ...rest
  } = props;

  const params = useParams();
  const locale = isArabic ?? (params?.locale === Languages.ARABIC);

  const fieldError =
    typeof error === "object" && name ? error[name]?.[0] || "" : typeof error === "string" ? error : undefined;

  const handleValidation = (inputValue: string) => {
    if (onValidationChange) {
      const isValid = inputValue.trim().length >= 2;
      onValidationChange(isValid);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    handleValidation(e.target.value);
  };

  const renderField = (): React.ReactNode => {
    switch (type) {
      case InputTypes.TEXT:
      case InputTypes.EMAIL:
      case InputTypes.URL:
        return (
          <TextField
            name={name}
            label={label}
            type={(type.toLowerCase() as "text" | "email" | "url") || 'text'}
            value={value}
            onChange={handleChange}
            error={fieldError}
            isArabic={locale}
            {...rest}
            pattern={rest.pattern || ''}
          />
        );

      case InputTypes.PASSWORD:
        return (
          <PasswordField
            name={name}
            label={label}
            type="password"
            value={value}
            onChange={handleChange}
            error={fieldError}
            isArabic={locale}
            onValidationChange={onValidationChange}
            {...{...rest, defaultValue: rest.defaultValue?.toString()}}
          />
        );

      case InputTypes.CHECKBOX:
        const checked = value === "true" || rest.defaultValue === "true";
        return (
          <Checkbox
            name={name}
            label={label}
            checked={checked}
            error={fieldError}
            onCheckedChange={(checkedValue) => {
              const fakeEvent = {
                target: { name, value: checkedValue.toString() },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange?.(fakeEvent);
              handleValidation(checkedValue.toString());
            }}
            {...rest}
          />
        );

      default:
        console.warn(`[FormFields] Unsupported input type: ${type}`);
        return null;
    }
  };

  return <>{renderField()}</>;
});

FormFields.displayName = "FormFields";

export default FormFields;
