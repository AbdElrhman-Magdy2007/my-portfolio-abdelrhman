"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Pages, Routes, Languages } from "@/constants/enums";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Loader } from "lucide-react";
import { useCallback, useMemo } from "react";

// Define interfaces for type safety
interface AuthSectionProps {
  onCloseMenu?: () => void;
    isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  logout: () => void;
  className: string;
}

interface ButtonConfig {
  label: string;
  path: string;
  isActive: boolean;
  variant: "link" | "default";
  ariaLabel: string;
    isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  logout: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  [key: string]: any; // Allow additional properties for flexibility
  }

/**
 * AuthSection component renders a modern, responsive authentication UI with glassmorphism effects
 * and dynamic animations, designed to integrate seamlessly with a modern website
 * @param {AuthSectionProps} props - Component props
 * @returns {JSX.Element} Styled authentication section
 */
function AuthSection({ onCloseMenu }: AuthSectionProps): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isArabic = params?.locale === Languages.ARABIC;

  // Memoized navigation handler
  const navigateWithClose = useCallback(
    (path: string) => {
      router.push(path);
      onCloseMenu?.();
    },
    [router, onCloseMenu]
  );

  // Memoized sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: `/${Routes.ROOT}` });
      onCloseMenu?.();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [onCloseMenu]);

  // Memoized button configurations
  const buttons = useMemo<ButtonConfig[]>(
    () => [
      {
        label: "Login",
        path: `/${Routes.AUTH}${Pages.LOGIN}`,
        isActive: pathname?.startsWith(`/${Routes.AUTH}${Pages.LOGIN}`) ?? false,
        variant: "link",
        ariaLabel: "Navigate to login page",
        isAuthenticated: false,
        user: null,
        logout: function (): void {
          throw new Error("Function not implemented.");
        }
      },
      {
        label: "Sign Up",
        path: `/${Routes.AUTH}${Pages.Register}`,
        isActive: pathname?.startsWith(`/${Routes.AUTH}${Pages.Register}`) ?? false,
        variant: "default",
        ariaLabel: "Navigate to sign up page",
        isAuthenticated: false,
        user: null,
        logout: function (): void {
          throw new Error("Function not implemented.");
        }
      },
    ],
    [pathname]
  );

  // Animation variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  // Error state
  if (!pathname) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-rose-500 dark:text-rose-400 font-semibold text-sm p-4 rounded-xl bg-rose-50/50 dark:bg-rose-900/20 backdrop-blur-md"
        role="alert"
        aria-live="assertive"
      >
        Error: Unable to determine current path
      </motion.div>
    );
  }

  // Loading state
  if (status === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-4 p-4"
      >
        <Button
          className={clsx(
            "px-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white",
            "dark:from-blue-700 dark:to-blue-800 dark:text-gray-100",
            "animate-pulse cursor-not-allowed",
            "transition-opacity duration-300 ease-in-out",
            "backdrop-blur-md shadow-md"
          )}
          size="lg"
          disabled
          aria-label="Loading authentication status"
        >
          <Loader className="w-5 h-5 animate-spin mr-2" aria-hidden="true" />
          Loading...
        </Button>
      </motion.div>
    );
  }

  // Authenticated state
  if (session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-4 p-4"
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            className={clsx(
              "px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white",
              "dark:from-blue-700 dark:to-blue-800 dark:text-gray-100",
              "hover:from-blue-600 hover:to-blue-700",
              "dark:hover:from-blue-800 dark:hover:to-blue-900",
              "active:from-blue-700 active:to-blue-800",
              "dark:active:from-blue-900 dark:active:to-blue-950",
              "shadow-md hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-800/30",
              "transition-all duration-300 ease-in-out backdrop-blur-md",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:shadow-lg",
              "text-base font-semibold"
            )}
            size="lg"
            onClick={handleSignOut}
            aria-label="Sign Out"
          >
            Sign Out
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Unauthenticated state
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "flex items-center justify-center gap-4 p-4 sm:gap-6 md:gap-8",
        isArabic ? "flex-row-reverse" : "flex-row"
      )}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {buttons.map(({ label, path, isActive, variant, ariaLabel }) => (
        <motion.div
          key={label}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            className={clsx(
              "text-base font-semibold",
              variant === "link"
                ? clsx(
                    isActive
                      ? "text-blue-600 dark:text-blue-300 underline underline-offset-4"
                      : "text-blue-500 dark:text-blue-400",
                    "hover:text-blue-700 dark:hover:text-blue-200",
                    "active:text-blue-800 dark:active:text-blue-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    "transition-all duration-300 ease-in-out"
                  )
                : clsx(
                    "px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                    "dark:from-blue-700 dark:to-blue-800 dark:text-gray-100",
                    "hover:from-blue-600 hover:to-blue-700",
                    "dark:hover:from-blue-800 dark:hover:to-blue-900",
                    "active:from-blue-700 active:to-blue-800",
                    "dark:active:from-blue-900 dark:active:to-blue-950",
                    "shadow-md hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-800/30",
                    "transition-all duration-300 ease-in-out backdrop-blur-md",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    isActive && "ring-2 ring-blue-300 dark:ring-blue-500"
                  )
            )}
            size="lg"
            variant={variant}
            onClick={() => navigateWithClose(path)}
            aria-label={ariaLabel}
          >
            {label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default AuthSection;