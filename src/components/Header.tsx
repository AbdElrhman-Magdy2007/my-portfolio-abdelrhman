'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { User } from 'lucide-react';
import Logo from './header/Logo';
import NavLinks from './header/NavLinks';
import AuthSection from './header/AuthSection';
// import ThemeToggle from './header/ThemeToggle';
import MobileMenu from './header/MobileMenu';
import MobileMenuButton from './header/MobileMenuButton';
import { useAuth } from './header/useAuth';

/**
 * Header component renders a fully responsive, animated navigation bar optimized for all screen sizes.
 * Tablets (up to 1024px) use the mobile layout, with accessibility and smooth animations.
 * @returns {JSX.Element} Responsive header with navigation and authentication controls
 */
const Header: React.FC = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn: isAuthenticated, user, logout } = useAuth();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const navItems = useMemo(
    () => [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/#about' },
      { name: 'Services', href: '/#services' },
      { name: 'Projects', href: '/projects' },
      { name: 'Contact', href: '/#contact' },
      {
        name: 'Profile',
        href: '/profile',
        icon: <User className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />,
      },
    ],
    [],
  );

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'py-2 backdrop-blur-xl bg-gradient-to-r from-background/90 to-background/70 shadow-lg'
          : 'py-4 bg-transparent',
      )}
      role="banner"
      aria-label="Main Navigation"
    >
      <div className="container max-w-screen-xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div variants={childVariants}>
          <Logo  />
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          variants={childVariants}
          className="hidden lg:flex items-center space-x-4 lg:space-x-6"
          aria-label="Desktop Navigation"
        >
          <NavLinks navItems={navItems} />
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* <motion.div variants={childVariants}>
              <ThemeToggle />
            </motion.div> */}
            <motion.div variants={childVariants}>
              <AuthSection
                isAuthenticated={isAuthenticated}
                user={user}
                logout={logout}
                className="bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/15 transition-all duration-300 rounded-lg shadow-sm hover:shadow-glow px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm"
              />
            </motion.div>
          </div>
        </motion.nav>

        {/* Mobile Controls */}
        <motion.div
          variants={childVariants}
          className="lg:hidden flex items-center space-x-1 sm:space-x-2"
        >
          {/* <ThemeToggle isMobile /> */}
          <MobileMenuButton
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
           
          />
        </motion.div>

        {/* Mobile Menu */}
        <MobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          navItems={navItems}
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
        />
      </div>
    </motion.header>
  );
});

Header.displayName = 'Header';

export default Header;
