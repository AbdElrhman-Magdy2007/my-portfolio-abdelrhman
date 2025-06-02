
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import ProjectsShowcase from '@/components/ProjectsShowcase';

const Projects = () => {
  const {  language, dir } = useLanguage();
  const { theme } = useTheme();
  
  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Cursor trail effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  
  // Particle effect
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; id: number }[]>([]);
  
  useEffect(() => {
    document.title = `${('projects.title')} | Abdelrahman Magdy`;
    
    // Create initial particles
    const initialParticles = Array(20).fill(0).map((_, index) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 1 + 0.5,
      id: index
    }));
    
    setParticles(initialParticles);
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          // Reset particles that go off screen
          ...(particle.y < -10 ? { 
            y: window.innerHeight + 10,
            x: Math.random() * window.innerWidth
          } : {})
        }))
      );
      animationFrameId = requestAnimationFrame(animateParticles);
    };
    
    let animationFrameId = requestAnimationFrame(animateParticles);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add a new dot to the trail
      const newDot = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };
      
      setCursorTrail(prevTrail => [...prevTrail, newDot]);
      
      // Remove old dots after animation finishes
      setTimeout(() => {
        setCursorTrail(prevTrail => 
          prevTrail.filter(dot => dot.id !== newDot.id)
        );
      }, 1000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Create sparkle effect
  const createSparkle = (e: React.MouseEvent) => {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    const size = Math.random() * 10 + 5;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Position relative to the clicked element
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    sparkle.style.left = `${offsetX}px`;
    sparkle.style.top = `${offsetY}px`;
    
    e.currentTarget.appendChild(sparkle);
    
    // Remove sparkle after animation completes
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 800); // Match animation duration
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-50" 
        style={{ scaleX }}
      />
      
      {/* Particle effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.x,
              top: particle.y,
              opacity: 0.4
            }}
          />
        ))}
      </div>
      
      {/* Cursor trail effect */}
      {cursorTrail.map((dot) => (
        <motion.div
          key={dot.id}
          className="cursor-trail"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.4 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ 
            left: dot.x, 
            top: dot.y,
          }}
        />
      ))}
      
      {/* <Header /> */}
      
      {/* <main className="relative z-10">
        <ProjectsShowcase />
      </main> */}
      
      <Footer />
    </div>
  );
};

export default Projects;
