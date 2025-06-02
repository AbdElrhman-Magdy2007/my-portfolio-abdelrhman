"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import projectsData from "../data/projects.json";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

interface ProjectsData {
  projects: Project[];
}

const Projects = () => {
  const router = useRouter();
  useLanguage();
  const featuredProjects = (projectsData as ProjectsData).projects.filter(
    (project: Project) => project.featured
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.7,
      },
    },
    hover: {
      // y: -10,
      scale: 1.03,
      // boxShadow: "0 20px 40px -10px rgba(45, 212, 191, 0.3)", // Teal-400 shadow
      // transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.1,
      // boxShadow: "0 0 15px rgba(45, 212, 191, 0.4)", // Teal-400 shadow
      // transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  // Particle trail for button hover
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [particles, setParticles] = React.useState<
    { id: number; x: number; y: number }[]
  >([]);
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });

      // Add a new particle
      const newParticle = {
        id: Date.now(),
        x,
        y,
      };

      setParticles((prev) => [...prev, newParticle]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 800);
    }
  };

  return (
    <section
      id="projects"
      className="py-20 relative overflow-hidden  from-gray-950 via-gray-900 to-teal-950"
    >
      <div className="container px-4 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {
                "A showcase of my best work, demonstrating my expertise in building modern web applications."
              }
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto mt-6 rounded-full" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover="hover"
                className="glass-card overflow-hidden rounded-xl border border-teal-500/30 hover:border-teal-400/50 bg-gray-900/10 backdrop-blur-xl transition-all duration-500"
                role="article"
                aria-labelledby={`project-title-${project.id}`}
              >
                <Card className="border-0 bg-transparent h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] w-full bg-gray-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                        loading="lazy"
                      />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3
                      id={`project-title-${project.id}`}
                      className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent"
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gradient-to-r from-coral-400 to-pink-400 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md border border-coral-300/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-auto">
                      {project.demoUrl && (
                        <motion.a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 text-white hover:from-teal-500 hover:to-teal-700 transition-all duration-300 border border-teal-400/30 backdrop-blur-md"
                          aria-label={`View live demo for ${project.title}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </motion.a>
                      )}
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variants={buttonVariants}
                          whileHover={{
                            scale: 1.1,
                            boxShadow: "0 0 15px rgba(251, 113, 133, 0.4)", // Coral-400 shadow
                            transition: { duration: 0.3 },
                          }}
                          whileTap="tap"
                          className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-coral-400 to-coral-600 text-white hover:from-coral-500 hover:to-coral-700 transition-all duration-300 border border-coral-400/30 backdrop-blur-md"
                          aria-label={`View GitHub repository for ${project.title}`}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </motion.a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              ref={buttonRef}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseMove={handleMouseMove}
              className="inline-block relative"
            >
              <Link href="/projects">
                <Button
                  variant="outline"
                  className="relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-teal-400/20 to-blue-400/20 hover:from-teal-400/30 hover:to-blue-400/30 border border-teal-400/50 backdrop-blur-md text-white shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  {"View All Projects"}
                  <span className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                    {[...Array(10)].map((_, i) => (
                      <span
                        key={i}
                        className="particle absolute w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-coral-400"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          ["--x" as string]: `${Math.random() * 100 - 50}px`,
                          ["--y" as string]: `${Math.random() * 100 - 50}px`,
                          animationDelay: `${i * 0.06}s`,
                          animationDuration: `${0.7 + Math.random() * 0.5}s`,
                        }}
                      />
                    ))}
                  </span>
                </Button>
              </Link>
              {particles.map((particle) => (
                <motion.span
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-coral-400"
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                    x: particle.x,
                    y: particle.y,
                  }}
                  animate={{
                    opacity: 0,
                    scale: 0,
                    x: particle.x + (Math.random() * 60 - 30),
                    y: particle.y + (Math.random() * 60 - 30),
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-40 h-40 bg-teal-400/10 rounded-full filter blur-3xl opacity-30" />
      <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-coral-400/10 rounded-full filter blur-3xl opacity-30" />
    </section>
  );
};

export default Projects;
