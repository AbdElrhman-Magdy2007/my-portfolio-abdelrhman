// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import clsx from "clsx";
import { authOptions } from "../server/auth";
import type { Session } from "next-auth";
import type { JSX } from "react";

// Constants for reusability
const ROUTES = {
  LOGIN: `/auth/${Pages.LOGIN}?redirect=/admin`,
  PROFILE: `/${Routes.PROFILE}`,
} as const;

const CLASS_NAMES = {
  MAIN: clsx(
    "min-h-screen bg-background",
    "flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8",
    "transition-colors duration-300 dark"
  ),
  SECTION: clsx(
    "w-full max-w-4xl p-6 lg:p-8",
    "glass-card",
    "supports-[backdrop-filter]:backdrop-blur-md"
  ),
  TITLE: clsx(
    "text-3xl lg:text-4xl font-heading font-bold text-gradient-primary animate-reveal-text",
    "mb-8 text-center"
  ),
} as const;

// Admin Dashboard Component
interface AdminDashboardProps {
  user: Session["user"];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => (
  <section className={CLASS_NAMES.SECTION} role="region" aria-labelledby="admin-dashboard-title">
    <div className="container mx-auto">
      <h1 id="admin-dashboard-title" className={CLASS_NAMES.TITLE}>
        Admin Dashboard
      </h1>
      <div className="relative">
        <EditUserForm user={user}  />
      </div>
    </div>
  </section>
);

// AdminPage Server Component
export default async function AdminPage(): Promise<JSX.Element> {
  // Fetch session
  let session: Session | null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Failed to fetch session:", error);
    redirect(ROUTES.LOGIN);
  }

  // Redirect if no session or user
  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  // Redirect if user is not an admin
  if (session.user.role !== UserRole.ADMIN) {
    redirect(ROUTES.PROFILE);
  }

  return (
    <main className={CLASS_NAMES.MAIN} aria-labelledby="admin-dashboard-title">
      <AdminDashboard user={session.user} />
    </main>
  );
}