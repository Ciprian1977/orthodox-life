import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SUPPORTED_LANGUAGES, SUPPORTED_TRADITIONS, I18N } from '../constants';
import { Language, CountryTradition } from '../types';
import { Check, ChevronRight, Calendar, BookOpen, MessageCircle, Heart } from 'lucide-react';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';

export const Onboarding: React.FC = () => {
  const { setUser } = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedTradition, setSelectedTradition] = useState<CountryTradition>('USA');

  const t = (key: string) => I18N[key][selectedLang] || I18N[key]['en'];

  const handleFinish = () => {
    setUser({
      language: selectedLang,
      countryTradition: selectedTradition,
      hasOnboarded: true,
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
      <div className="min-h-screen bg-[#FAF5F0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#DDB892_0%,transparent_50%)] opacity-20 pointer-events-none"></div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="mb-10 p-6 bg-white rounded-full shadow-[0_10px_30px_rgba(176,137,104,0.15)]">
            <OrthodoxLifeLogo size={80} color="#B08968" />
          </div>

          <h1 className="text-4xl font-serif font-bold text-[#2E2A27] mb-3 text-center tracking-tight">
            Orthodox Life
          </h1>
          <p className="text-[#6D645C] text-center mb-8 font-serif italic text-lg max-w-xs leading-relaxed">
            Guidance. Prayer. Peace.
          </p>

          <p className="text-center text-[#2E2A27]/80 leading-relaxed mb-12 max-w-sm">
            Your daily companion for the Orthodox path. Discover the calendar, keep the fast, and find peace in prayer.
          </p>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#B08968] text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#B08968]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-[#9A7657]"
          >
            <span>Begin Journey</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 2: PREFERENCES ---
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#FAF5F0] flex flex-col p-6 items-center pt-safe animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="w-full max-w-md flex-1 flex flex-col">
          <div className="mb-8 mt-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-[#2E2A27] mb-2">{t('select_language')}</h2>
            <p className="text-[#6D645C]">Choose your preferred language & tradition.</p>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#B08968] uppercase tracking-widest ml-1">Language</label>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200
                    ${selectedLang === lang.code 
                      ? 'border-[#B08968] bg-white shadow-md text-[#2E2A27]' 
                      : 'border-transparent bg-white/50 text-[#6D645C] hover:bg-white'}`}
                >
                  <span className="text-lg font-medium">{lang.label}</span>
                  {selectedLang === lang.code && <div className="bg-[#B08968] text-white p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>}
                </button>
              ))}
            </div>

            {/* Tradition Selection */}
            <div className="space-y-3 pt-4 border-t border-[#DDB892]/20">
              <label className="text-xs font-bold text-[#B08968] uppercase tracking-widest ml-1">Tradition / Country</label>
              {SUPPORTED_TRADITIONS.map((trad) => (
                <button
                  key={trad.code}
                  onClick={() => setSelectedTradition(trad.code)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-200
                    ${selectedTradition === trad.code 
                      ? 'border-[#B08968] bg-white shadow-md text-[#2E2A27]' 
                      : 'border-transparent bg-white/50 text-[#6D645C] hover:bg-white'}`}
                >
                  <span className="text-lg font-medium">{trad.label}</span>
                  {selectedTradition === trad.code && <div className="bg-[#B08968] text-white p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="mt-4 w-full bg-[#2E2A27] text-white py-4 rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span>{t('continue')}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 3: FEATURES OVERVIEW ---
  return (
    <div className="min-h-screen bg-[#FAF5F0] flex flex-col p-6 items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full max-w-md flex flex-col h-full justify-center">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#2E2A27] mb-2">How Orthodox Life Helps</h2>
          <p className="text-[#6D645C]">Your spiritual toolbox.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <FeatureCard 
            icon={<Calendar className="text-[#B08968]" />} 
            title="Calendar & Fasts" 
            desc="Keep track of feasts and fasting rules daily."
          />
          <FeatureCard 
            icon={<BookOpen className="text-[#B08968]" />} 
            title="Prayers Library" 
            desc="Morning, evening, and special needs prayers."
          />
          <FeatureCard 
            icon={<Heart className="text-[#B08968]" />} 
            title="Practical Guide" 
            desc="Simple explanations for confession and life."
          />
           <FeatureCard 
            icon={<MessageCircle className="text-[#B08968]" />} 
            title="Ask AI" 
            desc="Respectful answers rooted in tradition."
          />
        </div>

        <button
          onClick={handleFinish}
          className="w-full bg-[#B08968] text-white py-4 rounded-2xl font-semibold shadow-xl shadow-[#B08968]/30 active:scale-[0.98] transition-transform"
        >
          {t('start_journey')}
        </button>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#DDB892]/20 flex items-center gap-4">
    <div className="bg-[#FAF5F0] p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <h3 className="font-serif font-bold text-[#2E2A27] text-lg">{title}</h3>
      <p className="text-xs text-[#6D645C] leading-snug">{desc}</p>
    </div>
  </div>
);
