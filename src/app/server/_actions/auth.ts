/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";
import bcrypt from "bcrypt"; // تستخدم لي تعقيد كلمات المرور
import { Routes, Pages } from "@/constants/enums";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { loginSchema, signupSchema } from "@/app/validations/auth";

// تعريف نوع الاستجابة العام لتحسين التناسق
interface AuthResponse {
  status: number;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  error?: Record<string, string[]> | string;
  formData?: FormData;
  className?: string;
}

/**
 * Handles user login with credentials validation and authentication.
 * Returns user data without password on success, compatible with server-side auth.
 * @param credentials - Email and password input
 * @param locale - Current locale
 * @returns AuthResponse - Login result with status and optional user data
 */
export const login = async (
  credentials: Record<"email" | "password", string>,
  locale: Locale
): Promise<AuthResponse> => {
  // التحقق من وجود البيانات الأساسية
  if (!credentials?.email || !credentials?.password) {
    return {
      status: 400,
      message: "Email and password are required",
      className: "text-red-500",
    };
  }

  // التحقق من صحة البيانات باستخدام Zod
  const result = loginSchema().safeParse(credentials);
  if (!result.success) {
    return {
      status: 400,
      error: result.error.formErrors.fieldErrors,
      className: "text-red-500",
    };
  }

  try {
    // جلب المستخدم باستخدام استعلام محسن
    const user = await db.user.findUnique({
      where: { email: result.data.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        status: 401,
        message: "User not found",
        className: "text-red-500",
      };
    }

    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(
      result.data.password,
      user.password
    );
    if (!isValidPassword) {
      return {
        status: 401,
        message: "Incorrect password",
        className: "text-red-500",
      };
    }

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = user;
    return {
      status: 200,
      message: "Login successful",
      user: userWithoutPassword,
      className: "text-green-500",
    };
  } catch (error) {
    console.error("❌ Login Error:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return {
      status: 500,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
      className: "text-red-500",
    };
  }
};

/**
 * Handles user signup with validation and database insertion.
 * Compatible with useActionState, revalidates admin paths on success.
 * Uses uuid library to generate IDs manually to avoid crypto.randomUUID dependency.
 * @param prevState - Previous state from useActionState (unused here)
 * @param formData - Form data from the signup form
 * @returns AuthResponse - Signup result with status and optional user data
 */
export const signup = async (
  prevState: unknown,
  formData: FormData
): Promise<AuthResponse> => {

  // تحويل FormData إلى كائن
  const credentials = Object.fromEntries(formData.entries());
  const result = signupSchema().safeParse(credentials);

  if (!result.success) {
    return {
      status: 400,
      error: result.error.formErrors.fieldErrors,
      formData,
      className: "text-red-500",
    };
  }

  try {
    // التحقق من وجود المستخدم مسبقًا باستعلام خفيف
    const existingUser = await db.user.findUnique({
      where: { email: result.data.email },
      select: { id: true },
    });
    if (existingUser) {
      return {
        status: 409,
        message: "User already exists",
        formData,
        className: "text-red-500",
      };
    }

    // تشفير كلمة المرور وإنشاء المستخدم مع id يدوي
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const createdUser = await db.user.create({
      data: {
        id: uuidv4(), // توليد UUID يدويًا باستخدام مكتبة uuid
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
        role: "USER", // تعيين صريح للدور الافتراضي
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // إعادة تحديث المسارات المتأثرة
    const adminBasePath = `/${Routes.ADMIN}`;
    revalidatePath(`${adminBasePath}/${Pages.USERS}/${createdUser.id}/${Pages.EDIT}`);
    revalidatePath(`${adminBasePath}/${Pages.USERS}`);
    // revalidatePath(`/${locale}`);

    return {
      status: 201,
      message: "Registration successful",
      user: createdUser,
      className: "text-green-500",
    };
  } catch (error) {
    console.error("❌ Signup Error:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return {
      status: 500,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
      className: "text-red-500",
    };
  }
};