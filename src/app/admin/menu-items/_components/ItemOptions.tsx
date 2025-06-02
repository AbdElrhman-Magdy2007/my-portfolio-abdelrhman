// app/menu-items/_components/ItemOptions.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageOption, ProductAddon, ProductTech } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export enum ItemOptionsKeys {
  ProductTechS = "ProductTechS",
  ProductAddonS = "ProductAddonS",
}

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

interface ItemOptionsProps<T> {
  state: T[];
  setState: React.Dispatch<React.SetStateAction<T[]>>;
  optionKey: ItemOptionsKeys;
  className?: string;
  placeholder?: string;
  validate?: (item: T) => string | null;
}

function ItemOptions<T extends Partial<ProductTech> | Partial<ProductAddon>>({
  state,
  setState,
  optionKey,
  className,
  placeholder = "Enter option",
  validate = () => null,
}: ItemOptionsProps<T>) {
  const [isAdding, setIsAdding] = useState(false);
  const isProductTech = optionKey === ItemOptionsKeys.ProductTechS;
  const showAddButton = isProductTech || state.length < 1;

  const handleOptions = useCallback(() => {
    const addOption = async () => {
      if (!isProductTech && state.length >= 1) {
        toast.error("Only one addon is allowed.", {
          icon: <Trash2 className="w-5 h-5 text-red-400" />,
          style: {
            backgroundColor: "#4E1313",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        });
        return;
      }

      setIsAdding(true);
      try {
        if (state.length > 0) {
          const lastItem = state[state.length - 1];
          const error = validate(lastItem);
          if (error) {
            toast.error(error, {
              icon: <Trash2 className="w-5 h-5 text-red-400" />,
              style: {
                backgroundColor: "#4E1313",
                color: "#FCA5A5",
                border: "1px solid #FCA5A5",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
            });
            return;
          }
        }
        setState((prev) => [...prev, { name: "" } as T]);
        toast.success(`${isProductTech ? "Technology" : "Addon"} added`, {
          icon: <Plus className="w-5 h-5 text-green-400" />,
          style: {
            backgroundColor: "#1A3C34",
            color: "#6EE7B7",
            border: "1px solid #6EE7B7",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        });
      } catch (error) {
        toast.error("Failed to add option", {
          icon: <Trash2 className="w-5 h-5 text-red-400" />,
          style: {
            backgroundColor: "#4E1313",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        });
      } finally {
        setIsAdding(false);
      }
    };

    const onChange = (index: number, updatedItem: T) => {
      setState((prev) => {
        const newItems = [...prev];
        newItems[index] = updatedItem;
        return newItems;
      });
    };

    const removeOption = (index: number) => {
      setState((prev) => prev.filter((_, i) => i !== index));
      toast.success(`${isProductTech ? "Technology" : "Addon"} removed`, {
        icon: <Trash2 className="w-5 h-5 text-green-400" />,
        style: {
          backgroundColor: "#1A3C34",
          color: "#6EE7B7",
          border: "1px solid #6EE7B7",
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    };

    return { addOption, onChange, removeOption };
  }, [setState, state, validate, isProductTech]);

  const { addOption, onChange, removeOption } = handleOptions();

  return (
    <div className={clsx("space-y-6", className)}>
      <AnimatePresence>
        {state.length > 0 && (
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {state.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className={clsx(
                  "flex items-end gap-4 p-4 rounded-xl shadow-sm",
                  "bg-background border border-border",
                  "hover:shadow-md transition-all duration-300"
                )}
                role="listitem"
                aria-label={`${isProductTech ? "Technology" : "Addon"} option ${index + 1}`}
              >
                <div className="flex-1 space-y-2">
                  <Label
                    className="text-sm font-medium text-foreground"
                    htmlFor={`${optionKey}-${index}-name`}
                  >
                    {isProductTech ? "Technology" : "Addon Name"}
                  </Label>
                  {isProductTech ? (
                    <Input
                      id={`${optionKey}-${index}-name`}
                      type="text"
                      placeholder={placeholder}
                      value={item.name ?? ""}
                      onChange={(e) =>
                        onChange(index, { ...item, name: e.target.value })
                      }
                      className={clsx(
                        "w-full p-3 rounded-md bg-background text-foreground border border-input",
                        "focus:ring-2 focus:ring-primary focus:border-primary",
                        "placeholder-muted-foreground"
                      )}
                      required
                      aria-required="true"
                    />
                  ) : (
                    <SelectName
                      item={item as Partial<ProductAddon>}
                      onChange={(fieldName, value) =>
                        onChange(index, { ...item, [fieldName]: value })
                      }
                      index={index}
                      currentState={state as Partial<ProductAddon>[]}
                      optionKey={optionKey}
                    />
                  )}
                </div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className={clsx(
                      "flex-shrink-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive",
                      "focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background"
                    )}
                    aria-label={`Remove ${isProductTech ? "technology" : "addon"} option ${index + 1}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddButton && (
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="button"
              variant="outline"
              className={clsx(
                "w-full py-3 rounded-xl shadow-sm",
                "bg-gradient-to-r from-primary to-secondary text-primary-foreground border border-primary/50",
                "hover:bg-primary/80 hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                "flex items-center justify-center gap-2",
                isAdding && "opacity-50 cursor-not-allowed"
              )}
              onClick={addOption}
              disabled={isAdding}
              aria-label={`Add new ${isProductTech ? "technology" : "addon"} option`}
              aria-disabled={isAdding ? "true" : "false"}
            >
              <Plus className="w-5 h-5" />
              <span>{isProductTech ? "Add Technology" : "Add Addon"}</span>
              {isAdding && (
                <svg
                  className="animate-spin h-5 w-5 ml-2 text-primary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SelectNameProps {
  index: number;
  item: Partial<ProductAddon>;
  currentState: Partial<ProductAddon>[];
  optionKey: ItemOptionsKeys;
  onChange: (fieldName: keyof ProductAddon, value: string) => void;
}

function SelectName({ onChange, index, item, currentState, optionKey }: SelectNameProps) {
  const packageOptions = useMemo(
    () => [
      PackageOption.FullStack,
      PackageOption.Backend,
      PackageOption.Frontend,
      PackageOption.UI,
      PackageOption.UX,
    ],
    []
  );

  const availableOptions = useMemo(
    () =>
      packageOptions.filter(
        (option) =>
          !currentState.some((s) => s.name === option) || item.name === option
      ),
    [currentState, item.name]
  );

  return (
    <Select
      onValueChange={(value) => onChange("name", value)}
      value={item.name || ""}
      required
    >
      <SelectTrigger
        className={clsx(
          "w-full p-3 rounded-md bg-background text-foreground border border-input",
          "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          "hover:bg-accent/50"
        )}
        aria-label="Select addon option"
        aria-required="true"
      >
        <SelectValue placeholder="Select Addon" />
      </SelectTrigger>
      <SelectContent
        className={clsx(
          "rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto",
          "bg-background border border-border text-foreground"
        )}
      >
        <SelectGroup>
          {availableOptions.length > 0 ? (
            availableOptions.map((option, idx) => (
              <SelectItem
                key={idx}
                value={option}
                className={clsx(
                  "text-foreground hover:bg-accent hover:text-accent-foreground",
                  "transition-all duration-200 cursor-pointer py-2 px-4"
                )}
              >
                {option}
              </SelectItem>
            ))
          ) : (
            <div className="text-muted-foreground text-center py-2">
              No options available
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ItemOptions;