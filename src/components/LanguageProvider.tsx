import React, { type ReactNode } from 'react';

interface LanguageContextType {
  language: 'en';
  setLanguage: (lang: 'en') => void;
  dir: 'ltr';
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  dir: 'ltr',
});

export const useLanguage = () => React.useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageContext.Provider
      value={{
        language: 'en',
        setLanguage: () => {},
        dir: 'ltr',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
