'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext, useTransition } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Search, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getProductsByCategory } from '../server/db/products';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Define data types
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techs: string[];
  addons: string[];
  link: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  category: string;
  projectType: 'Full-Stack' | 'Front-End' | 'Back-End';
  productTechs?: { name: string }[];
  productAddons?: { name: string }[];
  createdAt: string;
  updatedAt: string;
}

const LOG_PREFIX = '[Projects]';
const ENABLE_DETAILED_LOGGING = true;
const DEFAULT_IMAGE = 'https://via.placeholder.com/600x400?text=Project+Image';
const POLLING_INTERVAL = 3600000; // 1 hour
const MIN_FETCH_INTERVAL = 10000; // Minimum 10s between fetches

// Utility function for consistent logging
const logProduct = (projects: Project[], action: 'added' | 'updated' | 'removed', count: number) => {
  console.groupCollapsed(`${LOG_PREFIX} [${action.toUpperCase()}] ${count} project(s)`);
  if (ENABLE_DETAILED_LOGGING) {
    projects.forEach(project => {
      console.log({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        projectType: project.projectType,
        image: project.image,
        techs: project.techs,
        addons: project.addons,
        demoUrl: project.demoUrl || 'N/A',
        githubUrl: project.githubUrl || 'N/A',
        featured: project.featured,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        timestamp: new Date().toISOString(),
      });
    });
  }
  console.log(`${LOG_PREFIX} Summary: ${count} project(s) ${action}`);
  console.groupEnd();
};

interface CategoryWithProducts {
  name: string;
  icon: string;
  projects?: Project[];
}

// Context for state management
interface ProjectsContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 100, scale: 0.9, rotateX: 20 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 150, damping: 20, duration: 0.7 },
  },
  exit: {
    opacity: 0,
    y: 100,
    scale: 0.9,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
  hover: {
    y: -15,
    scale: 1.05,
    boxShadow: '0 20px 40px -10px rgba(45, 212, 191, 0.5)', // Teal-400 shadow
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  new: {
    opacity: [0, 1],
    scale: [0.9, 1.05, 1],
    transition: { duration: 0.8, times: [0, 0.7, 1], ease: 'easeInOut' },
  },
};

const addonVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, type: 'spring', stiffness: 180, damping: 15 },
  }),
  hover: {
    scale: 1.15,
    boxShadow: '0 0 12px rgba(251, 113, 133, 0.5)', // Coral-400 shadow
    transition: { duration: 0.3 },
  },
};

const buttonVariants: Variants = {
  hover: {
    scale: 1.08,
    boxShadow: '0 0 20px rgba(45, 212, 191, 0.4)', // Teal-400 shadow for Live Demo
    transition: { duration: 0.3 },
  },
  valid: {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
};

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const isRecent = new Date(project.createdAt).getTime() > Date.now() - 5 * 60 * 1000;
  const isValidDemoUrl = project.demoUrl && !project.demoUrl.includes('/admin/') && project.demoUrl !== 'http://localhost:3000/admin/menu-items/new';
  const isValidGithubUrl = project.githubUrl && !project.githubUrl.includes('/admin/');
  const imageSrc = project.image && project.image !== '/placeholder-image.png' ? project.image : DEFAULT_IMAGE;

  return (
    <motion.div
      variants={cardVariants}
      initial={isRecent ? 'new' : 'hidden'}
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="group glass-card overflow-hidden rounded-xl border border-teal-500/30 hover:border-teal-400/50 bg-gray-900/10 backdrop-blur-xl shadow-lg transition-all duration-500"
      role="article"
      aria-labelledby={`project-title-${project.id}`}
    >
      <Card className="border-0 bg-transparent h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] w-full bg-gray-950">
            <img
              src={imageSrc}
              alt={project.title || 'Project image'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              loading={project.featured ? 'eager' : 'lazy'}
              fetchPriority={project.featured ? 'high' : 'auto'}
            />
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="p-6 w-full flex justify-between items-center">
              {project.featured && (
                <Badge className="bg-gradient-to-r from-amber-300 to-yellow-400 text-gray-900 font-medium px-3 py-1">
                  Featured
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <h3
            id={`project-title-${project.id}`}
            className="text-xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent"
          >
            {project.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
            {project.description}
          </p>
          {/* Technologies and Addons */}
          <div className="flex flex-col gap-3 mb-4">
            {project.techs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.techs.map((tech) => (
                  <Badge
                    key={`${project.id}-tech-${tech}`}
                    variant="secondary"
                    className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            {project.addons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.addons.map((addon, index) => (
                  <motion.div
                    key={`${project.id}-addon-${addon}`}
                    custom={index}
                    variants={addonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-coral-400 to-pink-400 text-white hover:from-coral-500 hover:to-pink-500 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md border border-coral-300/30"
                    >
                      {addon}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {/* Links */}
          <div className="mt-auto flex flex-col sm:flex-row gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href={project.demoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={buttonVariants}
                    whileHover="hover"
                    animate={isValidDemoUrl ? 'valid' : undefined}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 text-white hover:from-teal-500 hover:to-teal-700 transition-all duration-300 border border-teal-400/30 backdrop-blur-md ${
                      !isValidDemoUrl ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label={`Demo button for ${project.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Demo</span>
                    {!isValidDemoUrl && <AlertCircle className="h-4 w-4 text-amber-300" />}
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isValidDemoUrl ? 'Visit the live site' : 'Demo link under development'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href={project.githubUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={buttonVariants}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: '0 0 20px rgba(251, 113, 133, 0.4)', // Coral-400 shadow for GitHub
                      transition: { duration: 0.3 },
                    }}
                    animate={isValidGithubUrl ? 'valid' : undefined}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-coral-400 to-coral-600 text-white hover:from-coral-500 hover:to-coral-700 transition-all duration-300 border border-coral-400/30 backdrop-blur-md ${
                      !isValidGithubUrl ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label={`GitHub button for ${project.title}`}
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                    {!isValidGithubUrl && <AlertCircle className="h-4 w-4 text-amber-300" />}
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isValidGithubUrl ? 'View source code on GitHub' : 'GitHub link under development'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Category Button Component
const CategoryButton: React.FC<{
  category: CategoryWithProducts;
  isSelected: boolean;
  onSelect: (name: string) => void;
  index: number;
  total: number;
}> = ({ category, isSelected, onSelect, index, total }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(category.name);
    } else if (e.key === 'ArrowRight' && index < total - 1) {
      (document.querySelectorAll('button.category-button')[index + 1] as HTMLButtonElement)?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      (document.querySelectorAll('button.category-button')[index - 1] as HTMLButtonElement)?.focus();
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={() => onSelect(category.name)}
      onKeyDown={handleKeyDown}
      className={`category-button px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-400/50 shadow-md ${
        isSelected
          ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white'
          : 'bg-gray-800/20 hover:bg-gray-800/40 text-gray-300'
      }`}
      whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(45, 212, 191, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      whileFocus={{ scale: 1.05 }}
      aria-pressed={isSelected}
      aria-label={`Filter projects by ${category.name}`}
    >
      <span className="text-lg">{category.icon}</span>
      <span>{category.name}</span>
    </motion.button>
  );
};

// Loading Skeleton Component
const ProjectCardSkeleton: React.FC = () => (
  <div className="glass-card overflow-hidden rounded-xl border border-teal-500/30 bg-gray-900/10 backdrop-blur-xl shadow-lg">
    <Skeleton className="aspect-[4/3] w-full bg-gray-800/50" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 bg-gray-800/50 mb-2" />
      <Skeleton className="h-4 w-full bg-gray-800/50 mb-4" />
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16 bg-teal-500/30 rounded-full" />
          <Skeleton className="h-4 w-16 bg-teal-500/30 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16 bg-coral-400/30 rounded-full" />
          <Skeleton className="h-4 w-16 bg-coral-400/30 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-8 flex-1 bg-teal-500/30 rounded-full" />
        <Skeleton className="h-8 flex-1 bg-coral-400/30 rounded-full" />
      </div>
    </div>
  </div>
);

// Main ProjectsShowcase Component
const ProjectsShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousProjectsRef = useRef<Project[]>([]);
  const isPollingActive = useRef(true);
  const lastFetchTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // Preserve scroll position
  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  const restoreScrollPosition = () => {
    window.scrollTo({ top: scrollPositionRef.current, behavior: 'smooth' });
  };

  // Compare projects to avoid unnecessary updates
  const areProjectsEqual = (newProjects: Project[], oldProjects: Project[]): boolean => {
    if (newProjects.length !== oldProjects.length) return false;
    return newProjects.every((newProj, i) => {
      const oldProj = oldProjects[i];
      return (
        newProj.id === oldProj.id &&
        newProj.title === oldProj.title &&
        newProj.description === oldProj.description &&
        newProj.image === oldProj.image &&
        newProj.projectType === oldProj.projectType &&
        JSON.stringify(newProj.techs) === JSON.stringify(oldProj.techs) &&
        JSON.stringify(newProj.addons) === JSON.stringify(oldProj.addons) &&
        newProj.demoUrl === oldProj.demoUrl &&
        newProj.githubUrl === oldProj.githubUrl &&
        newProj.category === oldProj.category
      );
    });
  };

  // Debounced state update
  const updateProjectsData = useMemo(
    () =>
      debounce((newCategories: CategoryWithProducts[], newProjects: Project[]) => {
        startTransition(() => {
          if (!areProjectsEqual(newProjects, projectsData)) {
            setCategories(newCategories);
            setProjectsData(newProjects);
            previousProjectsRef.current = newProjects;
            setError(null);
            restoreScrollPosition();
          }
        });
      }, 500),
    [projectsData]
  );

  // Fetch categories and projects
  const fetchCategories = useCallback(
    async (retryCount = 2) => {
      const now = Date.now();
      if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
        console.log(`${LOG_PREFIX} Skipping fetch: too soon since last fetch`);
        return;
      }

      const requestId = uuidv4();
      abortControllerRef.current = new AbortController();

      try {
        saveScrollPosition();
        console.log(`${LOG_PREFIX} [${requestId}] Fetching categories`);
        const result = await getProductsByCategory();
        if (!Array.isArray(result)) {
          throw new Error('Invalid response from server');
        }
        const mappedCategories = [
          { name: 'All', icon: '🌐', projects: [] },
          ...result.map(category => ({
            ...category,
            name: category.name,
            icon: '🗂️',
            projects: category.products?.map(project => ({
              id: project.id,
              title: project.name,
              description: project.description,
              image: project.image,
              techs: project.ProductTech?.map(tech => tech.name) || [],
              addons: project.ProductAddon?.map(addon => addon.name) || [],
              link: project.liveDemoLink || '',
              demoUrl: project.liveDemoLink,
              githubUrl: project.gitHubLink,
              featured: false,
              category: category.name,
              projectType: 'Full-Stack' as const,
              productTechs: project.ProductTech,
              productAddons: project.ProductAddon,
              createdAt: project.createdAt.toISOString(),
              updatedAt: project.updatedAt.toISOString(),
            })),
          })),
        ];
        const newProjects = mappedCategories.flatMap(category => category.projects || []);

        // Detect changes
        const previousIds = new Set(previousProjectsRef.current.map(p => p.id));
        const newIds = new Set(newProjects.map(p => p.id));
        const addedProjects = newProjects.filter(p => !previousIds.has(p.id));
        const removedProjects = previousProjectsRef.current.filter(p => !newIds.has(p.id));

        // Log changes
        if (addedProjects.length > 0) {
          logProduct(addedProjects, 'added', addedProjects.length);
          toast({
            title: 'New Projects Added',
            description: `${addedProjects.length} new project(s) added.`,
            duration: 3000,
            className: 'bg-gradient-to-r from-teal-400 to-blue-500 text-white',
          });
        }
        if (removedProjects.length > 0) {
          logProduct(removedProjects, 'removed', removedProjects.length);
          toast({
            title: 'Projects Removed',
            description: `${removedProjects.length} project(s) removed.`,
            duration: 3000,
            className: 'bg-gradient-to-r from-teal-400 to-blue-500 text-white',
          });
        }

        updateProjectsData(mappedCategories, newProjects);
        lastFetchTimeRef.current = now;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log(`${LOG_PREFIX} [${requestId}] Fetch aborted`);
          return;
        }
        console.error(`${LOG_PREFIX} [${requestId}] Error fetching categories:`, {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        if (retryCount > 0) {
          console.log(`${LOG_PREFIX} [${requestId}] Retrying... (${retryCount} attempts left)`);
          setTimeout(() => fetchCategories(retryCount - 1), 5000);
        } else {
          setError('Failed to load projects. Showing cached data.');
          toast({
            title: 'Loading Error',
            description: 'Failed to load projects. Showing cached data.',
            variant: 'destructive',
            duration: 5000,
            className: 'bg-red-500 text-white',
          });
          updateProjectsData(categories, projectsData);
        }
      } finally {
        if (retryCount === 0 || !error) {
          setIsLoading(false);
        }
      }
    },
    [updateProjectsData, projectsData, categories, error]
  );

  // Polling with visibility awareness
  useEffect(() => {
    fetchCategories();
    const interval = setInterval(() => {
      if (isPollingActive.current) {
        fetchCategories();
      }
    }, POLLING_INTERVAL);

    const handleVisibilityChange = () => {
      isPollingActive.current = !document.hidden;
      if (isPollingActive.current) {
        fetchCategories();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      startTransition(() => setSearchQuery(query));
    }, 300),
    []
  );

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.focus();
    }
  };

  // Retry fetching data
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchCategories();
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    let projects = projectsData;
    if (selectedCategory !== 'All') {
      projects = projects.filter((project) => project.category === selectedCategory);
    }
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      projects = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(lowercaseQuery) ||
          project.description.toLowerCase().includes(lowercaseQuery) ||
          project.techs.some((tech) => tech.toLowerCase().includes(lowercaseQuery)) ||
          project.addons.some((addon) => addon.toLowerCase().includes(lowercaseQuery)) ||
          project.projectType.toLowerCase().includes(lowercaseQuery)
      );
    }
    return projects;
  }, [selectedCategory, searchQuery, projectsData]);
  // Keyboard navigation for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && searchInputRef.current && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="projects-grid w-full max-w-7xl px-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProjectsContext.Provider value={{ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }}>
      <section className="py-24 relative bg-gradient-to-br from-gray-950 via-gray-900 to-teal-950 overflow-hidden">
        {/* Animated Background Particles */}
        <div className="particle-wave">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="particle w-2 h-2 bg-teal-400/50 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [0, -1200],
                opacity: [0.2, 0.6, 0],
                scale: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 12 + 6,
                repeat: Infinity,
                ease: 'easeOut',
                delay: Math.random() * 6,
              }}
            />
          ))}
        </div>

        <div className="container px-6 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tight animate-reveal-text">
                Our Creative Projects
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed animate-reveal-text delay-200">
                Discover our portfolio of innovative web solutions, showcasing cutting-edge technology and creative design.
              </p>
              <motion.div
                className="h-1 w-48 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto mt-6 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 192 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Search and Category Filter */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="relative max-w-md mx-auto mb-8">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search projects by name, tech, or type (press /)"
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="search-input pl-12 pr-12 py-3 w-full bg-gray-800/20 border-teal-500/50 focus:border-teal-400 rounded-lg text-gray-300 placeholder-gray-400"
                  aria-label="Search projects"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category, index) => (
                  <CategoryButton
                    key={`${category.name}-${index}`}
                    category={category}
                    isSelected={selectedCategory === category.name}
                    onSelect={setSelectedCategory}
                    index={index}
                    total={categories.length}
                  />
                ))}
              </div>
            </motion.div>

            {/* Error State */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="text-center text-white py-12 bg-red-500/30 rounded-lg p 6mb-8">
                <p className="text-xl font-semibold">{error}</p>
                <p className="text-sm text-gray-300 mt-3">
                  Please try again or contact support.
                </p>
                <motion.button
                  onClick={handleRetry}
                  className="mt-6 flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-teal-500 hover:to-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Reload projects"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </motion.button>
              </motion.div>
            )}

            {/* Projects Grid */}
            <motion.div
              variants={containerVariants}
              className="projects-grid w-full max-w-7xl mx-auto"
            >
              <AnimatePresence mode="sync">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full text-center text-white py-12"
                    key="no-projects"
                  >
                    <p className="text-xl font-semibold">No projects found</p>
                    <p className="text-sm text-gray-300 mt-3">
                      Try another category or search term, or contact us to add new projects.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </ProjectsContext.Provider>
  );
};

export default ProjectsShowcase;