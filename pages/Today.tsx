import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { getDayInfo, getQuoteOfDay, getPrayers } from '../services/dataService';
import { CalendarDay, Prayer, FastType } from '../types';
import { I18N } from '../constants';
import { Fish, Droplet, XCircle, CheckCircle, ChevronRight, Calendar as CalendarIcon, BookOpen, Grape, Milk } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';

export const Today: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dayInfo, setDayInfo] = useState<CalendarDay | null>(null);
  const [shortPrayer, setShortPrayer] = useState<Prayer | null>(null);
  const [quote, setQuote] = useState<string>('');
  
  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

  useEffect(() => {
    if (!user) return;
    
    getDayInfo(new Date(), user.language, user.countryTradition).then(setDayInfo);
    getPrayers(user.language, 'morning').then(prayers => {
      if (prayers.length > 0) setShortPrayer(prayers[Math.floor(Math.random() * prayers.length)]);
    });
    setQuote(getQuoteOfDay(user.language));
  }, [user]);

  if (!dayInfo) return <div className="p-8 text-center text-[#B08968] flex h-screen items-center justify-center font-serif text-lg">{t('loading')}</div>;

  const getFastIcon = (type: FastType) => {
    switch (type) {
      case 'fast_with_fish': 
        return <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"><Fish size={14} /> <span>{t('fish')}</span></div>;
      case 'fast_with_oil': 
        return <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"><Grape size={14} /> <span>{t('wine_oil')}</span></div>;
      case 'strict_fast': 
        return <div className="flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"><XCircle size={14} /> <span>{t('strict_fast')}</span></div>;
      case 'fast_without_oil':
        return <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"><Droplet size={14} /> <span>Fast (No Oil)</span></div>;
      case 'dairy': 
        return <div className="flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"><Milk size={14} /> <span>{t('dairy')}</span></div>;
      default: 
        return <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"><CheckCircle size={14} /> <span>{t('no_fast')}</span></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString(user?.language === 'ro' ? 'ro-RO' : (user?.language === 'ru' ? 'ru-RU' : (user?.language === 'el' ? 'el-GR' : (user?.language === 'sr' ? 'sr-Cyrl-RS' : 'en-US'))), options);
  };

  return (
    <div className="pb-32 pt-safe px-4 max-w-lg mx-auto space-y-6 bg-[#FAF5F0] min-h-screen">
      <header className="flex justify-between items-center pt-6 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2E2A27]">{t('tab_today')}</h1>
          <p className="text-[#6D645C] text-sm mt-1 first-letter:capitalize font-medium opacity-80">
            {formatDate(dayInfo.date)}
          </p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm">
          <OrthodoxLifeLogo size={32} />
        </div>
      </header>

      {/* Main Card: Feast & Fast */}
      <div 
        onClick={() => navigate(`/calendar/${dayInfo.date}`)}
        className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(176,137,104,0.1)] border border-[#DDB892]/20 relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
      >
        {/* Decorative background gradient */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 transition-transform duration-700
          ${dayInfo.importanceLevel === 'high_feast' ? 'bg-red-400' : 'bg-[#B08968]'}`}></div>
        
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
             {getFastIcon(dayInfo.fastType)}
             <CalendarIcon size={20} className="text-[#DDB892]" />
          </div>
          <h2 className={`font-serif text-[#2E2A27] font-bold leading-tight mb-3 ${dayInfo.feastName.length > 30 ? 'text-xl' : 'text-3xl'} ${dayInfo.importanceLevel === 'high_feast' ? 'text-red-800' : ''}`}>
            {dayInfo.feastName}
          </h2>
          <p className="text-[#6D645C] text-sm line-clamp-2 leading-relaxed">
            {dayInfo.descriptionShort}
          </p>
          <div className="mt-5 flex items-center text-[#B08968] text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
            <span>Details</span>
            <ChevronRight size={14} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Quote of the Day */}
      <div className="bg-[#2E2A27] text-[#FAF5F0] rounded-[24px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B08968] rounded-full blur-[60px] opacity-30 -mr-6 -mt-6"></div>
        <div className="relative z-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#DDB892] font-bold mb-4 opacity-80">
            {t('quote_of_day')}
          </h3>
          <blockquote className="font-serif text-xl italic leading-relaxed text-[#FAF5F0] opacity-90">
            {quote}
          </blockquote>
        </div>
      </div>

      {/* Prayer of the Day Suggestion */}
      {shortPrayer && (
        <Link to={`/prayers/${shortPrayer.id}`} className="block group">
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#DDB892]/20 flex items-center gap-5 group-active:scale-[0.99] transition-transform">
            <div className="bg-[#FAF5F0] text-[#B08968] p-4 rounded-full">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xs text-[#6D645C] font-bold uppercase tracking-wider mb-1">Prayer for today</h3>
              <p className="font-serif font-bold text-lg text-[#2E2A27] leading-tight">{shortPrayer.title}</p>
            </div>
            <div className="bg-[#FAF5F0] rounded-full p-2 text-[#B08968]">
               <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};