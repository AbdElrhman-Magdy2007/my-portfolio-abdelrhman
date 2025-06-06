'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ParticleBackground: React.FC = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 4,
    duration: Math.random() * 6 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.3 + 0.3,
  }));

  const particleVariants = {
    animate: (i: number) => ({
      x: [particles[i].x, particles[i].x + (Math.random() * 60 - 30), particles[i].x],
      y: [particles[i].y, particles[i].y + (Math.random() * 60 - 30), particles[i].y],
      opacity: [0, particles[i].opacity, 0],
      scale: [0, 1.2, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: particles[i].duration,
        delay: particles[i].delay,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.5, 1],
      },
    }),
    pulse: {
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle animate-glow"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'linear-gradient(135deg, hsl(215 91% 70% / 0.5), hsl(271 81% 75% / 0.5))',
          }}
          variants={particleVariants}
          animate={['animate', 'pulse']}
          custom={particle.id}
        />
      ))}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent, hsl(215 91% 70% / 0.2), transparent)',
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          x: [-30, 30, -30],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default ParticleBackground; 