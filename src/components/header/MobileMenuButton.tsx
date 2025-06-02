"use client";

import React, { memo } from "react";
import { Menu, X } from "lucide-react";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { Languages } from "@/constants/enums";

interface MobileMenuButtonProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  const params = useParams();
  const isArabic = params?.locale === Languages.ARABIC;

  return (
    <button
      onClick={toggleMobileMenu}
      className={clsx(
        "p-2 rounded-full transition-all duration-200 ease-in-out",
        "hover:bg-indigo-100 dark:hover:bg-indigo-200",
        "active:bg-indigo-200 dark:active:bg-indigo-200",
        "text-indigo-200 dark:text-indigo-200",
        isArabic ? "mr-2" : "ml-2"
      )}
      aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      {isMobileMenuOpen ? (
        <X size={24} aria-hidden="true" className="text-indigo-200"/>
      ) : (
        <Menu size={24} aria-hidden="true" />
      )}
    </button>
  );
};

export default memo(MobileMenuButton);