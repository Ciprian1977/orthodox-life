
import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { RO_TEXT } from '../ro-text';
import { getPrayers, getPrayerById, getAudioItems } from '../services/dataService';
import { Prayer, PrayerCategory, AudioItem } from '../types';
import { ArrowLeft, Search, Bookmark, Type, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { generatePersonalizedPrayer } from '../services/geminiService';

const CATEGORIES: PrayerCategory[] = ['morning', 'evening', 'meal', 'communion', 'children', 'health', 'travel', 'repentance', 'psalms'];

const PrayerList: React.FC = () => {
  const { user } = useUser();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<PrayerCategory | 'all'>('all');
  const [mode, setMode] = useState<'library' | 'ai'>('library');
  
  useEffect(() => {
    if (user) {
      getPrayers(activeCat === 'all' ? undefined : activeCat).then(setPrayers);
    }
  }, [user, activeCat]);

  const filtered = prayers.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const getCatLabel = (c: string) => {
    return t(`prayers.cat.${c}`) || c;
  }

  return (
    <div className="pb-32 pt-safe px-4 max-w-lg mx-auto fade-enter">
      <h1 className="text-3xl font-serif font-bold text-text mb-6 mt-6">{RO_TEXT.tab.prayers}</h1>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-card rounded-2xl border border-border mb-6 shadow-sm">
        <button 
          onClick={() => setMode('library')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
            ${mode === 'library' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-bg'}`}
        >
          <BookOpen size={16} /> {RO_TEXT.prayers.library}
        </button>
        <button 
          onClick={() => setMode('ai')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
            ${mode === 'ai' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-bg'}`}
        >
          <Sparkles size={16} /> {RO_TEXT.prayers.generator}
        </button>
      </div>
      
      {mode === 'library' ? (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <input 
              type="text" 
              placeholder={RO_TEXT.prayers.search}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text placeholder:text-accent shadow-soft"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
            <button 
              onClick={() => setActiveCat('all')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors
                ${activeCat === 'all' ? 'bg-text text-bg' : 'bg-card border border-border text-text-muted'}`}
            >
              {RO_TEXT.prayers.cat.all}
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCat(c)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors
                  ${activeCat === c ? 'bg-text text-bg' : 'bg-card border border-border text-text-muted'}`}
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
                 <Link key={prayer.id} to={prayer.id} className="block bg-card p-5 rounded-2xl border border-border shadow-soft active-press">
                   <div className="flex justify-between items-start">
                     <div>
                        <h3 className="font-serif font-bold text-xl text-text mb-2">{prayer.title}</h3>
                        <div className="inline-block px-2 py-0.5 bg-bg text-primary rounded text-[10px] uppercase font-bold tracking-wider">
                          {getCatLabel(prayer.category)}
                        </div>
                     </div>
                     {isFav && <Bookmark size={20} className="text-primary fill-current" />}
                   </div>
                 </Link>
               );
            })}
            {filtered.length === 0 && <p className="text-center text-primary opacity-50 py-10">No prayers found.</p>}
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
    const result = await generatePersonalizedPrayer(user.countryTradition, topic || situation);
    setGeneratedPrayer(result);
    setLoading(false);
  }

  return (
    <div className="fade-enter">
      <div className="bg-card p-6 rounded-3xl shadow-soft border border-border mb-6">
        <h3 className="font-serif font-bold text-xl text-text mb-2">{RO_TEXT.prayers.gen.title}</h3>
        <p className="text-sm text-text-muted mb-6">{RO_TEXT.prayers.gen.desc}</p>

        <label className="block text-xs font-bold text-primary uppercase mb-2">{RO_TEXT.prayers.gen.topic}</label>
        <input 
          className="w-full bg-bg rounded-xl p-4 mb-4 border-none focus:ring-2 focus:ring-primary text-text placeholder-text-muted"
          value={topic} onChange={e => setTopic(e.target.value)}
        />

        <label className="block text-xs font-bold text-primary uppercase mb-2">{RO_TEXT.prayers.gen.details}</label>
        <textarea 
          className="w-full bg-bg rounded-xl p-4 mb-6 border-none focus:ring-2 focus:ring-primary text-text placeholder-text-muted h-24 resize-none"
          value={situation} onChange={e => setSituation(e.target.value)}
        />

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-text text-bg py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active-press"
        >
          {loading ? RO_TEXT.prayers.gen.writing : <><Sparkles size={18} /> {RO_TEXT.prayers.gen.btn}</>}
        </button>
      </div>

      {generatedPrayer && (
        <div className="bg-card p-6 rounded-3xl shadow-soft border border-border animate-in fade-in duration-500">
           <h3 className="font-serif font-bold text-lg text-text mb-4 text-center">{RO_TEXT.prayers.gen.result}</h3>
           <div className="font-serif text-lg leading-relaxed text-text whitespace-pre-wrap">
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

  if (!prayer) return <div className="p-8 text-center text-primary">{RO_TEXT.today.loading}</div>;
  
  const isFav = user?.favoritePrayerIds.includes(prayer.id);

  return (
    <div className="pb-32 pt-safe min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 bg-bg/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-muted hover:bg-card rounded-full"><ArrowLeft size={24} /></button>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-text-muted hover:bg-card rounded-full"><Type size={22} /></button>
          <button onClick={() => toggleFavoritePrayer(prayer.id)} className={`p-2 rounded-full transition-colors ${isFav ? 'text-primary bg-card shadow-sm' : 'text-text-muted hover:bg-card'}`}>
            <Bookmark size={22} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      {/* Font Settings */}
      {showSettings && (
        <div className="fixed top-20 left-0 right-0 z-20 px-4 flex justify-center animate-in slide-in-from-top-5">
           <div className="bg-card border border-border shadow-xl rounded-2xl p-4 w-full max-w-xs flex items-center gap-4">
              <span className="text-xs font-bold text-text-muted">A</span>
              <input 
                type="range" min="16" max="32" step="2" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold text-text">A</span>
           </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-serif font-bold text-text mb-4 text-center leading-tight">{prayer.title}</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-8 opacity-30"></div>

        {/* Audio Player Button */}
        {audio && (
          <div onClick={() => navigate('/menu/audio')} className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 mb-8 shadow-sm cursor-pointer hover:border-primary transition-colors group active-press">
             <div className="bg-bg p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-bg transition-colors">
               <Volume2 size={20} />
             </div>
             <div>
               <p className="text-xs text-primary font-bold uppercase tracking-wider">{RO_TEXT.audio.listen}</p>
               <p className="text-sm font-bold text-text">{RO_TEXT.audio.available}</p>
             </div>
          </div>
        )}
        
        {prayer.isPlaceholderOfficial && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 p-4 rounded-xl mb-6 text-xs text-orange-800 dark:text-orange-300 text-center font-bold uppercase tracking-wide">
             Official Text Placeholder
          </div>
        )}
        
        <div 
          className="font-serif leading-[1.8] text-text"
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
