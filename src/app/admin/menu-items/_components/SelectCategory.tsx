"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Category } from "@prisma/client";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const triggerVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const contentVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const itemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

/**
 * Props for the SelectCategory component.
 */
interface SelectCategoryProps {
  /** List of available categories */
  categories: Category[];
  /** Currently selected category ID */
  categoryId: string;
  /** Function to update the selected category ID */
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional flag to mark the field as required */
  required?: boolean;
}

/**
 * A polished dropdown component for selecting a product category.
 * Features smooth animations, a modern design, and full accessibility.
 * @param props - Component props
 * @returns JSX.Element
 */
function SelectCategory({
  categories,
  categoryId,
  setCategoryId,
  className,
  required = false,
}: SelectCategoryProps) {
  // Memoize the current category to prevent unnecessary lookups
  const currentItem = React.useMemo(
    () => categories.find((item) => item.id === categoryId),
    [categories, categoryId]
  );

  // Handle value change with type safety
  const handleValueChange = React.useCallback(
    (value: string) => {
      setCategoryId(value);
    },
    [setCategoryId]
  );

  return (
    <div className={clsx("space-y-2", className)}>
      <Label
        htmlFor="categoryId"
        className="text-sm font-medium text-foreground capitalize"
      >
        Category
      </Label>
      <motion.div
        variants={triggerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <Select
          name="categoryId"
          onValueChange={handleValueChange}
          value={categoryId}
          required={required}
        >
          <SelectTrigger
            id="categoryId"
            className={clsx(
              "w-full h-12 bg-background border border-input rounded-xl",
              "text-foreground placeholder-muted-foreground",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              "hover:bg-accent/50 transition-all duration-200",
              "bg-gradient-to-r from-primary/10 to-secondary/10"
            )}
            aria-label="Select product category"
            aria-required={required}
          >
            <SelectValue placeholder="Select a category">
              {currentItem?.name || "Select a category"}
            </SelectValue>
          </SelectTrigger>
          <AnimatePresence>
            <SelectContent
              className={clsx(
                "bg-background border border-border rounded-xl shadow-lg",
                "text-foreground max-h-60 overflow-y-auto z-50"
              )}
            >
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SelectGroup>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <motion.div
                        key={category.id}
                        variants={itemVariants}
                        className="px-4 py-2"
                      >
                        <SelectItem
                          value={category.id}
                          className={clsx(
                            "text-foreground hover:bg-accent hover:text-accent-foreground",
                            "focus:bg-accent focus:text-accent-foreground",
                            "transition-colors duration-150 cursor-pointer rounded-md"
                          )}
                        >
                          {category.name}
                        </SelectItem>
                      </motion.div>
                    ))
                  ) : (
                    <div
                      className="px-4 py-2 text-muted-foreground italic"
                      aria-live="polite"
                    >
                      No categories available
                    </div>
                  )}
                </SelectGroup>
              </motion.div>
            </SelectContent>
          </AnimatePresence>
        </Select>
      </motion.div>
    </div>
  );
}

export default React.memo(SelectCategory);