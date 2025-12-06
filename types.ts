

export type Language = 'ro' | 'en' | 'ru' | 'el' | 'sr';
export type CountryTradition = 'RO' | 'SRB' | 'RU' | 'GR' | 'USA';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  id?: string;
  language: Language;
  countryTradition: CountryTradition;
  hasOnboarded: boolean;
  theme?: ThemeMode;
  favoritePrayerIds: string[];
  favoriteAudioIds: string[];
  settings: {
    notificationsEnabled: boolean;
    notifyFast: boolean;
    notifyFeast: boolean;
    notifyTime: string; // "08:00"
  }
}

export type FastType = 
  | 'no_fast' 
  | 'strict_fast'       // Post Negru / Ajun
  | 'fast_without_oil'  // Post fără ulei
  | 'fast_with_oil'     // Dezlegare la ulei și vin
  | 'fast_with_fish'    // Dezlegare la pește
  | 'dairy';            // Dezlegare la brânză (Cheese-fare)

export type ImportanceLevel = 'high_feast' | 'saint' | 'sunday' | 'normal';

export interface CalendarDay {
  id: string; // YYYY-MM-DD-TRADITION
  date: string; // YYYY-MM-DD
  tradition: CountryTradition;
  feastName: string;
  isFastDay: boolean;
  fastType: FastType;
  importanceLevel: ImportanceLevel;
  descriptionShort: string;
  saints: string[];
  readings?: string[]; // Epistle/Gospel references
  notes?: string;
}

export type PrayerCategory = 'morning' | 'evening' | 'meal' | 'communion' | 'children' | 'health' | 'travel' | 'repentance' | 'psalms';

export interface Prayer {
  id: string;
  title: string;
  text: string; // HTML or clean text
  language: Language;
  tradition?: CountryTradition; // Optional, null if generic
  category: PrayerCategory;
  tags: string[];
  isFeatured?: boolean;
  isPlaceholderOfficial?: boolean;
}

export type ArticleCategory = 'practice' | 'sacraments' | 'feasts' | 'church_conduct' | 'fasting';

export interface Article {
  id: string;
  title: string;
  body: string; // HTML allowed
  language: Language;
  category: ArticleCategory;
  readingTimeMinutes: number;
  author?: string;
}

export type AudioCategory = 'psalm' | 'acathist' | 'prayer' | 'chant';

export interface AudioItem {
  id: string;
  title: string;
  description: string;
  language: Language;
  category: AudioCategory;
  durationSeconds: number;
  url: string; // Remote URL
  coverImage?: string;
  relatedPrayerId?: string; // Optional link to text prayer
}

export interface TranslationDictionary {
  [key: string]: {
    [lang in Language]?: string;
  };
}