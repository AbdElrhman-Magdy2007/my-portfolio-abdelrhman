"use server";

import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { authOptions } from "../server/auth";
import AdminTabs from "./_components/AdminTabs";

// Helper function to ensure admin access
async function ensureAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/login");
  }
  return session;
}

// Admin layout component for rendering admin dashboard
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify admin access
  await ensureAdminAccess();

  return (
    <div className={clsx("flex flex-col min-h-screen bg-background dark", "transition-colors duration-300")}>
      {/* Header */}
      <header
        className={clsx(
          "glass-card",
          "supports-[backdrop-filter]:backdrop-blur-md",
          "shadow-md border-b border-border/50",
          "py-4"
        )}
        aria-label="Admin Dashboard Header"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className={clsx(
              "text-2xl sm:text-3xl font-heading font-bold text-gradient-primary animate-reveal-text pb-16",
              "mb-4 text-center"
            )}
          >
            {/* Admin Dashboard */}
          </h1>
          <AdminTabs />
        </div>
      </header>

      {/* Main Content */}
      <main
        className={clsx(
          "flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
          "text-foreground"
        )}
      >
        <div className="relative glass-card p-6 rounded-xl">
          {children}
        </div>
      </main>

    </div>
  );
}
