"use client";

import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCategory } from "../_actions/category";
import clsx from "clsx";

// Define action response type
interface ActionResponse {
  status: number;
  message?: string;
  error?: Record<string, string>;
}

/**
 * Component for deleting a category with confirmation
 * @param id - The ID of the category to delete
 */
function DeleteCategory({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  // Toast styling configurations
  const toastStyles = {
    success: {
      style: {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        border: "1px solid #bbf7d0",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
      duration: 3000,
    },
    error: {
      style: {
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
      duration: 3000,
    },
    loading: {
      id: "category-delete-loading",
      style: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "12px",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
      duration: Infinity,
    },
  };

  // Handle category deletion
  const handleDelete = useCallback(() => {
    toast.loading("Deleting...", toastStyles.loading);

    startTransition(async () => {
      try {
        const res: ActionResponse = await deleteCategory(id);
        toast.dismiss(toastStyles.loading.id);
        toast(res.message || "Category deleted successfully", {
          ...(res.status === 200 ? toastStyles.success : toastStyles.error),
        });
        if (res.status === 200) {
          setOpen(false);
        }
      } catch (error) {
        toast.dismiss(toastStyles.loading.id);
        toast("An unexpected error occurred", toastStyles.error);
        console.error("Error deleting category:", error);
      }
    });
  }, [id, toastStyles]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          className={clsx(
            "border-red-600 text-red-600 dark:border-red-700 dark:text-red-500",
            "bg-black dark:bg-gray-900",
            "hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-white",
            "active:bg-red-700 dark:active:bg-red-800",
            isPending && "opacity-60 cursor-not-allowed",
            "transition-all duration-300 ease-in-out",
            "shadow-sm hover:shadow-md",
            "[&>svg]:h-4 [&>svg]:w-4"
          )}
          aria-label="Delete category"
        >
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin text-red-600 dark:text-red-500" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black dark:bg-gray-900 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-indigo-100 dark:text-indigo-200">
            Are you sure?
          </DialogTitle>
          <p className="text-indigo-300 dark:text-indigo-400">
            This action cannot be undone. The category will be permanently deleted.
          </p>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className={clsx(
              "border-indigo-600 text-indigo-900 dark:border-gray-600 dark:text-gray-200",
              "hover:bg-indigo-900 dark:hover:bg-gray-700 hover:text-indigo-100",
            )}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className={clsx(
              "bg-red-600 text-white dark:bg-red-700 dark:text-white",
              "hover:bg-red-700 dark:hover:bg-red-800",
              isPending && "opacity-60 cursor-not-allowed",
              isPending && "flex items-center gap-2"
            )}
            disabled={isPending}
            aria-label="Delete"
          >
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteCategory;