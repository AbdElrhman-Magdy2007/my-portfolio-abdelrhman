"use server";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import clsx from "clsx";
import { Pages, Routes } from "@/constants/enums";
import { Edit, Plus } from "lucide-react";
import DeleteUserButton from "./_components/DeleteUserButton";
import { Suspense } from "react";
import { getUsers } from "@/app/server/db/users";

async function UsersPage() {
  const users = await getUsers();

  return (
    <main
      className={clsx(
        "min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950",
        "relative overflow-hidden"
      )}
      dir="auto"
    >
      {/* Particle Background */}
      <div className="particle-wave pointer-events-none">
        <div
          className="particle"
          style={{
            width: "8px",
            height: "8px",
            top: "20%",
            left: "15%",
            animationDuration: "3s",
            animationDelay: "0.3s",
          }}
        />
        <div
          className="particle"
          style={{
            width: "6px",
            height: "6px",
            top: "70%",
            left: "80%",
            animationDuration: "2.5s",
            animationDelay: "0.8s",
          }}
        />
      </div>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div
          className={clsx(
            "container mx-auto max-w-5xl glass-card p-8",
            "border border-indigo-600/30 rounded-xl",
            "animate-reveal-text delay-200"
          )}
        >
          {/* Header with Title and Add User Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1
              className={clsx(
                "text-3xl lg:text-4xl font-bold text-indigo-200 text-center sm:text-start",
                "text-gradient-primary animate-glow"
              )}
            >
              Manage Users
            </h1>
            <Link
              href={`/${Routes.ADMIN}/${Pages.USERS}/${Pages.NEW}`}
              className={clsx(
                buttonVariants({ variant: "default", size: "lg" }),
                "btn-primary bg-indigo-600 hover:bg-indigo-500 text-white",
                "flex items-center gap-2 animate-glow",
                "transition-all duration-300"
              )}
              aria-label="Add new user"
            >
              <Plus className="w-5 h-5" />
              Add New User
            </Link>
          </div>

          {/* Users List or No Users Message */}
          <Suspense
            fallback={
              <p
                className={clsx(
                  "text-center text-indigo-300 text-lg font-medium",
                  "animate-reveal-text delay-300"
                )}
              >
                Loading users...
              </p>
            }
          >
            {users.length === 0 ? (
              <div
                className={clsx(
                  "flex items-center justify-center py-16 bg-slate-800/30 rounded-lg",
                  "border border-indigo-600/20"
                )}
              >
                <p
                  className={clsx(
                    "text-lg text-indigo-300 font-medium",
                    "animate-reveal-text delay-300"
                  )}
                >
                  No users found.
                </p>
              </div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className={clsx(
                      "project-card glass-card p-6 rounded-lg flex flex-col",
                      "bg-slate-800/30 border border-indigo-600/20",
                      "hover:shadow-2xl transition-all duration-300",
                      "animate-reveal-text delay-400"
                    )}
                  >
                    <div className="flex flex-col gap-3 flex-1">
                      <h3
                        className={clsx(
                          "text-lg font-semibold text-indigo-100 truncate",
                          "text-gradient-primary animate-glow"
                        )}
                      >
                        {user.name}
                      </h3>
                      <p className="text-base text-indigo-300 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Link
                        href={`/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`}
                        className={clsx(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "btn-secondary border-indigo-500 text-indigo-100",
                          "hover:bg-indigo-500/20 hover:text-indigo-50",
                          "active:bg-indigo-600/30",
                          "flex items-center gap-2 transition-all duration-300"
                        )}
                        aria-label={`Edit user ${user.name}`}
                        title={`Edit user ${user.name}`}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                      <DeleteUserButton userId={user.id} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Suspense>
        </div>
      </section>
    </main>
  );
}

export default UsersPage;