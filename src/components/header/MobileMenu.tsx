'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, User, LogIn, UserPlus, LogOut, Loader } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../LanguageProvider';
import NavLinks from './NavLinks';
import LanguageSelector from './LanguageSelector';

interface User {
  name: string;
  email: string;
  image?: string;
}

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  navItems: { name: string; href: string; icon?: React.ReactNode }[];
  isAuthenticated: boolean;
  user: { name?: string; email?: string } | null;
  logout: () => void;
}

/**
 * MobileMenu component renders a responsive, animated navigation menu optimized for phones and tablets (up to 1024px).
 * Features large text, oversized buttons, glowing effects, and robust accessibility with LTR support.
 * @param {MobileMenuProps} props - Component props
 * @returns {JSX.Element | null} Animated mobile menu or null if not open
 */
const MobileMenu: React.FC<MobileMenuProps> = React.memo(
  ({ isMobileMenuOpen, toggleMobileMenu, navItems }) => {
    useLanguage();
    const { data: session, status } = useSession();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);

    // Handle click outside to close menu
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          toggleMobileMenu();
        }
      },
      [toggleMobileMenu],
    );

    // Handle Escape key to close menu
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isMobileMenuOpen) {
          toggleMobileMenu();
        }
      },
      [isMobileMenuOpen, toggleMobileMenu],
    );

    // Handle navigation with menu close
    const handleNavigation = useCallback(
      (href: string) => {
        router.push(href);
        toggleMobileMenu();
      },
      [router, toggleMobileMenu],
    );

    // Handle sign out with menu close
    const handleSignOut = useCallback(() => {
      signOut({ callbackUrl: '/' });
      toggleMobileMenu();
    }, [toggleMobileMenu]);

    // Manage event listeners and focus
    useEffect(() => {
      if (isMobileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        firstFocusableRef.current?.focus();
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isMobileMenuOpen, handleClickOutside, handleKeyDown]);

    // Debug navItems
    useEffect(() => {
      console.log('MobileMenu navItems:', navItems);
    }, [navItems]);

    // Animation variants for LTR
    const menuVariants = {
      hidden: { x: '100%', opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300, // Slightly softer for tablets
          damping: 35,
          duration: 0.4, // Faster for better UX
          when: 'beforeChildren',
          staggerChildren: 0.06,
        },
      },
      exit: {
        x: '100%',
        opacity: 0,
        transition: { type: 'spring', stiffness: 300, damping: 35, duration: 0.4 },
      },
    };

    // Child animation variants
    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    };

    // Memoized button styles
    const buttonStyles = useMemo(
      () =>
        clsx(
          'w-full py-4 px-8 sm:py-5 sm:px-10 md:py-6 md:px-12 rounded-2xl text-lg sm:text-xl md:text-2xl font-medium font-poppins flex items-center justify-center',
          'text-gray-800 dark:text-gray-100',
          'bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-700 dark:to-blue-800',
          'hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-900 hover:shadow-glow',
          'active:from-blue-600 active:to-blue-700 dark:active:from-blue-900 dark:active:to-blue-950',
          'transition-all duration-300 transform hover:scale-105',
          'focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2',
        ),
      [],
    );

    return (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            className={clsx(
              'lg:hidden fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-background/95 to-background/85 backdrop-blur-2xl',
              'p-6 sm:p-8 md:p-10',
              'shadow-2xl z-[60]',
            )}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label={('mobileNavigation')}
            aria-describedby="mobile-menu-desc"
            id="mobile-menu"
            tabIndex={0}
          >
            <span id="mobile-menu-desc" className="sr-only">
              {('mobileMenuDescription')}
            </span>
            <div className="container flex flex-col items-center space-y-8 sm:space-y-10 md:space-y-12">
              {/* Close Button */}
              <motion.div
                className="w-full flex justify-end"
                variants={itemVariants}
              >
                <Button
                  ref={firstFocusableRef}
                  onClick={toggleMobileMenu}
                  variant="ghost"
                  size="icon"
                  className="p-10 sm:p-10 md:p-10 rounded-full bg-background/50 hover:bg-background/80"
                  aria-label={('closeMenu')}
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-200 dark:text-gray-100" />
                </Button>
              </motion.div>

              {/* Navigation Links */}
              <motion.nav
                className="flex flex-col space-y-6 sm:space-y-8 md:space-y-10 items-center w-full"
                variants={itemVariants}
              >
                <NavLinks
                  navItems={navItems}
                  isMobile={true}
                  toggleMobileMenu={toggleMobileMenu}
                />
                <LanguageSelector />
              </motion.nav>

              {/* Authentication Section */}
              {status === 'loading' ? (
                <motion.div
                  className="flex justify-center py-4 sm:py-5 md:py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-spin text-blue-400 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{('loadingAuthStatus')}</span>
                </motion.div>
              ) : session?.user ? (
                <motion.div
                  className="space-y-6 sm:space-y-8 md:space-y-10 text-center w-full"
                  variants={itemVariants}
                >
                  <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8">
                    {session.user.image ? (
                      <motion.img
                        src={session.user.image}
                        alt={`${session.user.name || 'User'}'s profile picture`}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-blue-400 dark:border-blue-500 shadow-glow"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      />
                    ) : (
                      <motion.div
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-700 dark:to-blue-800 text-gray-100 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        {session.user.name?.charAt(0) || 'U'}
                      </motion.div>
                    )}
                    <p className="font-medium text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 font-poppins">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-inter">
                      {session.user.email}
                    </p>
                  </div>
                  <motion.button
                    onClick={handleSignOut}
                    className={clsx(
                      buttonStyles,
                      'bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500',
                      'hover:from-amber-500 hover:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 hover:shadow-glow',
                      'active:from-amber-600 active:to-orange-600 dark:active:from-amber-700 dark:active:to-orange-700',
                    )}
                    variants={itemVariants}
                    aria-label={('signOutFromAccount')}
                    tabIndex={0}
                  >
                    <LogOut className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-3 sm:mr-4" />
                    {('signOut')}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-6 sm:space-y-8 md:space-y-10 text-center w-full"
                  variants={itemVariants}
                >
                  <motion.button
                    onClick={() => handleNavigation('/auth/signin')}
                    className={buttonStyles}
                    variants={itemVariants}
                    aria-label={('signInToAccount')}
                    tabIndex={0}
                  >
                    <LogIn className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-3 sm:mr-4" />
                    {('signIn')}
                  </motion.button>
                  <motion.button
                    onClick={() => handleNavigation('/auth/signup')}
                    className={buttonStyles}
                    variants={itemVariants}
                    aria-label={('registerNewAccount')}
                    tabIndex={0}
                  >
                    <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-3 sm:mr-4" />
                    {('signUp')}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

// Custom Tailwind shadow for glowing effect
const tailwindConfig = `
  .shadow-glow {
    box-shadow: 0 6px 16px rgba(var(--primary), 0.2), 0 0 20px rgba(var(--primary), 0.15);
  }
`;

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;