import { z } from "zod";

// Centralized validation message keys
const validationMessages = {
  requiredEmail: "Email is required",
  validEmail: "Invalid email format",
  requiredPassword: "Password is required",
  passwordMinLength: "Password must be at least 6 characters",
  passwordMaxLength: "Password must be less than 40 characters",
  requiredName: "Name is required",
  nameMaxLength: "Name must be less than 50 characters",
  requiredConfirmPassword: "Password confirmation is required",
  passwordsDoNotMatch: "Passwords do not match",
  validLimit: "Limit must be a positive integer",
  limitMax: "Limit must be 100 or less",
};

/**
 * Validates that the password and confirmPassword fields match.
 * @param data - Object containing password and confirmPassword fields.
 * @returns True if passwords match, otherwise a Zod issue.
 */
const passwordMatchValidation = (
  data: { password: string; confirmPassword: string }
) => ({
  isValid: data.password === data.confirmPassword,
  issue: {
    message: validationMessages.passwordsDoNotMatch,
    path: ["confirmPassword"],
  },
});

/**
 * Type definition for validated login form data.
 */
export type LoginData = {
  email: string;
  password: string;
};

/**
 * Type definition for validated signup form data.
 */
export type SignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  limit: number;
};

/**
 * Type definition for validation errors returned by Zod.
 */
export type ValidationError = Record<string, string>;

/**
 * Validation schema for login form fields.
 * Ensures email is a valid, lowercase email address and password meets length requirements.
 * @returns Zod schema for login form validation.
 */
export const loginSchema = () =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, {
        message: validationMessages.requiredEmail,
      })
      .email({
        message: validationMessages.validEmail,
      })
      .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(1, {
        message: validationMessages.requiredPassword,
      })
      .min(6, {
        message: validationMessages.passwordMinLength,
      })
      .max(40, {
        message: validationMessages.passwordMaxLength,
      }),
  });

/**
 * Validation schema for signup form fields.
 * Includes name, email, password, confirmPassword, and a required limit field.
 * Ensures limit is a positive integer (defaulting to 1) and passwords match.
 * @returns Zod schema for signup form validation.
 */
export const signupSchema = () =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, {
          message: validationMessages.requiredName,
        })
        .max(50, {
          message: validationMessages.nameMaxLength,
        }),

      email: z
        .string()
        .trim()
        .min(1, {
          message: validationMessages.requiredEmail,
        })
        .email({
          message: validationMessages.validEmail,
        })
        .transform((val) => val.toLowerCase()),

      password: z
        .string()
        .min(1, {
          message: validationMessages.requiredPassword,
        })
        .min(6, {
          message: validationMessages.passwordMinLength,
        })
        .max(40, {
          message: validationMessages.passwordMaxLength,
        }),

      confirmPassword: z
        .string()
        .min(1, {
          message: validationMessages.requiredConfirmPassword,
        }),

      limit: z
        .number()
        .int()
        .min(1, {
          message: validationMessages.validLimit,
        })
        .max(100, {
          message: validationMessages.limitMax,
        })
        .default(1),
    })
    .refine(
      (data) => passwordMatchValidation(data).isValid,
      (data) => passwordMatchValidation(data).issue
    );

export default {
  loginSchema,
  signupSchema,
};