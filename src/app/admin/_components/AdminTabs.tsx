"use client";

import { useMemo, memo } from "react";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import clsx from "clsx";
import Link from "next/link";

interface AdminTab {
  id: string;
  title: string;
  href: string;
}

const AdminTabs = memo(() => {
  const pathname = usePathname();

  const tabs: AdminTab[] = [
    { id: "tab-profile", title: "Profile", href: `${Routes.ADMIN}` },
    { id: "tab-categories", title: "Categories", href: `${Routes.ADMIN}/${Pages.CATEGORIES}` },
    { id: "tab-menu-items", title: "Menu Items", href: `${Routes.ADMIN}/${Pages.MENU_ITEMS}` },
    { id: "tab-users", title: "Users", href: `${Routes.ADMIN}/${Pages.USERS}` },
    // { id: "tab-orders", title: "Orders", href: `${Routes.ADMIN}/${Pages.ORDERS}` },
  ];

  const isActiveTab = useMemo(() => {
    return (href: string) =>
      href === Routes.ADMIN
        ? (pathname ?? '') === `/${href}`
        : (pathname ?? '').startsWith(`/${href}`);
  }, [pathname]);

  return (
    <nav
      className={clsx(
        "bg-gray-50 dark:bg-gray-900 shadow-md dark:shadow-black/40",
        "py-4 px-6 sm:px-8 lg:px-12",
        "rounded-lg max-w-7xl mx-auto",
        "border border-gray-200 dark:border-gray-700"
      )}
      aria-label="Admin Navigation"
    >
      <ul
        role="tablist"
        className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto"
      >
        {tabs.map((tab) => {
          const active = isActiveTab(tab.href);
          return (
            <li key={tab.id} role="presentation" className="relative group">
              <Link
                href={`/${tab.href}`}
                role="tab"
                aria-current={active ? "page" : undefined}
                className={clsx(
                  buttonVariants({
                    variant: active ? "default" : "outline",
                    size: "lg",
                  }),
                  "relative px-7 py-3 font-semibold text-base tracking-wider",
                  "transition duration-300 ease-in-out",
                  "rounded-lg shadow-sm",
                  active
                    ? "bg-blue-600 text-white shadow-blue-500/40"
                    : "bg-transparent text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-opacity-60"
                )}
              >
                <span className="relative z-10">{tab.title}</span>

                {/* Hover effect: subtle gradient background */}
                {!active && (
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "absolute inset-0 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 opacity-0 group-hover:opacity-30 dark:from-blue-800 dark:to-blue-900",
                      "transition-opacity duration-300 ease-in-out pointer-events-none"
                    )}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

AdminTabs.displayName = "AdminTabs";

export default AdminTabs;
