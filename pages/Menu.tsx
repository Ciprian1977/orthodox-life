import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { I18N, SUPPORTED_LANGUAGES, SUPPORTED_TRADITIONS } from '../constants';
import { getArticles, getAudioItems } from '../services/dataService';
import { Article, AudioItem } from '../types';
import { Book, Music, Settings, ChevronRight, ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Globe, MapPin, Bell, RefreshCw, Info } from 'lucide-react';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';

// --- MENU MAIN ---
const MenuList: React.FC = () => {
  const { user } = useUser();
  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

  const items = [
    { id: 'guide', label: t('guide'), icon: Book, path: '/menu/guide', color: 'bg-emerald-50 text-emerald-700' },
    { id: 'audio', label: t('audio'), icon: Music, path: '/menu/audio', color: 'bg-purple-50 text-purple-700' },
    { id: 'settings', label: t('settings'), icon: Settings, path: '/menu/settings', color: 'bg-[#FAF5F0] text-[#6D645C]' },
    { id: 'about', label: t('about'), icon: Info, path: '/menu/about', color: 'bg-blue-50 text-blue-700' },
  ];

  return (
    <div className="p-4 pt-safe max-w-lg mx-auto bg-[#FAF5F0] min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-[#2E2A27] mb-8 mt-6">{t('tab_more')}</h1>
      
      <div className="space-y-4">
        {items.map(item => {
           const Icon = item.icon;
           return (
             <Link key={item.id} to={item.path} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[#DDB892]/20 shadow-sm active:scale-[0.98] transition-transform">
               <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl ${item.color}`}>
                   <Icon size={24} />
                 </div>
                 <span className="font-semibold text-lg text-[#2E2A27]">{item.label}</span>
               </div>
               <ChevronRight size={20} className="text-[#DDB892]" />
             </Link>
           );
        })}
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <OrthodoxLifeLogo className="mx-auto opacity-50" size={40} />
        <p className="text-xs text-[#6D645C] font-medium opacity-60">Orthodox Life v1.0.0</p>
      </div>
    </div>
  );
};

// --- ABOUT PAGE ---
const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="pb-24 pt-safe p-4 max-w-lg mx-auto bg-[#FAF5F0] min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-4 text-[#6D645C] flex items-center gap-1 hover:text-[#2E2A27]"><ArrowLeft size={16} /> Back</button>
      
      <div className="flex flex-col items-center mb-8 mt-4">
        <OrthodoxLifeLogo size={80} color="#B08968" />
        <h1 className="text-3xl font-serif font-bold mt-4 text-[#2E2A27]">Orthodox Life</h1>
        <p className="text-[#6D645C] italic font-serif">Guidance. Prayer. Peace.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDB892]/20">
          <h3 className="font-bold text-[#B08968] uppercase tracking-widest text-xs mb-3">Our Mission</h3>
          <p className="text-[#2E2A27] leading-relaxed font-serif">
            To provide a calm, respectful, and reliable companion for Orthodox Christians worldwide. We aim to make the rhythm of Church life—feasts, fasts, and prayers—accessible in the modern world without losing the depth of tradition.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDB892]/20">
          <h3 className="font-bold text-[#B08968] uppercase tracking-widest text-xs mb-3">How It Works</h3>
          <ul className="list-disc list-inside space-y-2 text-[#2E2A27] font-serif text-sm">
             <li><strong>Calendar Engine:</strong> Calculates Pascha and movable feasts dynamically based on Church canons.</li>
             <li><strong>Library:</strong> Safe, curated prayers and educational articles.</li>
             <li><strong>AI Helper:</strong> Uses Google Gemini to answer questions with strict Orthodox context guardrails.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#DDB892]/20">
          <h3 className="font-bold text-[#B08968] uppercase tracking-widest text-xs mb-3">Disclaimer</h3>
          <p className="text-[#6D645C] text-sm leading-relaxed">
            This app is a tool, not a spiritual father. For personal guidance, sacraments, or serious life decisions, please always consult your local priest.
          </p>
        </section>
      </div>
    </div>
  )
}

// --- GUIDE PAGE (Refreshed) ---
const GuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    if(user) getArticles(user.language).then(setArticles);
  }, [user]);

  if (selectedArticle) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF5F0] overflow-y-auto animate-in slide-in-from-right">
        <div className="max-w-lg mx-auto pt-safe min-h-screen">
           <div className="sticky top-0 bg-[#FAF5F0]/95 backdrop-blur border-b border-[#DDB892]/20 px-4 py-3 flex items-center gap-4 z-10">
              <button onClick={() => setSelectedArticle(null)} className="p-2 -ml-2 text-[#6D645C] hover:bg-white rounded-full"><ArrowLeft size={24} /></button>
              <span className="font-bold text-[#2E2A27] truncate">Guide</span>
           </div>
           <div className="p-6">
              <div className="inline-block px-3 py-1 bg-[#2E2A27] text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {selectedArticle.category}
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#2E2A27] mb-6 leading-tight">{selectedArticle.title}</h1>
              <div className="prose prose-slate prose-lg font-serif text-[#2E2A27]">
                {selectedArticle.body}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
     <div className="pb-32 pt-safe p-4 max-w-lg mx-auto bg-[#FAF5F0] min-h-screen">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#6D645C] flex items-center gap-1 hover:text-[#2E2A27]"><ArrowLeft size={16} /> Back</button>
        <h1 className="text-3xl font-serif font-bold mb-6 text-[#2E2A27]">Guide</h1>
        
        <div className="space-y-4">
           {articles.map(a => (
             <div 
               key={a.id} 
               onClick={() => setSelectedArticle(a)}
               className="p-5 bg-white rounded-2xl border border-[#DDB892]/20 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
             >
               <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-bold text-[#B08968] uppercase tracking-wide">{a.category}</span>
                 <span className="text-xs text-[#DDB892]">{a.readingTimeMinutes} min read</span>
               </div>
               <h3 className="font-serif font-bold text-xl text-[#2E2A27] mb-1">{a.title}</h3>
             </div>
           ))}
        </div>
     </div>
  );
}

// --- AUDIO PAGE (Refreshed) ---
const AudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [items, setItems] = useState<AudioItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if(user) getAudioItems(user.language).then(setItems);
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
     <div className="pb-40 pt-safe p-4 max-w-lg mx-auto relative min-h-screen bg-[#FAF5F0]">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#6D645C] flex items-center gap-1 hover:text-[#2E2A27]"><ArrowLeft size={16} /> Back</button>
        <h1 className="text-3xl font-serif font-bold mb-6 text-[#2E2A27]">Audio</h1>
        
        <div className="space-y-3">
           {items.map(item => (
             <div 
                key={item.id} 
                onClick={() => setCurrentTrack(item)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                  ${currentTrack?.id === item.id ? 'bg-[#2E2A27] border-[#2E2A27] text-white' : 'bg-white border-[#DDB892]/20 hover:border-[#B08968]'}`}
             >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm
                  ${currentTrack?.id === item.id ? 'bg-[#B08968] text-white' : 'bg-[#FAF5F0] text-[#B08968]'}`}>
                   {currentTrack?.id === item.id && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </div>
                <div>
                   <div className={`font-bold ${currentTrack?.id === item.id ? 'text-white' : 'text-[#2E2A27]'}`}>{item.title}</div>
                   <div className={`text-xs ${currentTrack?.id === item.id ? 'text-white/60' : 'text-[#6D645C]'}`}>{item.category}</div>
                </div>
             </div>
           ))}
        </div>

        {/* Player Bar */}
        {currentTrack && (
          <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-[#DDB892]/20 p-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
             <div className="max-w-lg mx-auto flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-bold text-[#2E2A27] truncate font-serif">{currentTrack.title}</p>
                  <p className="text-xs text-[#6D645C] truncate">{currentTrack.description}</p>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={togglePlay} className="w-12 h-12 bg-[#B08968] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
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

// --- SETTINGS PAGE (Refreshed) ---
const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser, updateLanguage, updateTradition } = useUser();
    
    if (!user) return null;

    const t = (key: string) => I18N[key][user.language] || I18N[key]['en'];

    const handleRestartOnboarding = () => {
      setUser({ ...user, hasOnboarded: false });
      navigate('/');
    };
    
    return (
       <div className="pb-32 pt-safe p-4 max-w-lg mx-auto bg-[#FAF5F0] min-h-screen">
          <button onClick={() => navigate(-1)} className="mb-4 text-[#6D645C] flex items-center gap-1 hover:text-[#2E2A27]"><ArrowLeft size={16} /> Back</button>
          <h1 className="text-3xl font-serif font-bold mb-6 text-[#2E2A27]">{t('settings')}</h1>
          
          <div className="space-y-6">
            
            {/* Language Section */}
            <section className="bg-white rounded-2xl border border-[#DDB892]/20 p-5 shadow-sm">
               <h3 className="text-xs font-bold text-[#B08968] uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Globe size={16} /> {t('select_language')}
               </h3>
               <div className="grid grid-cols-1 gap-2">
                 {SUPPORTED_LANGUAGES.map(lang => (
                   <button 
                     key={lang.code}
                     onClick={() => updateLanguage(lang.code)}
                     className={`flex items-center justify-between p-3 rounded-xl transition-colors
                       ${user.language === lang.code ? 'bg-[#2E2A27] text-white font-bold' : 'hover:bg-[#FAF5F0] text-[#2E2A27]'}`}
                   >
                     <span>{lang.label}</span>
                     {user.language === lang.code && <div className="w-2 h-2 bg-[#B08968] rounded-full"></div>}
                   </button>
                 ))}
               </div>
            </section>

            {/* Tradition Section */}
            <section className="bg-white rounded-2xl border border-[#DDB892]/20 p-5 shadow-sm">
               <h3 className="text-xs font-bold text-[#B08968] uppercase tracking-widest mb-4 flex items-center gap-2">
                 <MapPin size={16} /> {t('select_tradition')}
               </h3>
               <div className="grid grid-cols-1 gap-2">
                 {SUPPORTED_TRADITIONS.map(tr => (
                   <button 
                     key={tr.code}
                     onClick={() => updateTradition(tr.code)}
                     className={`flex items-center justify-between p-3 rounded-xl transition-colors
                       ${user.countryTradition === tr.code ? 'bg-[#2E2A27] text-white font-bold' : 'hover:bg-[#FAF5F0] text-[#2E2A27]'}`}
                   >
                     <span>{tr.label}</span>
                     {user.countryTradition === tr.code && <div className="w-2 h-2 bg-[#B08968] rounded-full"></div>}
                   </button>
                 ))}
               </div>
            </section>

             {/* Actions */}
            <section className="bg-white rounded-2xl border border-[#DDB892]/20 p-5 shadow-sm space-y-3">
               <h3 className="text-xs font-bold text-[#B08968] uppercase tracking-widest mb-4">Actions</h3>
               
               <button onClick={handleRestartOnboarding} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF5F0] text-[#2E2A27] transition-colors text-left">
                  <RefreshCw size={20} className="text-[#B08968]" />
                  <span>{t('restart_onboarding')}</span>
               </button>

               <button onClick={() => { localStorage.clear(); setUser(null); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left">
                  <Bell size={20} />
                  <span>{t('reset_app')} (Debug)</span>
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