
import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { getDayInfo, getQuoteOfDay, getPrayers } from '../services/dataService';
import { CalendarDay, Prayer, FastType } from '../types';
import { Fish, Droplet, XCircle, CheckCircle, ChevronRight, Calendar as CalendarIcon, BookOpen, Grape, Milk } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';
import { RO_TEXT } from '../ro-text';

export const Today: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dayInfo, setDayInfo] = useState<CalendarDay | null>(null);
  const [shortPrayer, setShortPrayer] = useState<Prayer | null>(null);
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    
    getDayInfo(new Date(), user.countryTradition).then(setDayInfo);
    getPrayers('morning').then(prayers => {
      if (prayers.length > 0) setShortPrayer(prayers[Math.floor(Math.random() * prayers.length)]);
    });
    setQuote(getQuoteOfDay());
  }, [user]);

  if (!dayInfo) return <div className="p-8 text-center text-primary flex h-screen items-center justify-center font-serif text-lg animate-pulse">{RO_TEXT.today.loading}</div>;

  const getFastIcon = (type: FastType) => {
    const baseClass = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider";
    switch (type) {
      case 'fast_with_fish': 
        return <div className={`${baseClass} text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300`}><Fish size={14} /> <span>{RO_TEXT.today.fast.fish}</span></div>;
      case 'fast_with_oil': 
        return <div className={`${baseClass} text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300`}><Grape size={14} /> <span>{RO_TEXT.today.fast.oil}</span></div>;
      case 'strict_fast': 
        return <div className={`${baseClass} text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300`}><XCircle size={14} /> <span>{RO_TEXT.today.fast.strict}</span></div>;
      case 'fast_without_oil':
        return <div className={`${baseClass} text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300`}><Droplet size={14} /> <span>{RO_TEXT.today.fast.no_oil}</span></div>;
      case 'dairy': 
        return <div className={`${baseClass} text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300`}><Milk size={14} /> <span>{RO_TEXT.today.fast.dairy}</span></div>;
      default: 
        return <div className={`${baseClass} text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300`}><CheckCircle size={14} /> <span>{RO_TEXT.today.fast.none}</span></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('ro-RO', options);
  };

  return (
    <div className="pb-32 pt-safe px-4 max-w-lg mx-auto space-y-6 fade-enter">
      <header className="flex justify-between items-center pt-6 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text">{RO_TEXT.tab.today}</h1>
          <p className="text-text-muted text-sm mt-1 first-letter:capitalize font-medium opacity-80">
            {formatDate(dayInfo.date)}
          </p>
        </div>
        <div className="bg-card p-2 rounded-full shadow-sm">
          <OrthodoxLifeLogo size={32} className="text-primary" />
        </div>
      </header>

      {/* Main Card: Feast & Fast */}
      <div 
        onClick={() => navigate(`/calendar/${dayInfo.date}`)}
        className="bg-card rounded-[24px] p-6 shadow-soft border border-border relative overflow-hidden active-press cursor-pointer group"
      >
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 transition-transform duration-700
          ${dayInfo.importanceLevel === 'high_feast' ? 'bg-red-500' : 'bg-primary'}`}></div>
        
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
             {getFastIcon(dayInfo.fastType)}
             <CalendarIcon size={20} className="text-accent" />
          </div>
          <h2 className={`font-serif text-text font-bold leading-tight mb-3 ${dayInfo.feastName.length > 30 ? 'text-xl' : 'text-3xl'} ${dayInfo.importanceLevel === 'high_feast' ? 'text-red-700 dark:text-red-400' : ''}`}>
            {dayInfo.feastName}
          </h2>
          <p className="text-text-muted text-sm line-clamp-2 leading-relaxed">
            {dayInfo.descriptionShort}
          </p>
          <div className="mt-5 flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
            <span>Details</span>
            <ChevronRight size={14} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Quote of the Day */}
      <div className="bg-[#2E2A27] dark:bg-card text-[#FAF5F0] dark:text-text rounded-[24px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[60px] opacity-30 -mr-6 -mt-6"></div>
        <div className="relative z-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-4 opacity-80">
            {RO_TEXT.today.quote}
          </h3>
          <blockquote className="font-serif text-xl italic leading-relaxed opacity-90">
            {quote}
          </blockquote>
        </div>
      </div>

      {/* Prayer of the Day Suggestion */}
      {shortPrayer && (
        <Link to={`/prayers/${shortPrayer.id}`} className="block group">
          <div className="bg-card rounded-[20px] p-5 shadow-soft border border-border flex items-center gap-5 active-press transition-transform">
            <div className="bg-bg text-primary p-4 rounded-full">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">{RO_TEXT.today.prayer_suggestion}</h3>
              <p className="font-serif font-bold text-lg text-text leading-tight">{shortPrayer.title}</p>
            </div>
            <div className="bg-bg rounded-full p-2 text-primary">
               <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};
