import { z } from "zod";

// Schema for validating user profile updates
export const getUpdateProfileSchema = () => {
  return z.object({
    // Name: Required, non-empty string
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" }),

    // Email: Required, valid email format
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email format" }),

    // Phone: Optional, valid international phone number
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^\+?[1-9]\d{1,14}$/.test(value),
        { message: "Invalid phone number" }
      ),

    // Street Address: Optional string
    streetAddress: z.string().trim().optional(),

    // Postal Code: Optional, 5-10 digits
    postalCode: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^\d{5,10}$/.test(value),
        { message: "Invalid postal code" }
      ),

    // City: Optional string
    city: z.string().trim().optional(),

    // Country: Optional string
    country: z.string().trim().optional(),

    // Image: Optional file (max 2MB, image type) or string
image: z
  .any()
  .optional()
  .refine(
    (file): file is Blob | string | undefined => {
      if (!file || typeof file === "string") return true;
      return (
        typeof Blob !== "undefined" &&
        file instanceof Blob &&
        file.size <= 2 * 1024 * 1024 &&
        file.type?.startsWith("image/")
      );
    },
    {
      message: "Image must be under 2MB and of valid format",
    }
  ),

  });
};