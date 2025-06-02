
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, ShoppingCart, LayoutDashboard, Rocket, Globe, Languages } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: 'Custom Web Development',
      description: 'Build tailored, high-performance web apps using React, Next.js, and TypeScript to elevate your brand.'
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: 'E-Commerce Solutions',
      description: 'Create scalable online stores with Stripe payments, real-time analytics, and seamless UX.'
    },
    {
      icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
      title: 'UI/UX Design',
      description: 'Design pixel-perfect, user-centric interfaces with Tailwind CSS and Figma for maximum engagement.'
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: 'Performance Optimization',
      description: 'Boost your site\'s speed with Lazy Loading, Next/Image, and advanced caching for 95+ Lighthouse scores.'
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Multi-Language Support',
      description: 'Deliver global-ready apps with Arabic/English support and RTL compatibility.'
    },
    {
      icon: <Languages className="h-10 w-10 text-primary" />,
      title: 'Complex Integrations',
      description: 'Seamlessly integrate APIs (e.g., Stripe ) for advanced functionality and features.'
    }
  ];

  const problems = [
    {
      title: 'Slow Websites',
      description: 'Transform sluggish sites into lightning-fast experiences with optimized code and assets.'
    },
    {
      title: 'Poor User Experience',
      description: 'Craft intuitive, engaging interfaces that keep users coming back and increasing conversions.'
    },
    {
      title: 'Scalability Issues',
      description: 'Build robust, future-proof apps that grow with your business and handle increased traffic.'
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
    <section id="services" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-accent/5 to-background/0 z-0"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Services & Solutions</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Transforming ideas into exceptional digital experiences with cutting-edge technologies and innovative solutions.
            </p>
            <div className="h-1 w-24 bg-secondary mx-auto mt-6"></div>
          </motion.div>

          {/* Services Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="glass-card h-full"
              >
                <Card className="border-0 bg-transparent h-full">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Problems I Solve Section */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Problems I Solve</h3>
            <div className="h-1 w-16 bg-secondary mx-auto"></div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="glass-card p-6"
              >
                <h4 className="text-xl font-bold mb-3 text-primary">{problem.title}</h4>
                <p className="text-gray-300">{problem.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
