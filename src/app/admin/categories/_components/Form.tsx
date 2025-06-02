"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useActionState, useEffect } from "react";
import { addCategory } from "../_actions/category";
import { Loader } from "lucide-react";
import clsx from "clsx";

type InitialStateType = {
  message?: string;
  error?: ValidationError;
  status?: number | null;
};

const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};

function Form() {
  const [state, action, pending] = useActionState(addCategory, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        className: state.status === 201 ? "text-emerald-400" : "text-red-400",
      });
      // Log the response from addCategory action
      console.log("Category Action Response:", {
        message: state.message,
        status: state.status,
        error: state.error,
      });
    }
  }, [state.message, state.status, state.error]);

  // Handle form submission to log category name
  const handleSubmit = async (formData: FormData) => {
    const categoryName = formData.get("categoryName");
    console.log("Submitted Category Name:", categoryName);
    return await action(formData);
  };

  return (
    <div className={clsx(
      "glass-card p-6 border border-indigo-600/20 bg-slate-800/30",
      "rounded-xl animate-reveal-text delay-200"
    )}>
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="categoryName"
            className={clsx(
              "text-indigo-100 font-semibold text-lg",
              "text-gradient-primary animate-glow"
            )}
          >
            Category Name
          </Label>
          <div className="flex items-center gap-4">
            <Input
              type="text"
              name="categoryName"
              id="categoryName"
              placeholder="Enter category name"
              className={clsx(
                "search-input bg-slate-900/50 text-indigo-100 placeholder-indigo-300/50",
                "border-indigo-500/30 focus:ring-indigo-400 focus:border-indigo-400",
                "transition-all duration-300 rounded-md"
              )}
            />
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className={clsx(
                "btn-primary bg-indigo-600 hover:bg-indigo-500 text-white",
                "flex items-center gap-2 animate-glow",
                pending && "opacity-70 cursor-not-allowed"
              )}
            >
              {pending ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
          {state.error?.name && (
            <p
              className={clsx(
                "text-sm text-red-400 font-medium",
                "animate-reveal-text delay-300"
              )}
            >
              {state.error.name}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Form;