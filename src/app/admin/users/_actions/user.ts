"use server";

import { Pages, Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  // Validate user ID
  if (!id || typeof id !== "string") {
    return {
      status: 400,
      message: "Invalid user ID provided.",
    };
  }

  try {
    // Delete user from database
    await db.user.delete({
      where: { id },
    });

    // Revalidate cache for relevant paths
    revalidatePath(`/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(`/${Routes.ADMIN}/${Pages.USERS}/${id}/${Pages.EDIT}`);

    return {
      status: 200,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting user:", error);

    // Check for specific error types
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return {
        status: 404,
        message: "User not found.",
      };
    }

    return {
      status: 500,
      message: "An unexpected error occurred.",
    };
  }
};