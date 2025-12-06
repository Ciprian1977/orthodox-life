
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, MessageCircle, MoreHorizontal, Sun } from 'lucide-react';
import { RO_TEXT } from '../../ro-text';

export const ModernBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'today', label: RO_TEXT.tab.today, icon: Sun, path: '/' },
    { id: 'calendar', label: RO_TEXT.tab.calendar, icon: Calendar, path: '/calendar' },
    { id: 'prayers', label: RO_TEXT.tab.prayers, icon: BookOpen, path: '/prayers' },
    { id: 'ai', label: RO_TEXT.tab.ai, icon: MessageCircle, path: '/ai' },
    { id: 'more', label: RO_TEXT.tab.more, icon: MoreHorizontal, path: '/menu' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[85px] z-50">
      {/* Gradient fade to transparent at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg opacity-90 pointer-events-none" />
      
      {/* Glassmorphic Container */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-bg/80 backdrop-blur-xl border-t border-border shadow-[0_-4px_30px_rgba(0,0,0,0.05)] pb-safe safe-area-bottom">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="group relative flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none active:scale-95 transition-transform duration-200"
              >
                {/* Active Indicator Background */}
                <div className={`absolute top-2 w-10 h-10 rounded-2xl transition-all duration-300 ease-out 
                  ${isActive ? 'bg-primary/10 scale-100' : 'bg-transparent scale-0'}`} 
                />

                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`relative z-10 transition-colors duration-300 
                    ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary/70'}`} 
                />
                
                <span className={`relative z-10 text-[10px] font-bold tracking-wide transition-colors duration-300 
                  ${isActive ? 'text-primary' : 'text-text-muted/60'}`}>
                  {tab.label}
                </span>

                {/* Bottom Active Dot */}
                {isActive && (
                  <div className="absolute bottom-2 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
