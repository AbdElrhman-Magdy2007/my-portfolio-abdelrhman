"use server";

import { getUpdateProfileSchema } from "@/app/validations/profile";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Pages, Routes } from "@/constants/enums";
import { UserRole } from "@prisma/client";

interface FormResponse {
  message?: string;
  error?: Record<string, string[]>;
  status?: number | null;
  formData?: FormData;
}

export const updateProfile = async (
  isAdmin: boolean,
  _prevState: unknown,
  formData: FormData
): Promise<FormResponse> => {
  // Validate form data
  const result = getUpdateProfileSchema().safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
    };
  }

  const data = result.data;
  const rawImage = data.image;

  let imageUrl: string | undefined;

  if (typeof rawImage === "string") {
    // صورة موجودة مسبقًا
    imageUrl = rawImage;
  } else if (rawImage instanceof Blob && rawImage.size > 0) {
    imageUrl = await uploadImageToCloudinary(rawImage);
  }

  try {
    const user = await db.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, image: true },
    });

    if (!user) {
      return {
        message: "User not found",
        status: 401,
        formData,
      };
    }

    await db.user.update({
      where: { email: user.email },
      data: {
        name: data.name,
        phone: data.phone ?? null,
        streetAddress: data.streetAddress ?? null,
        postalCode: data.postalCode ?? null,
        city: data.city ?? null,
        country: data.country ?? null,
        image: imageUrl ?? user.image,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });

    // Revalidate all relevant paths
    const pathsToRevalidate = [
      `/${Routes.PROFILE}`,
      `/${Routes.ADMIN}`,
      `/${Routes.ADMIN}/${Pages.USERS}`,
      `/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`,
    ];

    pathsToRevalidate.forEach((path) => revalidatePath(path));

    return {
      status: 200,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      status: 500,
      message: "An unexpected error occurred",
    };
  }
};

// Helper: Upload image to Cloudinary via API route
const uploadImageToCloudinary = async (
  file: Blob
): Promise<string | undefined> => {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size exceeds 5MB limit");
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("pathName", "profile_images");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
      method: "POST",
      body: uploadForm,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }

    const data = (await res.json()) as { url: string };
    return data.url;
  } catch (err) {
    console.warn("Upload error:", err);
    return undefined;
  }
};
