'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../components/LanguageProvider';
import { Button } from '@/components/ui/button';

const NotFound = () => {
   useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div>
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            {('title')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {('description')}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            {('backHome')}
          </Button>
          
          <button
            onClick={() => router.back()}
            className="text-sm text-primary hover:text-primary/80"
          >
            {('goBack')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
