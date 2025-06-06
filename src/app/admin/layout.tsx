"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCurrentUser } from "@/lib/session";

// Define UserRole enum locally
enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

// Ensure admin access middleware
async function ensureAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/signin");
  }
}

// Admin layout component for rendering admin dashboard
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureAdminAccess();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Sidebar />
      </Suspense>
      <div className="lg:pl-72">
        <Suspense fallback={<LoadingSpinner />}>
          <Header user={user} />
        </Suspense>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
