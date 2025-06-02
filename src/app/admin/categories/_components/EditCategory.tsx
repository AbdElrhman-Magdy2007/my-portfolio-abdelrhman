"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { updateCategory } from "../_actions/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditIcon, Loader } from "lucide-react";
import clsx from "clsx";

// Form state type
interface FormState {
  message?: string;
  error?: Record<string, string>;
  status?: number | null;
}

// Initial form state
const initialState: FormState = {
  message: "",
  error: {},
  status: null,
};

// EditCategory component
function EditCategory({ category }: { category: Category }) {
  const [state, setState] = useState<FormState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle toast notifications and dialog state
  useEffect(() => {
    if (!state.message || !state.status) return;

    toast.dismiss("category-update-loading");
    toast(state.message, {
      style: {
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        border: "1px solid",
        fontSize: "0.875rem",
        fontWeight: "500",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        ...(state.status === 200
          ? {
              backgroundColor: "#f0fdf4",
              color: "#15803d",
              borderColor: "#bbf7d0",
            }
          : {
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              borderColor: "#fecaca",
            }),
        ...(state.status === 200
          ? {
              ".dark &": {
                backgroundColor: "#14532d",
                color: "#bbf7d0",
                borderColor: "#15803d",
              },
            }
          : {
              ".dark &": {
                backgroundColor: "#7f1d1d",
                color: "#fecaca",
                borderColor: "#b91c1c",
              },
            }),
      },
      duration: 3000,
      position: "top-right",
    });

    if (state.status === 200) {
      setOpen(false);
      setState(initialState);
    }
  }, [state.message, state.status]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsPending(true);

      const formData = new FormData(e.currentTarget);

      try {
        // Show loading toast
        toast.loading("Saving...", {
          id: "category-update-loading",
          style: {
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            border: "1px solid #e5e7eb",
            fontSize: "0.875rem",
            fontWeight: "500",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
           
          },
          duration: Infinity,
        });

        // Submit form data
        const result = await updateCategory(category.id, initialState, formData);
        setState(result);
        setIsPending(false);
      } catch (error) {
        setIsPending(false);
        toast.dismiss("category-update-loading");
        toast.error("An unexpected error occurred", {
          style: {
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          duration: 3000,
        });
      }
    },
    [category.id]
  );

  // Reset form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setState(initialState);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Edit category"
          className={clsx(
            "border-indigo-600 text-indigo-600 dark:border-indigo-800 dark:text-indigo-400",
            "hover:bg-indigo-900 hover:text-indigo-100 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-200",
            "transition-all duration-300 ease-in-out transform hover:scale-105",
            "shadow-sm hover:shadow-md"
          )}
        >
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={clsx(
          "bg-black dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-lg mx-auto",
          "text-left",
          "animate-in fade-in-50 duration-300"
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={clsx(
              "text-xl font-bold text-indigo-100 dark:text-indigo-200",
              "text-left",
              "relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-indigo-600 after:rounded"
            )}
          >
            Edit Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          {/* Category Name Field */}
          <div className={clsx("flex flex-col gap-4 sm:flex-row", "text-left")}>
            <Label
              htmlFor="categoryName"
              className={clsx(
                "text-sm font-medium text-indigo-100 dark:text-gray-200",
                "w-full sm:w-1/3 flex items-center"
              )}
            >
              Name
            </Label>
            <div className="w-full sm:flex-1 space-y-2">
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                defaultValue={category.name}
                placeholder="Enter category name"
                disabled={isPending}
                className={clsx(
                  "w-full rounded-lg border-indigo-600 dark:border-gray-600",
                  "bg-black/50 dark:bg-gray-800/50 text-indigo-100 dark:text-gray-100",
                  "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  "transition-all duration-300 ease-in-out",
                  "hover:border-indigo-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  state.error?.categoryName && "border-red-500 animate-shake"
                )}
                aria-describedby={state.error?.categoryName ? "categoryName-error" : undefined}
              />
              {state.error?.categoryName && (
                <p
                  id="categoryName-error"
                  className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in"
                  aria-live="polite"
                >
                  <span className="text-red-500">⚠</span> {state.error.categoryName}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter className={clsx("flex flex-col sm:flex-row sm:gap-3", "mt-6")}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className={clsx(
                "w-full sm:w-auto border-indigo-600 text-indigo-900 dark:border-gray-600 dark:text-gray-200",
                "hover:bg-indigo-900 dark:hover:bg-gray-700 hover:text-indigo-100",
                "transition-all duration-300 ease-in-out transform hover:scale-105",
                "shadow-sm hover:shadow-md"
              )}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={clsx(
                "w-full sm:w-auto bg-indigo-600 text-indigo-100 dark:bg-indigo-700 dark:text-indigo-200",
                "hover:bg-indigo-700 dark:hover:bg-indigo-800",
                "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                "transition-all duration-300 ease-in-out transform hover:scale-105",
                "shadow-md hover:shadow-lg",
                isPending && "opacity-60 cursor-not-allowed",
                isPending && "flex items-center gap-2"
              )}
              aria-label={isPending ? "Saving..." : "Save and close"}
            >
              {isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;