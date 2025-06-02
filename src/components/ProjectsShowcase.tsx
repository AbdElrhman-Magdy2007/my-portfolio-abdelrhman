// 'use client'

// import React, { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ExternalLink, Github, Search } from 'lucide-react';
// import { useLanguage } from './LanguageProvider';
// import { Input } from '@/components/ui/input';
// import projectsData from '../data/projects.json';

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   tags: string[];
//   link: string;
//   demoUrl?: string;
//   githubUrl?: string;
//   featured: boolean;
//   category: string;
// }

// interface ProjectsData {
//   projects: Project[];
// }

// const ProjectsShowcase = () => {
//   useLanguage();
//   const [selectedCategory, setSelectedCategory] = useState<string>('All');
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

//   // Enhanced categories with icons
//   const categories = useMemo(() => [
//     { name: 'All', icon: '🌐' },
//     { name: 'Web', icon: '💻' },
//     { name: 'Mobile', icon: '📱' },
//     { name: 'AI', icon: '🤖' },
//     { name: 'Blockchain', icon: '🔗' },
//     ...Array.from(new Set((projectsData as ProjectsData).projects.map(project => project.category)))
//       .filter(category => !['Web', 'Mobile', 'AI', 'Blockchain'].includes(category))
//       .map(category => ({ name: category, icon: '📂' }))
//   ], []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     let projects = (projectsData as ProjectsData).projects;
    
//     // Filter by category
//     if (selectedCategory !== 'All') {
//       projects = projects.filter(project => project.category === selectedCategory);
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const lowercaseQuery = searchQuery.toLowerCase();
//       projects = projects.filter(project => 
//         project.title.toLowerCase().includes(lowercaseQuery) ||
//         project.description.toLowerCase().includes(lowercaseQuery) ||
//         project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
//       );
//     }

//     setFilteredProjects(projects);
//   }, [selectedCategory, searchQuery]);

//   // Enhanced animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { 
//         type: 'spring',
//         stiffness: 120,
//         damping: 20
//       }
//     }
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 150,
//         damping: 15,
//         duration: 0.8
//       }
//     },
//     hover: { 
//       y: -15,
//       scale: 1.02,
//       boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.3)",
//       transition: { 
//         duration: 0.3, 
//         ease: "easeOut" 
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800">
//         <motion.div 
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="h-12 w-12 border-t-4 border-primary rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <section className="py-24 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
//       <div className="container px-6 mx-auto">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.1 }}
//           variants={containerVariants}
//         >
//           <motion.div variants={itemVariants} className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 bg-clip-text">
//               Project Showcase
//             </h2>
//             <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
//               Discover my curated collection of innovative projects, demonstrating expertise across various technologies and creative solutions.
//             </p>
//             <motion.div 
//               className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto mt-8"
//               initial={{ width: 0 }}
//               animate={{ width: 128 }}
//               transition={{ duration: 0.8 }}
//             />
//           </motion.div>

//           {/* Search and Category Filter */}
//           <motion.div variants={itemVariants} className="mb-12">
//             <div className="relative max-w-md mx-auto mb-8">
//               <Input
//                 type="text"
//                 placeholder="Search projects..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-3 w-full bg-white/5 border-white/10 focus:border-primary rounded-lg text-white"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             </div>
//             <div className="flex flex-wrap justify-center gap-3">
//               {categories.map((category) => (
//                 <motion.button
//                   key={`category-${category.name}`}
//                   onClick={() => setSelectedCategory(category.name)}
//                   className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
//                     selectedCategory === category.name
//                       ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
//                       : 'bg-white/5 hover:bg-white/10 text-gray-300'
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <span>{category.icon}</span>
//                   <span>{category.name}</span>
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>

//           {/* Projects Grid */}
//           <motion.div 
//             variants={containerVariants} 
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//           >
//             <AnimatePresence mode="wait">
//               {filteredProjects.map((project) => (
//                 <motion.div
//                   key={`project-${project.id}`}
//                   variants={cardVariants}
//                   whileHover="hover"
//                   className="group glass-card overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 rounded-xl"
//                 >
//                   <Card className="border-0 bg-transparent h-full">
//                     <div className="relative overflow-hidden">
//                       <div className="aspect-video w-full bg-gray-800 overflow-hidden">
//                         <img 
//                           src={project.image} 
//                           alt={project.title} 
//                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
//                         />
//                       </div>
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
//                         <div className="p-4 w-full flex justify-between items-center">
//                           <div className="flex gap-3">
//                             {project.demoUrl && (
//                               <motion.a 
//                                 href={project.demoUrl} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="p-3 rounded-full bg-primary/80 hover:bg-primary transition-colors"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <ExternalLink className="h-5 w-5 text-white" />
//                               </motion.a>
//                             )}
//                             {project.githubUrl && (
//                               <motion.a 
//                                 href={project.githubUrl} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="p-3 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
//                                 whileHover={{ scale: 1.2 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <Github className="h-5 w-5 text-white" />
//                               </motion.a>
//                             )}
//                           </div>
//                           {project.featured && (
//                             <Badge className="bg-yellow-400 text-black">Featured</Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <CardContent className="p-6">
//                       <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
//                       <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
//                       <div className="flex flex-wrap gap-2">
//                         {project.tags.map((tag) => (
//                           <Badge 
//                             key={`${project.id}-tag-${tag}`} 
//                             variant="secondary" 
//                             className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
//                           >
//                             {tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Enhanced Background elements */}
//       <motion.div 
//         className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-20"
//         animate={{ 
//           scale: [1, 1.2, 1],
//           opacity: [0.2, 0.3, 0.2]
//         }}
//         transition={{ duration: 5, repeat: Infinity }}
//       />
//       <motion.div 
//         className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-20"
//         animate={{ 
//           scale: [1, 1.3, 1],
//           opacity: [0.2, 0.3, 0.2]
//         }}
//         transition={{ duration: 7, repeat: Infinity }}
//       />
//     </section>
//   );
// };

// export default ProjectsShowcase;