import { IFormField } from "@/app/types/app";
import { Pages, Routes } from "@/constants/enums";

// Props for the useFormFields hook
interface UseFormFieldsProps {
  slug: string;
}

// Common field properties to reduce duplication
const commonFieldProps = {
  autoFocus: false,
  pattern: undefined,
  ariaLabel: undefined,
} as const;

// Specific field configurations
const fieldConfigs: Record<string, Partial<IFormField>> = {
  email: {
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    ariaLabel: "Email address",
  },
  password: {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    ariaLabel: "Password",
  },
  name: {
    label: "Full Name",
    name: "name",
    type: "text",
    placeholder: "Enter your full name",
    ariaLabel: "Full name",
  },
  confirmPassword: {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    ariaLabel: "Confirm password",
  },
  phone: {
    label: "Phone Number",
    name: "phone",
    type: "tel",
    placeholder: "Enter your phone number",
    pattern: "^\\+?[1-9]\\d{1,14}$",
    ariaLabel: "Phone number",
  },

  productName: {
    label: "Product Name",
    name: "name",
    type: "text",
    placeholder: "Enter product name",
    ariaLabel: "Product name",
  },
  description:     {
      label: "Description",
      name: "description",
      type: "text",
      placeholder: "Enter product description",
      ariaLabel: undefined,
      pattern: undefined,
    },
  liveDemoLink: {
    label: "Live Demo Link (optional)",
    name: "liveDemoLink",
    type: "url",
    placeholder: "https://example.com",
    pattern: "^https?://.*",
    ariaLabel: "Live demo link",
  },
  gitHubLink: {
    label: "GitHub Link (optional)",
    name: "gitHubLink",
    type: "url",
    placeholder: "https://github.com/user/repo",
    pattern: "^https?://(www\\.)?github\\.com/[\\w-]+/[\\w-]+",
    ariaLabel: "GitHub repository link",
  },
};

/**
 * Hook to provide form fields based on the provided slug.
 * @param props - Object containing the slug to determine the form context.
 * @returns Object with a function to get form fields.
 */
const useFormFields = ({ slug }: UseFormFieldsProps) => {
  /**
   * Fields for the login form.
   * @returns Array of form field configurations.
   */
  const loginFields = (): IFormField[] => [
    { ...fieldConfigs.email, autoFocus: true } as IFormField,
    { ...fieldConfigs.password } as IFormField,
  ];

  /**
   * Fields for the signup form.
   * @returns Array of form field configurations.
   */
  const signupFields = (): IFormField[] => [
    { ...fieldConfigs.name, autoFocus: true } as IFormField,
    { ...fieldConfigs.email } as IFormField,
    { ...fieldConfigs.password } as IFormField,
    { ...fieldConfigs.confirmPassword } as IFormField,
  ];

  /**
   * Fields for the profile form.
   * @returns Array of form field configurations.
   */
  const profileFields = (): IFormField[] => [
    { ...fieldConfigs.name, autoFocus: true } as IFormField,
    { ...fieldConfigs.email } as IFormField,
    { ...fieldConfigs.phone } as IFormField,
    { ...fieldConfigs.streetAddress } as IFormField,
    { ...fieldConfigs.postalCode } as IFormField,
    { ...fieldConfigs.city } as IFormField,
    { ...fieldConfigs.country } as IFormField,
  ];

  /**
   * Fields for the add/edit product form.
   * @returns Array of form field configurations.
   */
  const addProductFields = (): IFormField[] => [
    { ...fieldConfigs.productName, autoFocus: true } as IFormField,
    { ...fieldConfigs.description } as IFormField,
    { ...fieldConfigs.liveDemoLink } as IFormField,
    { ...fieldConfigs.gitHubLink } as IFormField,
  ];

  /**
   * Retrieves form fields based on the slug.
   * @returns Array of form field configurations.
   */
  const getFormFields = (): IFormField[] => {
    switch (slug) {
      case Pages.LOGIN:
        return loginFields();
      case Pages.Register:
        return signupFields();
      case Routes.PROFILE:
        return profileFields();
      case `${Routes.ADMIN}/${Pages.MENU_ITEMS}`:
        return addProductFields();
      default:
        console.warn(`[useFormFields] Unknown slug: ${slug}`);
        return [];
    }
  };

  return {
    getFormFields,
  };
};

export default useFormFields;