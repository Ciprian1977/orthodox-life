import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, MessageCircle, MoreHorizontal, Sun } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { I18N } from '../../constants';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const lang = user?.language || 'en';

  const tabs = [
    { id: 'today', label: I18N.tab_today[lang], icon: Sun, path: '/' },
    { id: 'calendar', label: I18N.tab_calendar[lang], icon: Calendar, path: '/calendar' },
    { id: 'prayers', label: I18N.tab_prayers[lang], icon: BookOpen, path: '/prayers' },
    { id: 'ai', label: I18N.tab_ai[lang], icon: MessageCircle, path: '/ai' },
    { id: 'more', label: I18N.tab_more[lang], icon: MoreHorizontal, path: '/menu' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#DDB892]/30 h-[80px] pb-safe safe-area-bottom z-50 shadow-[0_-4px_20px_rgba(176,137,104,0.1)]">
      <div className="flex justify-around items-start pt-3 h-full max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="group flex flex-col items-center justify-center w-full space-y-1.5 focus:outline-none"
            >
              <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#FAF5F0] -translate-y-1' : ''}`}>
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-[#B08968]' : 'text-[#6D645C] group-hover:text-[#B08968]'}`} 
                />
              </div>
              <span className={`text-[11px] font-medium leading-none transition-colors duration-300 ${isActive ? 'text-[#B08968]' : 'text-[#6D645C]/70'}`}>
                {tab.label}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#B08968] mt-1"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};