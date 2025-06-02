'use client';

import React, { useCallback, useMemo } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useLanguage } from '../LanguageProvider';

// Define interfaces for type safety
interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavLinksProps {
  navItems: NavItem[];
  isMobile?: boolean;
  toggleMobileMenu?: () => void;
}

/**
 * NavLinks component renders a compact navigation links section with enhanced RTL support,
 * reduced spacing, advanced animations, dynamic gradients, and accessibility features.
 * Optimized for mobile and desktop with tighter layout.
 * @param {NavLinksProps} props - Component props
 * @returns {JSX.Element} Animated navigation links with active state, RTL support, and accessibility
 */
const NavLinks: React.FC<NavLinksProps> = React.memo(
  ({ navItems, isMobile = false, toggleMobileMenu }) => {
    const { dir }: { dir: 'ltr' | 'rtl' } = useLanguage();
    const pathname = usePathname();

    // Get current hash from window.location (for client-side hash links)
    const currentHash = typeof window !== 'undefined' ? window.location.hash : '';

    // Normalize path by removing trailing slashes and locale prefixes
    const normalizePath = useCallback((path: string) => {
      const [basePath, hash] = path.split('#');
      let normalized = basePath.replace(/^\/+|\/+$/g, '');
      const localeRegex = /^(ar|en)\//;
      normalized = normalized.replace(localeRegex, '');
      const cleanPath = normalized === '' ? '/' : `/${normalized}`;
      return hash ? `${cleanPath}#${hash}` : cleanPath;
    }, []);

    // Check if the link is active
    const isLinkActive = useCallback(
      (href: string) => {
        const normalizedHref = normalizePath(href);
        const normalizedPathname = normalizePath(pathname || '/');
        const [hrefPath, hrefHash] = normalizedHref.split('#');
        const [path, pathHash] = normalizedPathname.split('#');

        if (hrefPath === path) {
          if (hrefPath === '/') {
            if (hrefHash) {
              return hrefHash === currentHash.replace('#', '');
            }
            return !currentHash || currentHash === '#';
          }
          return !hrefHash || hrefHash === pathHash;
        }
        return path.startsWith(hrefPath + '/') && hrefPath !== '/';
      },
      [pathname, currentHash, normalizePath],
    );

    // Memoize active states to avoid recomputation
    const activeStates = useMemo(
      () => navItems.map((item) => isLinkActive(item.href)),
      [navItems, isLinkActive],
    );

    // Handle click to close mobile menu if applicable
    const handleClick = useCallback(() => {
      if (isMobile && toggleMobileMenu) {
        toggleMobileMenu();
      }
    }, [isMobile, toggleMobileMenu]);

    // Animation variants for links
    const linkVariants = {
      hidden: { opacity: 0, y: 8 }, // Reduced y for tighter layout
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: i * 0.04, // Faster delay for compact animation
          duration: 0.3,
          ease: 'easeOut',
        },
      }),
      hover: {
        scale: 1.08,
        transition: { duration: 0.2, ease: 'easeInOut' },
      },
    };

    // Common styles for links
    const baseLinkStyles = clsx(
      isMobile
        ? 'text-base sm:text-lg md:text-xl' // Match MobileMenu sizes
        : 'text-sm sm:text-base md:text-lg',
      'font-poppins font-medium',
      'transition-all duration-300 ease-in-out',
      isMobile
        ? 'block w-full text-center py-2 px-4 sm:py-3 sm:px-5 rounded-xl' // Reduced padding
        : 'inline-block rounded-lg px-1.5 py-1 sm:px-2 sm:py-1.5', // Reduced padding
      'focus:outline-none focus:ring-4 focus:ring-primary/40 focus:ring-offset-1',
        'tracking-tight text-right' // 'text-left',
    );

    return (
      <nav
        className={clsx(
          'flex',
          isMobile
            ? 'flex-col space-y-4 sm:space-y-5 md:space-y-6 items-center' // Reduced vertical spacing
            : 'items-center space-x-2 sm:space-x-3 md:space-x-4', // Reduced horizontal spacing
           'space-x-reverse' // RTL'',
        )}
        role="navigation"
        aria-label={('navigationLinks')}
        dir={dir}
      >
        {navItems.length > 0 ? (
          navItems.map((item, index) => {
            const isActive = activeStates[index];

            return (
              <motion.div
                key={item.name}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={linkVariants}
                className={clsx('relative', item.href === '/profile' && 'group-hover:shadow-glow')}
              >
                <NextLink
                  href={item.href}
                  onClick={handleClick}
                  className={clsx(
                    baseLinkStyles,
                    isActive
                      ? 'text-primary bg-gradient-to-r from-primary/20 to-primary/10 shadow-glow'
                      : 'text-foreground/80 hover:text-primary hover:bg-primary/10',
                    // dir === 'rtl' && isActive
                    //   ? 'bg-gradient-to-l'
                    //   : 'bg-gradient-to-r',
                    'group flex items-center justify-center',
                    item.href === '/profile' && 'hover:bg-blue-500/15 hover:text-blue-500',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name} page`}
                  tabIndex={0}
                >
                  {/* {item.icon && (
                    <span
                      className={clsx(
                        'inline-block transform transition-transform duration-200 group-hover:scale-110',
                        dir === 'rtl' ? 'ml-1.5 sm:ml-2' : 'mr-1.5 sm:mr-2', // Reduced icon spacing
                        isMobile ? 'text-lg sm:text-xl' : 'text-base sm:text-lg',
                      )}
                    >
                      {item.icon}
                    </span>
                  )} */}
                  <span className="relative z-10">{item.name}</span>
                  <motion.span
                    className={clsx(
                      'absolute bottom-0 w-full h-0.4 bg-gradient-to-r', // Thinner underline
                     'right-0 bg-gradient-to-l' // 'left-0 bg-gradient-to-r',
                      // isActive
                      //   ? item.href === '/profile'
                      //     ? 'from-blue-500 to-blue-500/60'
                      //     : 'from-primary to-primary/60'
                      //   : 'from-primary to-primary/60',
                      // isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                    )}
                    // initial={{ scaleX: dir === 'rtl' ? -1 : 1 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </NextLink>
              </motion.div>
            );
          })
        ) : (
          <p className="text-sm sm:text-base text-muted-foreground">{('noNavItems')}</p>
        )}
      </nav>
    );
  },
);

// Custom Tailwind shadow for glowing effect
const tailwindConfig = `
  .shadow-glow {
    box-shadow: 0 4px 12px rgba(var(--primary), 0.15), 0 0 16px rgba(var(--primary), 0.1);
  }
`;

NavLinks.displayName = 'NavLinks';

export default NavLinks;