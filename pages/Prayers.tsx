import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { getPrayers, getPrayerById, getAudioItems } from '../services/dataService';
import { Prayer, PrayerCategory, AudioItem } from '../types';
import { I18N } from '../constants';
import { ArrowLeft, Search, Bookmark, Type, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { generatePersonalizedPrayer } from '../services/geminiService';

const CATEGORIES: PrayerCategory[] = ['morning', 'evening', 'meal', 'communion', 'children', 'health', 'travel', 'repentance', 'psalms'];

const PrayerList: React.FC = () => {
  const { user, toggleFavoritePrayer } = useUser();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<PrayerCategory | 'all'>('all');
  const [mode, setMode] = useState<'library' | 'ai'>('library');
  
  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

  useEffect(() => {
    if (user) {
      getPrayers(user.language, activeCat === 'all' ? undefined : activeCat).then(setPrayers);
    }
  }, [user, activeCat]);

  const filtered = prayers.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const getCatLabel = (c: string) => {
    if (c === 'psalms') return t('cat_psalm');
    return t(`category_${c}`) || c;
  }

  return (
    <div className="pb-32 pt-safe px-4 max-w-lg mx-auto min-h-screen bg-[#FAF5F0]">
      <h1 className="text-3xl font-serif font-bold text-[#2E2A27] mb-6 mt-6">{t('tab_prayers')}</h1>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-white rounded-2xl border border-[#DDB892]/20 mb-6 shadow-sm">
        <button 
          onClick={() => setMode('library')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
            ${mode === 'library' ? 'bg-[#B08968] text-white shadow-md' : 'text-[#6D645C] hover:bg-[#FAF5F0]'}`}
        >
          <BookOpen size={16} /> Library
        </button>
        <button 
          onClick={() => setMode('ai')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
            ${mode === 'ai' ? 'bg-[#B08968] text-white shadow-md' : 'text-[#6D645C] hover:bg-[#FAF5F0]'}`}
        >
          <Sparkles size={16} /> AI Generator
        </button>
      </div>
      
      {mode === 'library' ? (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08968]" size={18} />
            <input 
              type="text" 
              placeholder={t('search')}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-[#DDB892]/20 focus:outline-none focus:ring-2 focus:ring-[#B08968] text-[#2E2A27] placeholder:text-[#DDB892] shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
            <button 
              onClick={() => setActiveCat('all')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors
                ${activeCat === 'all' ? 'bg-[#2E2A27] text-white' : 'bg-white border border-[#DDB892]/30 text-[#6D645C]'}`}
            >
              All
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCat(c)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors
                  ${activeCat === c ? 'bg-[#2E2A27] text-white' : 'bg-white border border-[#DDB892]/30 text-[#6D645C]'}`}
              >
                {getCatLabel(c)}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map(prayer => {
               const isFav = user?.favoritePrayerIds.includes(prayer.id);
               return (
                 <Link key={prayer.id} to={prayer.id} className="block bg-white p-5 rounded-2xl border border-[#DDB892]/10 shadow-sm active:scale-[0.99] transition-transform">
                   <div className="flex justify-between items-start">
                     <div>
                        <h3 className="font-serif font-bold text-xl text-[#2E2A27] mb-2">{prayer.title}</h3>
                        <div className="inline-block px-2 py-0.5 bg-[#FAF5F0] text-[#B08968] rounded text-[10px] uppercase font-bold tracking-wider">
                          {getCatLabel(prayer.category)}
                        </div>
                     </div>
                     {isFav && <Bookmark size={20} className="text-[#B08968] fill-current" />}
                   </div>
                 </Link>
               );
            })}
            {filtered.length === 0 && <p className="text-center text-[#B08968] opacity-50 py-10">No prayers found.</p>}
          </div>
        </>
      ) : (
        <AIPrayerGenerator />
      )}
    </div>
  );
};

const AIPrayerGenerator: React.FC = () => {
  const { user } = useUser();
  const [topic, setTopic] = useState('');
  const [situation, setSituation] = useState('');
  const [generatedPrayer, setGeneratedPrayer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user || (!topic && !situation)) return;
    setLoading(true);
    const result = await generatePersonalizedPrayer(user.language, user.countryTradition, topic || situation);
    setGeneratedPrayer(result);
    setLoading(false);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DDB892]/20 mb-6">
        <h3 className="font-serif font-bold text-xl text-[#2E2A27] mb-2">Create a Personal Prayer</h3>
        <p className="text-sm text-[#6D645C] mb-6">Describe your burden or joy, and we will write a prayer for you.</p>

        <label className="block text-xs font-bold text-[#B08968] uppercase mb-2">Topic (e.g., Anxiety, Gratitude)</label>
        <input 
          className="w-full bg-[#FAF5F0] rounded-xl p-4 mb-4 border-none focus:ring-2 focus:ring-[#B08968] text-[#2E2A27]"
          value={topic} onChange={e => setTopic(e.target.value)}
        />

        <label className="block text-xs font-bold text-[#B08968] uppercase mb-2">Details (Optional)</label>
        <textarea 
          className="w-full bg-[#FAF5F0] rounded-xl p-4 mb-6 border-none focus:ring-2 focus:ring-[#B08968] text-[#2E2A27] h-24 resize-none"
          value={situation} onChange={e => setSituation(e.target.value)}
          placeholder="For my sick child, before a trip, etc."
        />

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#2E2A27] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4a4440] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Writing...' : <><Sparkles size={18} /> Generate Prayer</>}
        </button>
      </div>

      {generatedPrayer && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DDB892]/20 animate-in fade-in duration-500">
           <h3 className="font-serif font-bold text-lg text-[#2E2A27] mb-4 text-center">Your Prayer</h3>
           <div className="font-serif text-lg leading-relaxed text-[#2E2A27] whitespace-pre-wrap">
             {generatedPrayer}
           </div>
        </div>
      )}
    </div>
  );
}

const PrayerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavoritePrayer } = useUser();
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [audio, setAudio] = useState<AudioItem | null>(null);
  const [fontSize, setFontSize] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  
  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

  useEffect(() => {
    if (id) {
      getPrayerById(id).then(p => {
        setPrayer(p);
        if (p) {
          getAudioItems(p.language).then(items => {
             const found = items.find(i => i.relatedPrayerId === p.id);
             setAudio(found || null);
          });
        }
      });
    }
  }, [id]);

  if (!prayer) return <div className="p-8 text-center">{t('loading')}</div>;
  
  const isFav = user?.favoritePrayerIds.includes(prayer.id);

  return (
    <div className="pb-32 pt-safe min-h-screen bg-[#FAF5F0]">
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF5F0]/95 backdrop-blur-md border-b border-[#DDB892]/20 px-4 py-4 flex items-center justify-between z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#6D645C] hover:bg-white rounded-full"><ArrowLeft size={24} /></button>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-[#6D645C] hover:bg-white rounded-full"><Type size={22} /></button>
          <button onClick={() => toggleFavoritePrayer(prayer.id)} className={`p-2 rounded-full transition-colors ${isFav ? 'text-[#B08968] bg-white shadow-sm' : 'text-[#6D645C] hover:bg-white'}`}>
            <Bookmark size={22} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      {/* Font Settings */}
      {showSettings && (
        <div className="fixed top-20 left-0 right-0 z-20 px-4 flex justify-center animate-in slide-in-from-top-5">
           <div className="bg-white border border-[#DDB892]/20 shadow-xl rounded-2xl p-4 w-full max-w-xs flex items-center gap-4">
              <span className="text-xs font-bold text-[#6D645C]">A</span>
              <input 
                type="range" min="16" max="32" step="2" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 accent-[#B08968] h-1 bg-[#DDB892]/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold text-[#2E2A27]">A</span>
           </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-serif font-bold text-[#2E2A27] mb-4 text-center leading-tight">{prayer.title}</h1>
        <div className="w-16 h-1 bg-[#B08968] mx-auto rounded-full mb-8 opacity-30"></div>

        {/* Audio Player Button */}
        {audio && (
          <div onClick={() => navigate('/menu/audio')} className="bg-white border border-[#DDB892]/30 p-4 rounded-xl flex items-center gap-4 mb-8 shadow-sm cursor-pointer hover:bg-purple-50 transition-colors group">
             <div className="bg-[#FAF5F0] p-3 rounded-full text-[#B08968] group-hover:bg-[#B08968] group-hover:text-white transition-colors">
               <Volume2 size={20} />
             </div>
             <div>
               <p className="text-xs text-[#B08968] font-bold uppercase tracking-wider">Listen</p>
               <p className="text-sm font-bold text-[#2E2A27]">Audio available</p>
             </div>
          </div>
        )}
        
        {prayer.isPlaceholderOfficial && (
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6 text-xs text-orange-800 text-center font-bold uppercase tracking-wide">
             Official Text Placeholder
          </div>
        )}
        
        <div 
          className="font-serif leading-[1.8] text-[#2E2A27]"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: prayer.text }}
        />
      </div>
    </div>
  );
};

export const Prayers: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrayerList />} />
      <Route path="/:id" element={<PrayerDetail />} />
    </Routes>
  );
};