"use server";

import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { UserRole } from "@prisma/client";
import { ArrowRightCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MenuItems from "./_components/MenuItems";
import Link from "next/link";
import { getProducts } from "@/app/server/db/products";
import { authOptions } from "@/app/server/auth";
import clsx from "clsx";

async function MenuItemsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect(`/${Routes.PROFILE}`);
  }

  let products;
  try {
    products = await getProducts(); // Returns ProductWithRelations[]
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <main
        className={clsx(
          "min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950",
          "relative overflow-hidden"
        )}
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
            <h1
              className={clsx(
                "text-3xl lg:text-4xl font-bold text-indigo-200 mb-6 text-center",
                "text-gradient-primary animate-glow"
              )}
            >
              Error Loading Menu Items
            </h1>
            <p
              className={clsx(
                "text-red-400 text-center text-lg font-medium",
                "animate-reveal-text delay-300"
              )}
            >
              An unexpected error occurred
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={clsx(
        "min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950",
        "relative overflow-hidden"
      )}
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
          <h1
            className={clsx(
              "text-3xl lg:text-4xl font-bold text-indigo-200 mb-6 text-center",
              "text-gradient-primary animate-glow"
            )}
          >
            Manage Menu Items
          </h1>
          <Link
            href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
            className={clsx(
              buttonVariants({ variant: "default", size: "lg" }),
              "btn-primary bg-indigo-600 hover:bg-indigo-500 text-white",
              "flex w-80 mx-auto mb-8 items-center gap-2",
              "animate-glow transition-all duration-300"
            )}
          >
            Add New Item
            <ArrowRightCircle className="w-5 h-5" />
          </Link>
          {Array.isArray(products) && (
            products.length > 0 ? (
              <MenuItems products={products} />
            ) : (
              <p
                className={clsx(
                  "text-indigo-300 text-center text-lg font-medium",
                  "animate-reveal-text delay-300"
                )}
              >
                No products available
              </p>
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default MenuItemsPage;