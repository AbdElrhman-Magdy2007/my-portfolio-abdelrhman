"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface HeaderProps {
  user: {
    email?: string;
    name?: string;
    image?: string;
  } | null | undefined;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <div className="flex items-center gap-x-4">
          {user?.email && (
            <div className="flex items-center gap-x-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 