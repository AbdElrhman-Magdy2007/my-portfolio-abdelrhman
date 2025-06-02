// app/profile/page.tsx
import { Pages, Routes } from "@/constants/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { authOptions } from "../server/auth";
import EditUserForm from "@/components/edit-user-form";
import { UserRole } from "@prisma/client";

export default async function ProfilePage() {
  // Fetch session data
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session) {
    redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  // Redirect admins to admin dashboard
  if (session.user.role === UserRole.ADMIN) {
    redirect(`/${Routes.ADMIN}`);
  }

  return (
    <main className="relative min-h-screen bg-background transition-colors duration-300 overflow-hidden">
      {/* Particle Background */}
      <div className="particle-wave">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              animationDuration: `${Math.random() * 4 + 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient-primary animate-reveal-text tracking-tight"
              aria-labelledby="profile-title"
            >
              Your Profile
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground animate-reveal-text delay-200">
              Manage your account details with ease
            </p>
          </header>

          {/* Profile Card */}
          <div className="max-w-3xl mx-auto">
            <div className="card glass-card animate-reveal-text delay-400 p-8">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center py-10">
                    <Loader
                      className="w-12 h-12 animate-spin text-primary"
                      aria-hidden="true"
                    />
                  </div>
                }
              >
                {session.user ? (
                  <EditUserForm user={session.user} />
                ) : (
                  <p
                    className="text-center text-destructive font-medium"
                    role="alert"
                  >
                    Unable to load user data. Please try again.
                  </p>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}