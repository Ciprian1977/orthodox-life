
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { RO_TEXT } from '../ro-text';
import { useTheme } from '../contexts/ThemeContext';
import { SUPPORTED_TRADITIONS } from '../constants';
import { getArticles, getAudioItems } from '../services/dataService';
import { Article, AudioItem } from '../types';
import { Book, Music, Settings, ChevronRight, ArrowLeft, Play, Pause, Volume2, Globe, MapPin, Bell, RefreshCw, Info, Moon, Sun, Monitor } from 'lucide-react';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';

// --- MENU MAIN ---
const MenuList: React.FC = () => {

  const items = [
    { id: 'guide', label: RO_TEXT.menu.guide, icon: Book, path: '/menu/guide', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { id: 'audio', label: RO_TEXT.menu.audio, icon: Music, path: '/menu/audio', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { id: 'settings', label: RO_TEXT.menu.settings, icon: Settings, path: '/menu/settings', color: 'bg-bg text-text-muted' },
    { id: 'about', label: RO_TEXT.menu.about, icon: Info, path: '/menu/about', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  ];

  return (
    <div className="p-4 pt-safe max-w-lg mx-auto bg-bg min-h-screen fade-enter">
      <h1 className="text-3xl font-serif font-bold text-text mb-8 mt-6">{RO_TEXT.tab.more}</h1>
      
      <div className="space-y-4">
        {items.map(item => {
           const Icon = item.icon;
           return (
             <Link key={item.id} to={item.path} className="flex items-center justify-between p-5 bg-card rounded-2xl border border-border shadow-soft active-press transition-colors">
               <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl ${item.color}`}>
                   <Icon size={24} />
                 </div>
                 <span className="font-semibold text-lg text-text">{item.label}</span>
               </div>
               <ChevronRight size={20} className="text-accent" />
             </Link>
           );
        })}
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <OrthodoxLifeLogo className="mx-auto opacity-50 text-primary" size={40} />
        <p className="text-xs text-text-muted font-medium opacity-60">Orthodox Life v1.0.0</p>
      </div>
    </div>
  );
};

// --- ABOUT PAGE ---
const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="pb-24 pt-safe p-4 max-w-lg mx-auto bg-bg min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-4 text-text-muted flex items-center gap-1 hover:text-text"><ArrowLeft size={16} /> {RO_TEXT.btn.back}</button>
      
      <div className="flex flex-col items-center mb-8 mt-4 animate-in fade-in zoom-in duration-500">
        <OrthodoxLifeLogo size={80} className="text-primary" />
        <h1 className="text-3xl font-serif font-bold mt-4 text-text">{t('app.name')}</h1>
        <p className="text-text-muted italic font-serif">{t('app.tagline')}</p>
      </div>

      <div className="space-y-6 animate-in slide-in-from-bottom-5 delay-100">
        <section className="bg-card p-6 rounded-2xl shadow-soft border border-border">
          <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-3">Our Mission</h3>
          <p className="text-text leading-relaxed font-serif">
            To provide a calm, respectful, and reliable companion for Orthodox Christians worldwide. We aim to make the rhythm of Church life—feasts, fasts, and prayers—accessible in the modern world without losing the depth of tradition.
          </p>
        </section>

        <section className="bg-card p-6 rounded-2xl shadow-soft border border-border">
          <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-3">How It Works</h3>
          <ul className="list-disc list-inside space-y-2 text-text font-serif text-sm">
             <li><strong>Calendar Engine:</strong> Calculates Pascha and movable feasts dynamically based on Church canons.</li>
             <li><strong>Library:</strong> Safe, curated prayers and educational articles.</li>
             <li><strong>AI Helper:</strong> Uses Google Gemini to answer questions with strict Orthodox context guardrails.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl shadow-soft border border-border">
          <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-3">Disclaimer</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            This app is a tool, not a spiritual father. For personal guidance, sacraments, or serious life decisions, please always consult your local priest.
          </p>
        </section>
      </div>
    </div>
  )
}

// --- GUIDE PAGE ---
const GuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    if(user) getArticles().then(setArticles);
  }, [user]);

  if (selectedArticle) {
    return (
      <div className="fixed inset-0 z-[60] bg-bg overflow-y-auto animate-in slide-in-from-right">
        <div className="max-w-lg mx-auto pt-safe min-h-screen">
           <div className="sticky top-0 bg-bg/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4 z-10">
              <button onClick={() => setSelectedArticle(null)} className="p-2 -ml-2 text-text-muted hover:bg-card rounded-full"><ArrowLeft size={24} /></button>
              <span className="font-bold text-text truncate">{RO_TEXT.menu.guide}</span>
           </div>
           <div className="p-6">
              <div className="inline-block px-3 py-1 bg-text text-bg rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {selectedArticle.category}
              </div>
              <h1 className="text-3xl font-serif font-bold text-text mb-6 leading-tight">{selectedArticle.title}</h1>
              <div className="prose prose-slate prose-lg font-serif text-text dark:prose-invert">
                {selectedArticle.body}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
     <div className="pb-32 pt-safe p-4 max-w-lg mx-auto bg-bg min-h-screen">
        <button onClick={() => navigate(-1)} className="mb-4 text-text-muted flex items-center gap-1 hover:text-text"><ArrowLeft size={16} /> {RO_TEXT.btn.back}</button>
        <h1 className="text-3xl font-serif font-bold mb-6 text-text">{RO_TEXT.menu.guide}</h1>
        
        <div className="space-y-4">
           {articles.map(a => (
             <div 
               key={a.id} 
               onClick={() => setSelectedArticle(a)}
               className="p-5 bg-card rounded-2xl border border-border shadow-soft hover:shadow-md transition-all cursor-pointer active-press"
             >
               <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-bold text-primary uppercase tracking-wide">{a.category}</span>
                 <span className="text-xs text-accent">{a.readingTimeMinutes} {RO_TEXT.guide.read_time}</span>
               </div>
               <h3 className="font-serif font-bold text-xl text-text mb-1">{a.title}</h3>
             </div>
           ))}
        </div>
     </div>
  );
}

// --- AUDIO PAGE ---
const AudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [items, setItems] = useState<AudioItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if(user) getAudioItems().then(setItems);
  }, [user]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Audio play error", e));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
     <div className="pb-40 pt-safe p-4 max-w-lg mx-auto relative min-h-screen bg-bg">
        <button onClick={() => navigate(-1)} className="mb-4 text-text-muted flex items-center gap-1 hover:text-text"><ArrowLeft size={16} /> {RO_TEXT.btn.back}</button>
        <h1 className="text-3xl font-serif font-bold mb-6 text-text">{RO_TEXT.menu.audio}</h1>
        
        <div className="space-y-3">
           {items.map(item => (
             <div 
                key={item.id} 
                onClick={() => setCurrentTrack(item)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                  ${currentTrack?.id === item.id ? 'bg-text border-text text-bg' : 'bg-card border-border hover:border-primary'}`}
             >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm
                  ${currentTrack?.id === item.id ? 'bg-primary text-bg' : 'bg-bg text-primary'}`}>
                   {currentTrack?.id === item.id && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </div>
                <div>
                   <div className={`font-bold ${currentTrack?.id === item.id ? 'text-bg' : 'text-text'}`}>{item.title}</div>
                   <div className={`text-xs ${currentTrack?.id === item.id ? 'opacity-80' : 'text-text-muted'}`}>{item.category}</div>
                </div>
             </div>
           ))}
        </div>

        {/* Player Bar */}
        {currentTrack && (
          <div className="fixed bottom-[85px] left-0 right-0 bg-card/90 backdrop-blur border-t border-border p-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
             <div className="max-w-lg mx-auto flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-bold text-text truncate font-serif">{currentTrack.title}</p>
                  <p className="text-xs text-text-muted truncate">{currentTrack.description}</p>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={togglePlay} className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-bg shadow-lg active-press">
                      {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-1"/>}
                   </button>
                </div>
             </div>
             <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
          </div>
        )}
     </div>
  );
}

// --- SETTINGS PAGE ---
const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser, updateTradition } = useUser();
    const { theme, setTheme } = useTheme();
    
    if (!user) return null;

    
    return (
       <div className="pb-32 pt-safe p-4 max-w-lg mx-auto bg-bg min-h-screen">
          <button onClick={() => navigate(-1)} className="mb-4 text-text-muted flex items-center gap-1 hover:text-text"><ArrowLeft size={16} /> {RO_TEXT.btn.back}</button>
          <h1 className="text-3xl font-serif font-bold mb-6 text-text">{RO_TEXT.menu.settings}</h1>
          
          <div className="space-y-6">
            
            {/* Theme Section */}
            <section className="bg-card rounded-2xl border border-border p-5 shadow-soft">
               <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Sun size={16} /> {RO_TEXT.settings.appearance}
               </h3>
               <div className="flex bg-bg p-1 rounded-xl">
                  {['light', 'dark', 'system'].map((tMode) => (
                    <button
                      key={tMode}
                      onClick={() => setTheme(tMode as any)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                        ${theme === tMode ? 'bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text'}`}
                    >
                      {tMode === 'light' && <Sun size={14} />}
                      {tMode === 'dark' && <Moon size={14} />}
                      {tMode === 'system' && <Monitor size={14} />}
                      <span className="capitalize">{tMode}</span>
                    </button>
                  ))}
               </div>
            </section>


            {/* Tradition Section */}
            <section className="bg-card rounded-2xl border border-border p-5 shadow-soft">
               <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                 <MapPin size={16} /> {RO_TEXT.settings.tradition}
               </h3>
               <div className="grid grid-cols-1 gap-2">
                 {SUPPORTED_TRADITIONS.map(tr => (
                   <button 
                     key={tr.code}
                     onClick={() => updateTradition(tr.code)}
                     className={`flex items-center justify-between p-3 rounded-xl transition-colors
                       ${user.countryTradition === tr.code ? 'bg-text text-bg font-bold' : 'hover:bg-bg text-text'}`}
                   >
                     <span>{tr.label}</span>
                     {user.countryTradition === tr.code && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                   </button>
                 ))}
               </div>
            </section>

             {/* Actions */}
            <section className="bg-card rounded-2xl border border-border p-5 shadow-soft space-y-3">
               <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{RO_TEXT.settings.actions}</h3>
               
               <button onClick={handleRestartOnboarding} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-bg text-text transition-colors text-left">
                  <RefreshCw size={20} className="text-primary" />
                  <span>{RO_TEXT.btn.restart_onboarding}</span>
               </button>

               <button onClick={() => { localStorage.clear(); setUser(null); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left">
                  <Bell size={20} />
                  <span>{RO_TEXT.btn.reset}</span>
               </button>
            </section>
          </div>
       </div>
    );
}

export const Menu: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MenuList />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/audio" element={<AudioPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
};
