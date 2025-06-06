'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import Header from '@/components/Header';
import { buttonVariants } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import Link from 'next/link';
import Form from './_components/Form';
import ParticleBackground from './_components/ParticleBackground';

// Fallback component in case Form fails to load
const FallbackForm: React.FC = () => (
  <div className="text-center text-red-500 dark:text-red-400 p-4">
    Error: Form component failed to load. Please check the Form component implementation.
  </div>
);

export default function SignInPage() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 80,
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut', type: 'spring', stiffness: 90 },
    },
  };

  const createSparkle = (x: number, y: number) => {
    if (!isMounted) return;
    const id = Date.now();
    setSparkles((prev) => [...prev, { id, x: x + Math.random() * 8 - 4, y: y + Math.random() * 8 - 4 }]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 600);
  };

  if (!isMounted) {
    return (
      <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden dark">
        <div className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 glass-card border-gradient z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-8 text-center text-blue-400">
            Sign In
          </h2>
          <div className="min-h-[200px]">
            <Form />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden dark">
      <ParticleBackground />
      {/* <Header /> */}
      <motion.div
        className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 glass-card border-gradient hover:scale-105 transition-transform duration-300 animate-glow z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="region"
        aria-labelledby="signin-title"
        dir="ltr"
      >
        <motion.h2
          id="signin-title"
          className="text-3xl sm:text-4xl font-heading font-bold mb-8 text-center text-blue-400 animate-typewriter"
          variants={childVariants}
        >
          Sign In
        </motion.h2>
        <motion.div variants={childVariants} className="min-h-[200px]">
          {Form ? <Form /> : <FallbackForm />}
        </motion.div>
        <motion.p
          className="text-center text-slate-300 text-sm sm:text-base mt-8"
          variants={childVariants}
        >
          Don't have an account?{' '}
          <span className="sparkle-container relative inline-block">
            <Link
              href={`/${Routes.AUTH}/${Pages.Register}`}
              className={`${buttonVariants({
                variant: 'link',
                size: 'sm',
              })} !text-purple-400 hover:underline animate-reveal-text delay-200 relative group`}
              onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
              onClick={(e) => createSparkle(e.clientX, e.clientY)}
            >
              <span className="relative z-10">Create an Account</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 opacity-0 group-hover:opacity-50 transition-opacity duration-600 rounded-full" />
            </Link>
          </span>
        </motion.p>
      </motion.div>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="sparkle absolute rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: 8,
            height: 8,
            background: 'linear-gradient(135deg, hsl(215 91% 70% / 0.8), hsl(271 81% 75% / 0.8))',
          }}
          initial={{ scale: 0, opacity: 1, rotate: 0 }}
          animate={{ scale: 1, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </main>
  );
}