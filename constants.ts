
import { Language, CountryTradition, CalendarDay, Prayer, Article, AudioItem } from './types';

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ro', label: 'Română' },
  { code: 'ru', label: 'Русский' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'sr', label: 'Српски' },
];

export const SUPPORTED_TRADITIONS: { code: CountryTradition; label: string }[] = [
  { code: 'USA', label: 'USA / Generic' },
  { code: 'RO', label: 'Romania' },
  { code: 'RU', label: 'Russia' },
  { code: 'GR', label: 'Greece' },
  { code: 'SRB', label: 'Serbia' },
];

// MOCK DATA GENERATORS (Kept as placeholders for safe original content integration)
export const MOCK_CALENDAR_DAYS: CalendarDay[] = []; 

export const MOCK_PRAYERS: Prayer[] = [
    {
        id: 'p1', title: 'The Lord\'s Prayer (Placeholder)', language: 'en', category: 'morning', tags: ['basic'],
        text: '<p>OFFICIAL LITURGICAL TEXT TO BE INSERTED. Our Father...</p>', isPlaceholderOfficial: true
    },
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: 'a1', title: 'How to Keep the Fast', language: 'en', category: 'fasting', readingTimeMinutes: 5,
        body: 'Fasting is a spiritual discipline...'
    }
];

export const MOCK_AUDIO: AudioItem[] = [
    {
        id: 'au1', title: 'Morning Prayer', description: 'Demo Audio', language: 'en', category: 'prayer', durationSeconds: 120,
        url: 'https://example.com/demo.mp3'
    }
];

export const MOCK_QUOTES: { [lang in Language]: string[] } = {
  en: ['"Acquire a peaceful spirit, and around you thousands will be saved." - St. Seraphim'],
  ro: ['"Dobândește pacea și mii de oameni din jurul tău se vor mântui." - Sf. Serafim'],
  ru: ['"Стяжи дух мирен..."'],
  el: ['"Απόκτησε ειρήνη..."'],
  sr: ['"Стегни дух мира..."'],
};
