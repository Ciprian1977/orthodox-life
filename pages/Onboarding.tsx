
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useI18n } from '../contexts/I18nContext';
import { SUPPORTED_LANGUAGES, SUPPORTED_TRADITIONS } from '../constants';
import { Language, CountryTradition } from '../types';
import { Check, ChevronRight, Calendar, BookOpen, MessageCircle, Heart } from 'lucide-react';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';

export const Onboarding: React.FC = () => {
  const { setUser, updateLanguage } = useUser();
  const { t, setLanguage } = useI18n();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedTradition, setSelectedTradition] = useState<CountryTradition>('USA');

  const handleLangChange = (code: Language) => {
    setSelectedLang(code);
    setLanguage(code); // Update UI immediately
  }

  const handleFinish = () => {
    setUser({
      language: selectedLang,
      countryTradition: selectedTradition,
      hasOnboarded: true,
      theme: 'system',
      favoritePrayerIds: [],
      favoriteAudioIds: [],
      settings: {
        notificationsEnabled: true,
        notifyFast: true,
        notifyFeast: true,
        notifyTime: "08:00"
      }
    });
  };

  // --- STEP 1: WELCOME ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden fade-enter">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--primary)_0%,transparent_50%)] opacity-20 pointer-events-none"></div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="mb-10 p-6 bg-card rounded-full shadow-[0_10px_30px_rgba(176,137,104,0.15)]">
            <OrthodoxLifeLogo size={80} className="text-primary" />
          </div>

          <h1 className="text-4xl font-serif font-bold text-text mb-3 text-center tracking-tight">
            {t('app.name')}
          </h1>
          <p className="text-text-muted text-center mb-8 font-serif italic text-lg max-w-xs leading-relaxed">
            {t('app.tagline')}
          </p>

          <p className="text-center text-text opacity-80 leading-relaxed mb-12 max-w-sm">
            {t('onboarding.welcome.desc')}
          </p>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-primary text-bg py-4 rounded-2xl font-semibold shadow-lg shadow-primary/20 active-press transition-all flex items-center justify-center gap-2 hover:opacity-90"
          >
            <span>{t('btn.start')}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 2: PREFERENCES ---
  if (step === 2) {
    return (
      <div className="min-h-screen bg-bg flex flex-col p-6 items-center pt-safe animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="w-full max-w-md flex-1 flex flex-col">
          <div className="mb-8 mt-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-text mb-2">{t('onboarding.select_lang')}</h2>
            <p className="text-text-muted">{t('onboarding.select_tradition')}</p>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">{t('settings.language')}</label>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200
                    ${selectedLang === lang.code 
                      ? 'border-primary bg-card shadow-md text-text' 
                      : 'border-transparent bg-card/50 text-text-muted hover:bg-card'}`}
                >
                  <span className="text-lg font-medium">{lang.label}</span>
                  {selectedLang === lang.code && <div className="bg-primary text-bg p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>}
                </button>
              ))}
            </div>

            {/* Tradition Selection */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">{t('settings.tradition')}</label>
              {SUPPORTED_TRADITIONS.map((trad) => (
                <button
                  key={trad.code}
                  onClick={() => setSelectedTradition(trad.code)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200
                    ${selectedTradition === trad.code 
                      ? 'border-primary bg-card shadow-md text-text' 
                      : 'border-transparent bg-card/50 text-text-muted hover:bg-card'}`}
                >
                  <span className="text-lg font-medium">{trad.label}</span>
                  {selectedTradition === trad.code && <div className="bg-primary text-bg p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="mt-4 w-full bg-text text-bg py-4 rounded-2xl font-semibold shadow-lg active-press transition-transform flex items-center justify-center gap-2"
          >
            <span>{t('btn.continue')}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 3: FEATURES OVERVIEW ---
  return (
    <div className="min-h-screen bg-bg flex flex-col p-6 items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full max-w-md flex flex-col h-full justify-center">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-text mb-2">{t('onboarding.features.title')}</h2>
          <p className="text-text-muted">{t('onboarding.features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <FeatureCard 
            icon={<Calendar className="text-primary" />} 
            title={t('onboarding.feat.calendar.title')}
            desc={t('onboarding.feat.calendar.desc')}
          />
          <FeatureCard 
            icon={<BookOpen className="text-primary" />} 
            title={t('onboarding.feat.prayers.title')} 
            desc={t('onboarding.feat.prayers.desc')}
          />
          <FeatureCard 
            icon={<Heart className="text-primary" />} 
            title={t('onboarding.feat.guide.title')} 
            desc={t('onboarding.feat.guide.desc')}
          />
           <FeatureCard 
            icon={<MessageCircle className="text-primary" />} 
            title={t('onboarding.feat.ai.title')} 
            desc={t('onboarding.feat.ai.desc')}
          />
        </div>

        <button
          onClick={handleFinish}
          className="w-full bg-primary text-bg py-4 rounded-2xl font-semibold shadow-xl shadow-primary/30 active-press transition-transform"
        >
          {t('btn.start')}
        </button>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
    <div className="bg-bg p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <h3 className="font-serif font-bold text-text text-lg">{title}</h3>
      <p className="text-xs text-text-muted leading-snug">{desc}</p>
    </div>
  </div>
);
