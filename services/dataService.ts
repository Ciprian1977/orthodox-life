
import { MOCK_ARTICLES, MOCK_AUDIO, MOCK_PRAYERS, MOCK_QUOTES } from '../constants';
import { Article, ArticleCategory, AudioCategory, AudioItem, CalendarDay, Language, Prayer, PrayerCategory, CountryTradition } from '../types';
import { getCalendarDay, getCalendarMonthData } from './calendarEngine';

// Simulating Firestore Latency
const DELAY = 50; 

// --- CALENDAR SERVICES (REAL ENGINE) ---

export const getDayInfo = async (date: Date, lang: Language, tradition: CountryTradition): Promise<CalendarDay | undefined> => {
  // Simulate network
  await new Promise(resolve => setTimeout(resolve, DELAY));
  
  // Use the engine to generate data on demand
  // In production, this would query Firestore: collection('calendar_days').doc('YYYY-MM-DD-TRADITION')
  const day = getCalendarDay(date, tradition);
  
  // Localization fallbacks would happen here if we had multi-lang database
  // For now, the engine generates Romanian-centric data (RO tradition), 
  // but we pass it through.
  
  return day;
};

export const getCalendarMonth = async (year: number, month: number, tradition: CountryTradition): Promise<CalendarDay[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  return getCalendarMonthData(year, month, tradition);
};

// --- CONTENT SERVICES (MOCK) ---

export const getPrayers = async (lang: Language, category?: PrayerCategory): Promise<Prayer[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  let items = MOCK_PRAYERS.filter(p => p.language === lang || p.language === 'en');
  if (category) {
    items = items.filter(p => p.category === category);
  }
  return items;
};

export const getPrayerById = async (id: string): Promise<Prayer | undefined> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  return MOCK_PRAYERS.find(p => p.id === id);
}

export const getArticles = async (lang: Language, category?: ArticleCategory): Promise<Article[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  let items = MOCK_ARTICLES.filter(a => a.language === lang || a.language === 'en');
  if (category) {
    items = items.filter(a => a.category === category);
  }
  return items;
};

export const getAudioItems = async (lang: Language, category?: AudioCategory): Promise<AudioItem[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  let items = MOCK_AUDIO.filter(a => a.language === lang || a.language === 'en');
  if (category) {
    items = items.filter(a => a.category === category);
  }
  return items;
};

export const getQuoteOfDay = (lang: Language): string => {
  const quotes = MOCK_QUOTES[lang] || MOCK_QUOTES['en'];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
