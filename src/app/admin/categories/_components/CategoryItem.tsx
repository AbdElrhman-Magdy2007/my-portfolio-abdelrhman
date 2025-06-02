"use client";

import { Category } from "@prisma/client";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import clsx from "clsx";

async function CategoryItem({ category }: { category: Category }) {
  return (
    <li
      className={clsx(
        "project-card glass-card p-4 rounded-lg flex justify-between items-center",
        "bg-slate-800/30 border border-indigo-600/20",
        "hover:shadow-2xl transition-all duration-300 animate-reveal-text delay-300",
        "relative overflow-hidden"
      )}
    >
      {/* Particle Background */}
      <div className="particle-wave pointer-events-none">
        <div
          className="particle"
          style={{
            width: "6px",
            height: "6px",
            top: "15%",
            left: "10%",
            animationDuration: "2.5s",
            animationDelay: "0.2s",
          }}
        />
        <div
          className="particle"
          style={{
            width: "5px",
            height: "5px",
            top: "75%",
            left: "85%",
            animationDuration: "3s",
            animationDelay: "0.7s",
          }}
        />
      </div>

      <h3
        className={clsx(
          "text-indigo-100 font-medium text-lg flex-1",
          "text-gradient-primary animate-glow"
        )}
      >
        {category.name}
      </h3>
      <div className="flex items-center gap-3">
        <EditCategory category={category} />
        <DeleteCategory id={category.id} />
      </div>
    </li>
  );
}

export default CategoryItem;