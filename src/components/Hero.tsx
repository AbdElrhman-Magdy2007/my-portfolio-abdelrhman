"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
    hover: {
      scale: 1.15,
      // boxShadow: "0 0 15px rgba(99, 102, 241, 0.6)",
      // transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.8,
      },
    },
    hover: {
      y: -12,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const tiltSettings = {
    rotate: [0, 5, 0, -5, 0],
    transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
  };

  const [sparkles, setSparkles] = React.useState<
    { id: number; x: number; y: number }[]
  >([]);

  const addSparkle = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * 40 - 20,
      y: y + Math.random() * 40 - 20,
    }));

    setSparkles((prev) => [...prev, ...newSparkles]);

    setTimeout(() => {
      setSparkles((prev) =>
        prev.filter((sparkle) => !newSparkles.some((ns) => ns.id === sparkle.id))
      );
    }, 600);
  };

  // Hardcoded user data for the avatar (replace with actual user data if available)
  const user = {
    name: "Abdelrahman Magdy",
    image: "/images/avatar.jpg", // Replace with actual image path or URL
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Image */}
          <motion.div
            className="lg:w-2/5 w-full order-1 lg:order-2 mt-10 lg:mt-0 flex justify-center lg:justify-end"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              variants={imageVariants}
              whileHover="hover"
              animate={["visible", "float"]}
              onClick={addSparkle}
            >
              <motion.div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 bg-gradient-to-r from-primary to-secondary p-1"
                animate={tiltSettings}
                style={{ perspective: 1000 }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    className="w-full h-full rounded-full object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-700 text-gray-800 dark:text-gray-100 flex items-center justify-center text-4xl font-bold">
                    {user.name?.charAt(0) || "A"}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/40 rounded-full backdrop-blur-md"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
              ></motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/40 rounded-full backdrop-blur-md"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              ></motion.div>

              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ scale: 0, opacity: 1, x: sparkle.x, y: sparkle.y }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="lg:w-3/5 w-full order-2 lg:order-1 text-center lg:text-left"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6 inline-block">
              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                👋 Welcome, I'm
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 leading-tight text-4xl md:text-5xl font-bold"
            >
              Abdelrahman Magdy
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="mb-6 text-2xl md:text-3xl font-medium leading-relaxed"
            >
              Building <span className="highlight">modern</span>,{" "}
              <span className="highlight">scalable</span>, and{" "}
              <span className="highlight">responsive</span> web applications
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              Transform Your Ideas into Digital Masterpieces with React, Next.js,
              and TypeScript!
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center"
            >
            

             <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href="/projects">
                <Button
                  variant="outline"
                  className="btn-secondary group relative overflow-hidden rounded-full px-8 py-4 text-xl font-bold border-2 border-primary/70 hover:border-primary bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-500 shadow-lg hover:shadow-2xl"
                >
                  View All Projects
                  <span className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                    {[...Array(10)].map((_, i) => (
                      <span
                        key={i}
                        className="particle absolute w-3 h-3 rounded-full bg-gradient-to-r from-primary via-purple-500 to-secondary"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          ['--x' as string]: `${Math.random() * 100 - 50}px`,
                          ['--y' as string]: `${Math.random() * 100 - 50}px`,
                          animationDelay: `${i * 0.06}s`,
                          animationDuration: `${0.7 + Math.random() * 0.5}s`,
                        }}
                      />
                    ))}
                    {/* <ArrowDown
                      className="ml-4 group-hover:-translate-y-1 group-hover:rotate-45 transition-transform duration-400"
                      size={24}
                    /> */}
                  </span>
                </Button>
              </Link>
            </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;