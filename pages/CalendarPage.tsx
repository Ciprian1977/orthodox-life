import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { I18N } from '../constants';
import { getCalendarMonth, getDayInfo } from '../services/dataService';
import { CalendarDay } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, BookOpen, User } from 'lucide-react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

const CalendarGrid: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

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
    return date.toLocaleString(lang === 'ro' ? 'ro-RO' : (lang === 'ru' ? 'ru-RU' : 'en-US'), { month: 'long', year: 'numeric' });
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);
  const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const dateList = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="pb-32 pt-safe px-4 max-w-lg mx-auto bg-[#FAF5F0] min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-[#2E2A27] mb-6 mt-6">{t('tab_calendar')}</h1>
      
      <div className="bg-white rounded-[24px] shadow-sm border border-[#DDB892]/20 p-5">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeMonth(-1)} className="p-2 text-[#6D645C] hover:text-[#B08968] hover:bg-[#FAF5F0] rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <span className="font-serif font-bold text-xl text-[#2E2A27] capitalize w-48 text-center">{getMonthName(currentDate)}</span>
          <button onClick={() => changeMonth(1)} className="p-2 text-[#6D645C] hover:text-[#B08968] hover:bg-[#FAF5F0] rounded-full transition-colors"><ChevronRight size={24} /></button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, idx) => (
            <div key={d} className={`text-[11px] font-bold uppercase py-2 tracking-wider ${idx === 0 || idx === 6 ? 'text-[#B08968]' : 'text-[#6D645C]/60'}`}>{d}</div>
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
             if (dayData?.fastType === 'strict_fast') fastColor = 'bg-[#2E2A27]'; 
             else if (dayData?.fastType === 'fast_without_oil') fastColor = 'bg-[#6D645C]'; 
             else if (dayData?.fastType === 'fast_with_oil') fastColor = 'bg-purple-500'; 
             else if (dayData?.fastType === 'fast_with_fish') fastColor = 'bg-blue-500'; 
             else if (dayData?.fastType === 'dairy') fastColor = 'bg-yellow-400';

             return (
              <div key={dateNum} className="aspect-square relative flex flex-col items-center justify-center">
                <button 
                  onClick={() => navigate(`/calendar/${dateStr}`)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all font-serif
                    ${isToday ? 'bg-[#B08968] text-white shadow-lg scale-110 z-10' : 'text-[#2E2A27] hover:bg-[#FAF5F0]'}
                    ${isFeast && !isToday ? 'text-red-700 font-bold bg-red-50' : ''}
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

      <div className="mt-6 space-y-3 text-xs text-[#6D645C] bg-white border border-[#DDB892]/20 p-5 rounded-2xl">
        <h4 className="font-bold uppercase tracking-widest text-[#B08968] mb-2">Legend</h4>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div> <span>Major Feast (Red text)</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#2E2A27]"></div> <span>Strict Fast</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span>Fish Allowed</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500"></div> <span>Wine & Oil</span></div>
      </div>
    </div>
  );
};

const DayDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [day, setDay] = useState<CalendarDay | null>(null);

  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

  useEffect(() => {
    if(date) {
      getDayInfo(new Date(date), user?.language || 'en', user?.countryTradition || 'RO').then(setDay);
    }
  }, [date, user]);

  if (!day) return <div className="h-screen flex items-center justify-center bg-[#FAF5F0] text-[#B08968]">{t('loading')}</div>;

  const getFastLabel = (d: CalendarDay) => {
    if (!d.isFastDay) return t('no_fast');
    if (d.fastType === 'fast_with_fish') return t('fish');
    if (d.fastType === 'fast_with_oil') return t('wine_oil');
    if (d.fastType === 'strict_fast') return t('strict_fast');
    if (d.fastType === 'fast_without_oil') return 'Fast (No Oil)';
    return 'Fast';
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF5F0] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
      <div className="max-w-lg mx-auto min-h-screen bg-[#FAF5F0] relative pb-10">
        <div className="sticky top-0 bg-[#FAF5F0]/90 backdrop-blur border-b border-[#DDB892]/20 px-4 py-4 flex items-center justify-between z-10 pt-safe">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#6D645C] hover:bg-white rounded-full"><ChevronLeft size={24} /></button>
          <span className="font-semibold text-[#2E2A27] font-serif text-lg">{new Date(day.date).toLocaleDateString()}</span>
          <div className="w-8"></div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
            ${day.isFastDay ? 'bg-[#2E2A27] text-[#FAF5F0]' : 'bg-emerald-50 text-emerald-700'}`}>
            <CalIcon size={14} />
            {getFastLabel(day)}
          </div>

          <div>
            <h1 className={`text-4xl font-serif font-bold text-[#2E2A27] mb-4 leading-tight ${day.importanceLevel === 'high_feast' ? 'text-red-800' : ''}`}>
              {day.feastName}
            </h1>
            <p className="text-lg text-[#6D645C] leading-relaxed font-serif">{day.descriptionShort}</p>
          </div>

          {/* Saints List */}
          <div className="bg-white p-6 rounded-[24px] border border-[#DDB892]/20 shadow-sm">
            <h3 className="text-xs font-bold text-[#B08968] uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} /> {t('saints')}
            </h3>
            <ul className="space-y-3">
              {day.saints.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B08968] mt-2"></div>
                  <span className="text-[#2E2A27] font-medium font-serif text-lg">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Readings */}
          {day.readings && day.readings.length > 0 && (
            <div className="bg-white p-6 rounded-[24px] border border-[#DDB892]/20 shadow-sm">
              <h3 className="text-xs font-bold text-[#B08968] uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen size={16} /> {t('readings')}
              </h3>
              <ul className="space-y-3">
                {day.readings.map((r, i) => (
                  <li key={i} className="text-[#2E2A27] font-serif italic border-l-2 border-[#DDB892] pl-4 py-1">
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