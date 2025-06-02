import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Framer Motion"]
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express", "Prisma", "PostgreSQL", "RESTful APIs"]
    },
    {
      title: "Tools & DevOps",
      skills: ["Git", "GitHub", "VS Code", "Vercel", "Netlify", "Docker"]
    },
    {
      title: "Design & Other",
      skills: ["Figma", "Responsive Design", "UI/UX", "Accessibility", "SEO", "Performance Optimization"]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Skills & Tools</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A comprehensive toolkit of modern technologies to build exceptional web experiences.
            </p>
            <div className="h-1 w-24 bg-secondary mx-auto mt-6"></div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 200 }
                }}
              >
                <Card className="glass-card overflow-hidden h-full">
                  <div className="p-1 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.skills.map((skill, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-secondary mr-2"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
