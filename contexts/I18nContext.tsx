
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useUser } from './UserContext';

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [language, setLanguageState] = useState<Language>('en');

  // Sync with user profile
  useEffect(() => {
    if (user?.language) {
      setLanguageState(user.language);
    } else {
      // Try to detect browser lang
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'ro', 'ru', 'el', 'sr'].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // User profile update is handled by UserContext usually, 
    // but this local state ensures immediate UI update
  };

  const t = (key: string): string => {
    const dict = translations[language];
    const fallbackDict = translations['en'];
    
    if (!dict) {
      console.warn(`Missing dictionary for language: ${language}`);
      return key;
    }

    const value = dict[key];
    if (value) return value;

    // Fallback to EN
    const fallbackValue = fallbackDict[key];
    if (fallbackValue) {
      // console.warn(`Missing translation for key: ${key} in ${language}. Using fallback.`);
      return fallbackValue;
    }

    console.warn(`Missing translation for key: ${key} in ALL languages.`);
    return key;
  };

  return (
    <I18nContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
