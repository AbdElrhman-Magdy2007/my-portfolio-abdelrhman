// "use server";

// import { addCategorySchema, updateCategorySchema } from "@/app/validations/category";
// import { Pages, Routes } from "@/constants/enums";
// import { db } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";

// // واجهة للحالة المعادة من الدوال
// interface ActionResult {
//   status: number;
//   message: string;
//   error?: Record<string, string[] | string>;
// }

// // مسارات إعادة التحقق المشتركة
// const PATHS_TO_REVALIDATE = [
//   `/${Routes.ADMIN}/${Pages.CATEGORIES}`,
//   `/${Routes.MENU}`,
// ];

// /**
//  * إعادة التحقق من المسارات المحددة
//  * @param paths - قائمة المسارات لإعادة التحقق
//  */
// const revalidatePaths = (paths: string[]) => {
//   paths.forEach((path) => revalidatePath(path));
// };

// /**
//  * معالجة الأخطاء وإرجاع استجابة موحدة
//  * @param error - الخطأ الذي تم التقاطه
//  * @returns كائن ActionResult مع حالة الخطأ
//  */
// const handleError = (error: unknown): ActionResult => {
//   console.error("Error:", error);
//   return {
//     status: 500,
//     message: "An unexpected error occurred.",
//   };
// };

// /**
//  * إضافة فئة جديدة إلى قاعدة البيانات
//  * @param prevState - الحالة السابقة (غير مستخدمة)
//  * @param formData - بيانات النموذج
//  * @returns نتيجة العملية
//  */
// export const addCategory = async (
//   prevState: unknown,
//   formData: FormData
// ): Promise<ActionResult> => {
//   const result = addCategorySchema.safeParse(
//     Object.fromEntries(formData.entries())
//   );

//   if (!result.success) {
//     return {
//       error: result.error.formErrors.fieldErrors,
//       status: 400,
//       message: "Invalid input data.",
//     };
//   }

//   try {
//     const { categoryName } = result.data;
//     await db.category.create({ data: { name: categoryName } });
//     revalidatePaths(PATHS_TO_REVALIDATE);

//     return {
//       status: 201,
//       message: "Category added successfully.",
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// /**
//  * تحديث فئة موجودة في قاعدة البيانات
//  * @param id - معرف الفئة
//  * @param prevState - الحالة السابقة (غير مستخدمة)
//  * @param formData - بيانات النموذج
//  * @returns نتيجة العملية
//  */
// export const updateCategory = async (
//   id: string,
//   prevState: unknown,
//   formData: FormData
// ): Promise<ActionResult> => {
//   // التحقق من صحة المعرف
//   if (!id || typeof id !== "string") {
//     return {
//       status: 400,
//       message: "Invalid category ID.",
//     };
//   }

//   const result = updateCategorySchema.safeParse(
//     Object.fromEntries(formData.entries())
//   );

//   if (!result.success) {
//     return {
//       error: result.error.formErrors.fieldErrors,
//       status: 400,
//       message: "Invalid input data.",
//     };
//   }

//   try {
//     const { categoryName } = result.data;
//     await db.category.update({
//       where: { id },
//       data: { name: categoryName },
//     });
//     revalidatePaths(PATHS_TO_REVALIDATE);

//     return {
//       status: 200,
//       message: "Category updated successfully.",
//     };
//   } catch (error) {
//     // التحقق من أخطاء قاعدة البيانات (مثل الفئة غير موجودة)
//     if (error instanceof Error && error.message.includes("RecordNotFound")) {
//       return {
//         status: 404,
//         message: "Category not found.",
//       };
//     }
//     return handleError(error);
//   }
// };

// /**
//  * حذف فئة من قاعدة البيانات
//  * @param id - معرف الفئة
//  * @returns نتيجة العملية
//  */
// export const deleteCategory = async (id: string): Promise<ActionResult> => {
//   // التحقق من صحة المعرف
//   if (!id || typeof id !== "string") {
//     return {
//       status: 400,
//       message: "Invalid category ID.",
//     };
//   }

//   try {
//     await db.category.delete({ where: { id } });
//     revalidatePaths(PATHS_TO_REVALIDATE);

//     return {
//       status: 200,
//       message: "Category deleted successfully.",
//     };
//   } catch (error) {
//     // التحقق من أخطاء قاعدة البيانات
//     if (error instanceof Error && error.message.includes("RecordNotFound")) {
//       return {
//         status: 404,
//         message: "Category not found.",
//       };
//     }
//     return handleError(error);
    
//   }
// };

"use server";

import { addCategorySchema, updateCategorySchema } from "@/app/validations/category";
import { Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Centralized Action Response type
export interface ActionResponse {
  status: number;
  message: string;
  error?: Record<string, string>;
}

// Constants for revalidation paths
const PATHS_TO_REVALIDATE = [
  `/${Routes.ADMIN}/${Pages.CATEGORIES}`,
  `/${Routes.MENU}`,
] as const;

// Utility to revalidate multiple paths
const revalidatePaths = (paths: readonly string[]): void => {
  try {
    paths.forEach((path) => revalidatePath(path, "page"));
  } catch (error) {
    console.error(`Failed to revalidate paths: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Utility to handle errors with console logging
const handleError = (error: unknown, context: string): ActionResponse => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  console.error(`[${context}] Error: ${errorMessage}`, error);

  if (error instanceof Error && error.message.includes("RecordNotFound")) {
    return {
      status: 404,
      message: "Category not found.",
      error: { general: "The specified category does not exist." },
    };
  }

  return {
    status: 500,
    message: "An unexpected error occurred.",
    error: { general: errorMessage },
  };
};

// Validation error response utility
const handleValidationError = (error: z.ZodError): ActionResponse => {
  const fieldErrors = error.formErrors.fieldErrors;
  const formattedErrors: Record<string, string> = {};

  for (const [key, errors] of Object.entries(fieldErrors)) {
    formattedErrors[key] = Array.isArray(errors) ? errors.join(", ") : errors || "Invalid input";
  }

  return {
    status: 400,
    message: "Invalid input data.",
    error: formattedErrors,
  };
};

/**
 * Adds a new category to the database.
 * @param _prevState - Previous state (unused, for form compatibility).
 * @param formData - Form data containing category details.
 * @returns ActionResponse indicating the result of the operation.
 */
export async function addCategory(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const result = addCategorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return handleValidationError(result.error);
  }

  try {
    const { categoryName } = result.data;

    // Sanitize input (e.g., trim whitespace)
    const sanitizedName = categoryName.trim();
    if (!sanitizedName) {
      return {
        status: 400,
        message: "Category name cannot be empty.",
        error: { categoryName: "Category name is required." },
      };
    }

    // Check for duplicate category
    const existingCategory = await db.category.findFirst({
      where: { name: { equals: sanitizedName, mode: "insensitive" } },
    });

    if (existingCategory) {
      return {
        status: 409,
        message: "Category already exists.",
        error: { categoryName: `Category "${sanitizedName}" already exists.` },
      };
    }

    await db.category.create({ data: { name: sanitizedName } });
    revalidatePaths(PATHS_TO_REVALIDATE);

    return {
      status: 201,
      message: "Category added successfully.",
    };
  } catch (error) {
    return handleError(error, "addCategory");
  }
}

/**
 * Updates an existing category in the database.
 * @param id - The ID of the category to update.
 * @param _prevState - Previous state (unused, for form compatibility).
 * @param formData - Form data containing updated category details.
 * @returns ActionResponse indicating the result of the operation.
 */
export async function updateCategory(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  if (!id || typeof id !== "string") {
    return {
      status: 400,
      message: "Invalid category ID.",
      error: { id: "Category ID is required and must be a string." },
    };
  }

  const result = updateCategorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return handleValidationError(result.error);
  }

  try {
    const { categoryName } = result.data;
    const sanitizedName = categoryName.trim();

    if (!sanitizedName) {
      return {
        status: 400,
        message: "Category name cannot be empty.",
        error: { categoryName: "Category name is required." },
      };
    }

    // Check for duplicate category (excluding current category)
    const existingCategory = await db.category.findFirst({
      where: {
        name: { equals: sanitizedName, mode: "insensitive" },
        NOT: { id },
      },
    });

    if (existingCategory) {
      return {
        status: 409,
        message: "Category already exists.",
        error: { categoryName: `Category "${sanitizedName}" already exists.` },
      };
    }

    await db.category.update({
      where: { id },
      data: { name: sanitizedName },
    });
    revalidatePaths(PATHS_TO_REVALIDATE);

    return {
      status: 200,
      message: "Category updated successfully.",
    };
  } catch (error) {
    return handleError(error, "updateCategory");
  }
}

/**
 * Deletes a category from the database.
 * @param id - The ID of the category to delete.
 * @returns ActionResponse indicating the result of the operation.
 */
export async function deleteCategory(id: string): Promise<ActionResponse> {
  if (!id || typeof id !== "string") {
    return {
      status: 400,
      message: "Invalid category ID.",
      error: { id: "Category ID is required and must be a string." },
    };
  }

  try {
    // Verify category exists
    const category = await db.category.findUnique({ where: { id } });
    if (!category) {
      return {
        status: 404,
        message: "Category not found.",
        error: { id: "The specified category does not exist." },
      };
    }

    await db.category.delete({ where: { id } });
    revalidatePaths(PATHS_TO_REVALIDATE);

    return {
      status: 200,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    return handleError(error, "deleteCategory");
  }
}
