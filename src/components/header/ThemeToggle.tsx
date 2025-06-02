// import React from 'react';
// import { motion } from 'framer-motion';
// import { Sun, Moon } from 'lucide-react';
// import { useTheme } from '../ThemeProvider';
// import clsx from 'clsx';

// // Define interfaces for type safety
// interface ThemeToggleProps {
//   isMobile?: boolean;
//   className?: string;
// }

// /**
//  * ThemeToggle component renders a compact button for switching between light and dark modes
//  * with smooth animations and accessibility features
//  * @param {ThemeToggleProps} props - Component props
//  * @returns {JSX.Element} Animated theme toggle button
//  */
// const ThemeToggle: React.FC<ThemeToggleProps> = ({ isMobile = false, className }) => {
//   const { theme, toggleTheme } = useTheme();

//   // Animation variants for the button
//   const itemVariants = {
//     hidden: { opacity: 0, y: -15 }, // Reduced y offset for compact animation
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.3, ease: 'easeOut' },
//     },
//   };

//   return (
//     <motion.button
//       onClick={toggleTheme}
//       className={clsx(
//         'p-1.5 rounded-full hover:bg-accent/50 transition-colors', // Reduced padding
//         'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1',
//         className,
//       )}
//       aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//       variants={isMobile ? undefined : itemVariants}
//       whileHover={{ scale: 1.1, rotate: 10 }} // Reduced rotation
//       whileTap={{ scale: 0.95 }}
//     >
//       {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} {/* Reduced icon size */}
//     </motion.button>
//   );
// };

// export default ThemeToggle;