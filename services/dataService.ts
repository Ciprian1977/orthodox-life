
import { MOCK_ARTICLES, MOCK_AUDIO, MOCK_PRAYERS, MOCK_QUOTES } from '../constants';
import { Article, ArticleCategory, AudioCategory, AudioItem, CalendarDay, Prayer, PrayerCategory, CountryTradition } from '../types';
import { getCalendarDay, getCalendarMonthData } from './calendarEngine';

// Simulating Firestore Latency
const DELAY = 50; 

// --- CALENDAR SERVICES (REAL ENGINE) ---

export const getDayInfo = async (date: Date, tradition: CountryTradition): Promise<CalendarDay | undefined> => {
  // Simulate network
  await new Promise(resolve => setTimeout(resolve, DELAY));
  
  // Use the engine to generate data on demand
  // In production, this would query Firestore: collection('calendar_days').doc('YYYY-MM-DD-TRADITION')
  const day = getCalendarDay(date, tradition);
  
  return day;
};

export const getCalendarMonth = async (year: number, month: number, tradition: CountryTradition): Promise<CalendarDay[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  return getCalendarMonthData(year, month, tradition);
};

// --- CONTENT SERVICES (MOCK) ---

export const getPrayers = async (category?: PrayerCategory): Promise<Prayer[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  let items = MOCK_PRAYERS;
  if (category) {
    items = items.filter(p => p.category === category);
  }
  return items;
};

export const getPrayerById = async (id: string): Promise<Prayer | undefined> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  return MOCK_PRAYERS.find(p => p.id === id);
}

export const getArticles = async (category?: ArticleCategory): Promise<Article[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  let items = MOCK_ARTICLES;
  if (category) {
    items = items.filter(a => a.category === category);
  }
  return items;
};

export const getAudioItems = async (category?: AudioCategory): Promise<AudioItem[]> => {
  await new Promise(resolve => setTimeout(resolve, DELAY));
  let items = MOCK_AUDIO;
  if (category) {
    items = items.filter(a => a.category === category);
  }
  return items;
};

export const getQuoteOfDay = (): string => {
  const quotes = MOCK_QUOTES;
  return quotes[Math.floor(Math.random() * quotes.length)];
};
