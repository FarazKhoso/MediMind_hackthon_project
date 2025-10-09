'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

export type Language = 'en' | 'ur-PK';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  const setLanguageHandler = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };
  
  const contextValue = useMemo(() => ({
    language,
    setLanguage: setLanguageHandler,
  }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
