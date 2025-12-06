
import { CountryTradition, CalendarDay, Prayer, Article, AudioItem } from './types';

export const SUPPORTED_TRADITIONS: { code: CountryTradition; label: string }[] = [
  { code: 'RO', label: 'România' },
  { code: 'RU', label: 'Rusia' },
  { code: 'GR', label: 'Grecia' },
  { code: 'SRB', label: 'Serbia' },
  { code: 'USA', label: 'Generic' },
];

// MOCK DATA GENERATORS (Kept as placeholders for safe original content integration)
export const MOCK_CALENDAR_DAYS: CalendarDay[] = []; 

export const MOCK_PRAYERS: Prayer[] = [
    {
        id: 'p1', title: 'Rugăciunea Domnească (Placeholder)', category: 'morning', tags: ['basic'],
        text: '<p>Tatăl nostru...</p>', isPlaceholderOfficial: true
    },
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: 'a1', title: 'Cum să ținem postul', category: 'fasting', readingTimeMinutes: 5,
        body: 'Postul este o disciplină spirituală...'
    }
];

export const MOCK_AUDIO: AudioItem[] = [
    {
        id: 'au1', title: 'Rugăciunea de dimineață', description: 'Audio Demo', category: 'prayer', durationSeconds: 120,
        url: 'https://example.com/demo.mp3'
    }
];

export const MOCK_QUOTES: string[] = [
  '"Dobândește pacea și mii de oameni din jurul tău se vor mântui." - Sf. Serafim de Sarov',
  '"Pocăința este vindecarea memoriei." - Părintele Dumitru Stăniloae',
  '"Rugăciunea este respiraţia sufletului." - Sf. Siluan Athonitul',
];
