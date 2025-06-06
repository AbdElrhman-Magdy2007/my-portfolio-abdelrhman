"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { addCategory, ActionResponse } from "../_actions/category";
import { Loader } from "lucide-react";
import clsx from "clsx";

function Form() {
  const [state, formAction] = useFormState<ActionResponse, FormData>(
    (prevState, formData) => addCategory(prevState, formData),
    {
      message: "",
      status: 0,
      error: undefined
    }
  );

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        className: state.status === 201 ? "text-emerald-400" : "text-red-400",
      });
    }
  }, [state.message, state.status]);

  return (
    <div className={clsx(
      "glass-card p-6 border border-indigo-600/20 bg-slate-800/30",
      "rounded-xl animate-reveal-text delay-200"
    )}>
      <form action={formAction} className="space-y-4">
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
              disabled={state.status === 201}
              className={clsx(
                "btn-primary bg-indigo-600 hover:bg-indigo-500 text-white",
                "flex items-center gap-2 animate-glow",
                state.status === 201 && "opacity-70 cursor-not-allowed"
              )}
            >
              {state.status === 201 ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
          {state.error?.categoryName && (
            <p
              className={clsx(
                "text-sm text-red-400 font-medium",
                "animate-reveal-text delay-300"
              )}
            >
              {state.error.categoryName}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Form;