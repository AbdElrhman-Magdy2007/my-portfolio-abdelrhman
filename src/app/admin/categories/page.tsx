// import { getCategories } from "@/app/server/db/categories";
// import CategoryItem from "./_components/CategoryItem";
// import Form from "./_components/Form";
// import clsx from "clsx";

// // CategoriesPage component for displaying and managing categories
// export default async function CategoriesPage() {
//   let categories: any[] = [];
//   try {
//     categories = await getCategories();
//   } catch (error) {
//     console.warn("Failed to fetch categories:", error);
//   }

//   return (
//     <main
//       className={clsx(
//         "min-h-screen bg-background dark",
//         "transition-colors duration-300 relative"
//       )}
//       aria-label="Categories Management"
//     >
//       <section className="py-12 px-4 sm:px-6 lg:px-8">
//         <div
//           className={clsx(
//             "container mx-auto max-w-4xl",
//             "glass-card",
//             "supports-[backdrop-filter]:backdrop-blur-md",
//             "rounded-lg shadow-lg dark:shadow-primary/50 border border-border/50"
//           )}
//         >
//           <div className="sm:max-w-[625px] mx-auto space-y-8 p-6">
//             {/* Title */}
//             <h1
//               className={clsx(
//                 "text-2xl sm:text-3xl font-heading font-bold text-gradient-primary animate-reveal-text",
//                 "text-center"
//               )}
//             >
//               Manage Categories
//             </h1>

//             {/* Category Creation Form */}
//             <div className="animate-reveal-text delay-200">
//               <Form />
//             </div>

//             {/* Categories List */}
//             {categories.length > 0 ? (
//               <ul className="flex flex-col gap-6" role="list">
//                 {categories.map((category, index) => (
//                   <li
//                     key={category.id}
//                     className={clsx("animate-scale-in", `delay-${(index + 1) * 100}`)}
//                   >
//                     <CategoryItem category={category} />
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p
//                 className={clsx(
//                   "text-muted-foreground text-center py-10 text-lg font-medium text-gradient-primary",
//                   "animate-reveal-text delay-300"
//                 )}
//                 aria-live="polite"
//               >
//                 No categories found
//               </p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Particle Background */}
//       <div className="particle-wave absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="particle" style={{ left: "10%", top: "20%", animationDuration: "4s" }}></div>
//         <div className="particle" style={{ left: "30%", top: "50%", animationDuration: "5s" }}></div>
//         <div className="particle" style={{ left: "70%", top: "30%", animationDuration: "3s" }}></div>
//         <div className="particle" style={{ left: "50%", top: "80%", animationDuration: "6s" }}></div>
//       </div>

//       {/* JavaScript for Particle Animation */}
//       <script
//         dangerouslySetInnerHTML={{
//           __html: `
//             function createParticle() {
//               const particle = document.createElement("div");
//               particle.className = "particle";
//               particle.style.left = \`\${Math.random() * 100}%\`;
//               particle.style.top = \`\${Math.random() * 100}%\`;
//               particle.style.animationDuration = \`\${Math.random() * 3 + 3}s\`;
//               const wave = document.querySelector(".particle-wave");
//               if (wave) {
//                 wave.appendChild(particle);
//                 setTimeout(() => particle.remove(), 6000);
//               }
//             }
//             setInterval(createParticle, 2000);
//           `,
//         }}
//       />
//     </main>
//   );
// }

import Form from "./_components/Form";
import CategoryItem from "./_components/CategoryItem";
import { getCategories } from "@/app/server/db/categories";

async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main>
      <section className="section-gap">
        <div className="container bg-black bg-center items-center justify-center mx-auto rounded-lg shadow-md">
          <div className="sm:max-w-[625px] mx-auto space-y-6">
            <Form />
            {categories.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category}  />
                ))}
              </ul>
            ) : (
              <p className="text-accent text-center py-10">
                No categories found
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CategoriesPage;