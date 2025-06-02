import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "../LanguageProvider";

interface LanguageSelectorProps {
  isMobile?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isMobile = false,
}) => {
  const { language, setLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);

  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={toggleLanguageMenu}
          className="flex items-center space-x-2 text-base font-medium hover:text-primary transition-colors w-full"
        >
          <Globe size={18} />
          <span>
            {language === "en"
              ? "English"
              : language === "ar"
              ? "العربية"
              : language === "fr"
              ? "Français"
              : "Español"}
          </span>
        </button>

        {isLanguageMenuOpen && (
          <div className="mt-2 bg-card border border-border rounded-md overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`block w-full text-left px-4 py-2 hover:bg-accent ${
                  language === lang.code ? "text-primary" : ""
                }`}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsLanguageMenuOpen(false);
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div className="relative" variants={itemVariants}>
      {/* <motion.button 
        onClick={toggleLanguageMenu}
        className="p-2 rounded-full hover:bg-accent/50 transition-colors"
        aria-label="Change language"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe size={18} />
      </motion.button>
      
      {isLanguageMenuOpen && (
        <motion.div 
          className="dropdown-menu"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {languages.map((lang) => (
            <div 
              key={lang.code}
              className={`dropdown-item ${language === lang.code ? 'text-primary' : ''}`}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsLanguageMenuOpen(false);
              }}
              role="button"
            >
              {lang.name}
            </div>
          ))}
        </motion.div>
      )} */}
    </motion.div>
  );
};

export default LanguageSelector;
