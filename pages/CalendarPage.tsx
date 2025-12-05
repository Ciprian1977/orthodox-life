
import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useI18n } from '../contexts/I18nContext';
import { getCalendarMonth, getDayInfo } from '../services/dataService';
import { CalendarDay } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, BookOpen, User } from 'lucide-react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

const CalendarGrid: React.FC = () => {
  const { user } = useUser();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth(), user?.countryTradition || 'RO')
      .then(d => {
        setDays(d);
        setLoading(false);
      });
  }, [currentDate, user]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const getMonthName = (date: Date) => {
    const localeMap = { ro: 'ro-RO', en: 'en-US', ru: 'ru-RU', el: 'el-GR', sr: 'sr-Cyrl-RS' };
    const locale = localeMap[user?.language || 'en'];
    return date.toLocaleString(locale, { month: 'long', year: 'numeric' });
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);
  const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const dateList = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="pb-32 pt-safe px-4 max-w-lg mx-auto fade-enter">
      <h1 className="text-3xl font-serif font-bold text-text mb-6 mt-6">{t('tab.calendar')}</h1>
      
      <div className="bg-card rounded-[24px] shadow-soft border border-border p-5 transition-colors duration-300">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeMonth(-1)} className="p-2 text-text-muted hover:text-primary hover:bg-bg rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <span className="font-serif font-bold text-xl text-text capitalize w-48 text-center">{getMonthName(currentDate)}</span>
          <button onClick={() => changeMonth(1)} className="p-2 text-text-muted hover:text-primary hover:bg-bg rounded-full transition-colors"><ChevronRight size={24} /></button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, idx) => (
            <div key={d} className={`text-[11px] font-bold uppercase py-2 tracking-wider ${idx === 0 || idx === 6 ? 'text-primary' : 'text-text-muted/60'}`}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {emptyDays.map(i => <div key={`empty-${i}`} className="aspect-square"></div>)}
          
          {dateList.map(dateNum => {
             const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(dateNum).padStart(2,'0')}`;
             const dayData = days.find(d => d.date === dateStr);
             const isFast = dayData?.isFastDay;
             const isFeast = dayData?.importanceLevel === 'high_feast';
             const isToday = new Date().toISOString().split('T')[0] === dateStr;

             // Logic for Fasting Color Dot
             let fastColor = null;
             if (dayData?.fastType === 'strict_fast') fastColor = 'bg-text'; 
             else if (dayData?.fastType === 'fast_without_oil') fastColor = 'bg-text-muted'; 
             else if (dayData?.fastType === 'fast_with_oil') fastColor = 'bg-purple-500'; 
             else if (dayData?.fastType === 'fast_with_fish') fastColor = 'bg-blue-500'; 
             else if (dayData?.fastType === 'dairy') fastColor = 'bg-yellow-400';

             return (
              <div key={dateNum} className="aspect-square relative flex flex-col items-center justify-center group">
                <button 
                  onClick={() => navigate(`/calendar/${dateStr}`)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all font-serif
                    ${isToday ? 'bg-primary text-white shadow-lg scale-110 z-10' : 'text-text hover:bg-bg'}
                    ${isFeast && !isToday ? 'text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20' : ''}
                  `}
                >
                  {dateNum}
                </button>
                {/* Fasting Dot */}
                {isFast && fastColor && !isToday && (
                  <div className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${fastColor}`}></div>
                )}
                {/* Dot for today if fast */}
                {isFast && fastColor && isToday && (
                   <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-3 text-xs text-text-muted bg-card border border-border p-5 rounded-2xl">
        <h4 className="font-bold uppercase tracking-widest text-primary mb-2">{t('calendar.legend')}</h4>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div> <span>{t('calendar.legend.major')}</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-text"></div> <span>{t('calendar.legend.strict')}</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span>{t('calendar.legend.fish')}</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500"></div> <span>{t('calendar.legend.oil')}</span></div>
      </div>
    </div>
  );
};

const DayDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useI18n();
  const [day, setDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    if(date) {
      getDayInfo(new Date(date), user?.language || 'en', user?.countryTradition || 'RO').then(setDay);
    }
  }, [date, user]);

  if (!day) return <div className="h-screen flex items-center justify-center text-primary">{t('today.loading')}</div>;

  const getFastLabel = (d: CalendarDay) => {
    if (!d.isFastDay) return t('today.fast.none');
    if (d.fastType === 'fast_with_fish') return t('today.fast.fish');
    if (d.fastType === 'fast_with_oil') return t('today.fast.oil');
    if (d.fastType === 'strict_fast') return t('today.fast.strict');
    if (d.fastType === 'fast_without_oil') return t('today.fast.no_oil');
    if (d.fastType === 'dairy') return t('today.fast.dairy');
    return t('today.fast.generic');
  }

  return (
    <div className="fixed inset-0 z-[60] bg-bg overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
      <div className="max-w-lg mx-auto min-h-screen relative pb-10">
        <div className="sticky top-0 bg-bg/90 backdrop-blur border-b border-border px-4 py-4 flex items-center justify-between z-10 pt-safe">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-muted hover:bg-card rounded-full"><ChevronLeft size={24} /></button>
          <span className="font-semibold text-text font-serif text-lg">{new Date(day.date).toLocaleDateString()}</span>
          <div className="w-8"></div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
            ${day.isFastDay ? 'bg-text text-bg' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
            <CalIcon size={14} />
            {getFastLabel(day)}
          </div>

          <div>
            <h1 className={`text-4xl font-serif font-bold text-text mb-4 leading-tight ${day.importanceLevel === 'high_feast' ? 'text-red-700 dark:text-red-400' : ''}`}>
              {day.feastName}
            </h1>
            <p className="text-lg text-text-muted leading-relaxed font-serif">{day.descriptionShort}</p>
          </div>

          {/* Saints List */}
          <div className="bg-card p-6 rounded-[24px] border border-border shadow-soft">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} /> {t('calendar.saints')}
            </h3>
            <ul className="space-y-3">
              {day.saints.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                  <span className="text-text font-medium font-serif text-lg">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Readings */}
          {day.readings && day.readings.length > 0 && (
            <div className="bg-card p-6 rounded-[24px] border border-border shadow-soft">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen size={16} /> {t('calendar.readings')}
              </h3>
              <ul className="space-y-3">
                {day.readings.map((r, i) => (
                  <li key={i} className="text-text font-serif italic border-l-2 border-accent pl-4 py-1">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CalendarGrid />} />
      <Route path="/:date" element={<DayDetail />} />
    </Routes>
  );
};
