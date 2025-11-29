
import { CalendarDay, CountryTradition, FastType, ImportanceLevel } from '../types';

/**
 * ORTHODOX CALENDAR ENGINE (BOR FOCUS)
 * 
 * This engine calculates:
 * 1. Orthodox Pascha (Julian -> Gregorian)
 * 2. Movable Feasts (Palm Sunday, Ascension, Pentecost, etc.)
 * 3. Fixed Feasts for Romanian Orthodox Church
 * 4. Fasting Rules (Lent, Nativity, Dormition, Wed/Fri, Harți)
 * 
 * @author Orthodox Compass AI
 */

// --- 1. PASCHA CALCULATION ---

/**
 * Calculates Orthodox Pascha for a given year.
 * Algorithm: Meeus/Jones/Butcher for Julian Easter, converted to Gregorian.
 */
export const getOrthodoxPascha = (year: number): Date => {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;

  // This result is in the Julian Calendar.
  // We must add the secular difference (13 days for 1900-2099) to get Gregorian.
  const julianDate = new Date(year, month - 1, day);
  const offset = 13; 
  julianDate.setDate(julianDate.getDate() + offset);
  
  return julianDate;
};

// --- 2. FIXED FEASTS DATA (RO) ---
// Key format: "MM-DD"
interface FixedFeastDef {
  name: string;
  importance: ImportanceLevel;
  forceFastType?: FastType; // e.g. Beheading of St John is strict fast
}

const FIXED_FEASTS_RO: Record<string, FixedFeastDef> = {
  '01-01': { name: 'Tăierea Împrejur; Sf. Vasile cel Mare', importance: 'high_feast' },
  '01-06': { name: 'Botezul Domnului (Boboteaza)', importance: 'high_feast', forceFastType: 'no_fast' }, // Harți usually
  '01-07': { name: 'Soborul Sf. Ioan Botezătorul', importance: 'high_feast' },
  '01-30': { name: 'Sf. Trei Ierarhi', importance: 'high_feast' },
  '02-02': { name: 'Întâmpinarea Domnului', importance: 'high_feast' },
  '03-25': { name: 'Buna Vestire', importance: 'high_feast', forceFastType: 'fast_with_fish' },
  '04-23': { name: 'Sf. M. Mc. Gheorghe', importance: 'high_feast' },
  '05-21': { name: 'Sf. Împărați Constantin și Elena', importance: 'high_feast' },
  '06-24': { name: 'Nașterea Sf. Ioan Botezătorul', importance: 'high_feast' }, // Sânzienele
  '06-29': { name: 'Sf. Ap. Petru și Pavel', importance: 'high_feast' },
  '07-20': { name: 'Sf. Prooroc Ilie Tesviteanul', importance: 'high_feast' },
  '08-06': { name: 'Schimbarea la Față', importance: 'high_feast', forceFastType: 'fast_with_fish' },
  '08-15': { name: 'Adormirea Maicii Domnului', importance: 'high_feast' },
  '08-29': { name: 'Tăierea capului Sf. Ioan Botezătorul', importance: 'high_feast', forceFastType: 'strict_fast' },
  '09-08': { name: 'Nașterea Maicii Domnului', importance: 'high_feast' },
  '09-14': { name: 'Înălțarea Sfintei Cruci', importance: 'high_feast', forceFastType: 'strict_fast' },
  '10-14': { name: 'Sf. Cuv. Parascheva', importance: 'high_feast' },
  '10-26': { name: 'Sf. M. Mc. Dimitrie', importance: 'high_feast' },
  '10-27': { name: 'Sf. Cuv. Dimitrie cel Nou', importance: 'high_feast' },
  '11-08': { name: 'Sf. Arh. Mihail și Gavriil', importance: 'high_feast' },
  '11-21': { name: 'Intrarea în Biserică a Maicii Domnului', importance: 'high_feast', forceFastType: 'fast_with_fish' },
  '11-30': { name: 'Sf. Ap. Andrei (Ocrotitorul României)', importance: 'high_feast', forceFastType: 'fast_with_fish' },
  '12-06': { name: 'Sf. Ierarh Nicolae', importance: 'high_feast', forceFastType: 'fast_with_fish' },
  '12-25': { name: 'Nașterea Domnului (Crăciunul)', importance: 'high_feast', forceFastType: 'no_fast' },
  '12-26': { name: 'Soborul Maicii Domnului', importance: 'high_feast', forceFastType: 'no_fast' },
  '12-27': { name: 'Sf. Arhidiacon Ștefan', importance: 'high_feast', forceFastType: 'no_fast' },
};

// --- 3. CORE ENGINE LOGIC ---

// Helper: Add days to date
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper: Format YYYY-MM-DD
const formatDateStr = (date: Date) => date.toISOString().split('T')[0];

// Helper: Get Day of Year (0-365) - useful for fast ranges?
// Actually simpler to just compare Date objects.

export const generateCalendarDataForYear = (year: number, tradition: CountryTradition = 'RO'): CalendarDay[] => {
  if (tradition !== 'RO') {
    console.warn("Engine currently optimized for RO. Fallback or generic logic applied for others.");
  }

  const pascha = getOrthodoxPascha(year);
  const days: CalendarDay[] = [];

  // Generate every day of the year
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  for (let d = new Date(startOfYear); d <= endOfYear; d.setDate(d.getDate() + 1)) {
    const current = new Date(d);
    const dateStr = formatDateStr(current);
    const mmdd = `${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    const dayOfWeek = current.getDay(); // 0 = Sun

    let feastName = '';
    let importance: ImportanceLevel = 'normal';
    let isFastDay = false;
    let fastType: FastType = 'no_fast';
    let description = '';
    let saints: string[] = [];

    // --- A. Identify Fixed Feast ---
    if (FIXED_FEASTS_RO[mmdd]) {
      const f = FIXED_FEASTS_RO[mmdd];
      feastName = f.name;
      importance = f.importance;
    } else {
      // Placeholder saints for normal days
      saints.push(`Saint of ${dateStr}`);
    }

    if (dayOfWeek === 0 && importance === 'normal') {
      importance = 'sunday';
      feastName = feastName ? `${feastName} (Sunday)` : `Sunday Liturgy`;
    }

    // --- B. Identify Movable Feasts relative to Pascha ---
    const diffTime = current.getTime() - pascha.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === -48) { feastName = 'Start of Great Lent (Clean Monday)'; isFastDay = true; fastType = 'strict_fast'; importance='high_feast'; }
    else if (diffDays === -7) { feastName = 'Floriile (Palm Sunday)'; importance = 'high_feast'; isFastDay = true; fastType = 'fast_with_fish'; } // Fish allowed
    else if (diffDays === -2) { feastName = 'Vinerea Mare (Great Friday)'; importance = 'high_feast'; isFastDay = true; fastType = 'strict_fast'; }
    else if (diffDays === -1) { feastName = 'Sâmbăta Mare'; importance = 'high_feast'; isFastDay = true; fastType = 'strict_fast'; }
    else if (diffDays === 0) { feastName = 'ÎNVIEREA DOMNULUI (PAȘTI)'; importance = 'high_feast'; isFastDay = false; fastType = 'no_fast'; }
    else if (diffDays > 0 && diffDays < 7) { feastName = 'Săptămâna Luminată'; isFastDay = false; fastType = 'no_fast'; } // Bright week
    else if (diffDays === 39) { feastName = 'Înălțarea Domnului'; importance = 'high_feast'; } // Always Thursday
    else if (diffDays === 49) { feastName = 'Pogorârea Sf. Duh (Rusalii)'; importance = 'high_feast'; }
    else if (diffDays === 50) { feastName = 'Sf. Treime'; importance = 'high_feast'; }
    
    // --- C. Fasting Logic ---
    
    // 1. Great Lent (Pascha - 48 to Pascha - 1)
    if (diffDays >= -48 && diffDays < 0) {
      isFastDay = true;
      fastType = 'fast_without_oil'; // Default for Lent
      
      // Weekends in Lent (except Holy Sat) -> Wine/Oil
      if ((dayOfWeek === 0 || dayOfWeek === 6) && diffDays !== -1) {
        fastType = 'fast_with_oil';
      }
      
      // Override for specific movable feasts handled above (Palm Sunday etc)
      if (diffDays === -7) fastType = 'fast_with_fish';
    }

    // 2. Nativity Fast (Nov 15 - Dec 24)
    // Simple logic:
    // Nov 15 - Dec 17: Fish on Sat/Sun.
    // Dec 18 - Dec 24: No Fish, Wine/Oil on Sat/Sun.
    // Wed/Fri usually no oil unless red cross.
    if ((current.getMonth() === 10 && current.getDate() >= 15) || (current.getMonth() === 11 && current.getDate() <= 24)) {
       isFastDay = true;
       fastType = 'fast_without_oil';
       
       const isLateAdvent = (current.getMonth() === 11 && current.getDate() >= 18);
       
       if (dayOfWeek === 0 || dayOfWeek === 6) {
          fastType = isLateAdvent ? 'fast_with_oil' : 'fast_with_fish';
       }
       
       // Fixed Feast overrides for Fish in Advent
       if (['11-21', '11-30', '12-06'].includes(mmdd)) {
         fastType = 'fast_with_fish';
       }
    }

    // 3. Dormition Fast (Aug 1 - 14)
    if (current.getMonth() === 7 && current.getDate() >= 1 && current.getDate() <= 14) {
      isFastDay = true;
      fastType = 'fast_without_oil';
      if (dayOfWeek === 0 || dayOfWeek === 6) fastType = 'fast_with_oil';
      if (mmdd === '08-06') fastType = 'fast_with_fish'; // Transfiguration
    }

    // 4. Apostles Fast (Mon after All Saints -> Jun 28)
    // All Saints is Pentecost + 7 days = Pascha + 56 days.
    // Fast starts Pascha + 57.
    const apostlesFastStart = 57;
    // End date is fixed Jun 28 (Jun 29 is feast).
    const endApostles = new Date(year, 5, 29); // June 29
    // Current compared to Jun 29
    // Warning: sometimes Fast can be 0 days if Pascha is very late.
    if (diffDays >= apostlesFastStart && current < endApostles) {
       isFastDay = true;
       fastType = 'fast_without_oil';
       if (dayOfWeek === 0 || dayOfWeek === 6) fastType = 'fast_with_fish'; // Permissive fast
    }

    // 5. Standard Wed/Fri Rule (Outside of major fasts handled above)
    // Only apply if not already marked as fast (to avoid overwriting Lent logic) or explicitly non-fast
    if (!isFastDay && fastType !== 'no_fast') {
      if (dayOfWeek === 3 || dayOfWeek === 5) {
        isFastDay = true;
        fastType = 'fast_without_oil';
        
        // Check Harți (Harți days override)
        // Christmas-Epiphany: Dec 25 - Jan 5 (No fast)
        if (
             (current.getMonth() === 11 && current.getDate() >= 25) || 
             (current.getMonth() === 0 && current.getDate() <= 5)
           ) {
          isFastDay = false;
          fastType = 'no_fast';
        }
        
        // Week after Pentecost (diffDays 50-56)
        if (diffDays >= 50 && diffDays <= 56) {
           isFastDay = false;
           fastType = 'no_fast';
        }

        // Publican & Pharisee (10 weeks before Pascha - week 1) -> -70 days approx
        // Cheese fare week (Dairy allowed) -> -56 to -49
      }
    }

    // --- D. Final Overrides from Fixed Dictionary ---
    // (e.g. 14 Sept is always strict fast, 29 Aug strict fast)
    if (FIXED_FEASTS_RO[mmdd]) {
      const fixed = FIXED_FEASTS_RO[mmdd];
      if (fixed.forceFastType) {
        if (fixed.forceFastType === 'no_fast') {
          isFastDay = false;
          fastType = 'no_fast';
        } else {
          isFastDay = true;
          fastType = fixed.forceFastType;
        }
      }
    }

    // Construct Day Object
    days.push({
      id: `${dateStr}-${tradition}`,
      date: dateStr,
      tradition,
      feastName: feastName || (isFastDay ? (dayOfWeek===5 ? 'Friday Fast' : 'Fasting Day') : 'Feria'),
      isFastDay,
      fastType,
      importanceLevel: importance,
      descriptionShort: `${importance === 'high_feast' ? 'A major feast of the Church.' : 'Daily commemoration of saints.'} ${isFastDay ? 'Fasting is prescribed.' : ''}`,
      saints: saints.length > 0 ? saints : ['Holy Martyrs and Confessors'],
      readings: dayOfWeek === 0 ? ['Epistle: Rom. 1', 'Gospel: Matt. 1'] : undefined
    });
  }

  return days;
};

// --- 4. PUBLIC API ---

export const getCalendarDay = (date: Date, tradition: CountryTradition = 'RO'): CalendarDay => {
  const year = date.getFullYear();
  // In a real optimized app, we would cache the year data.
  // For this demo, we generate the year and find the day.
  const yearData = generateCalendarDataForYear(year, tradition);
  const dateStr = formatDateStr(date);
  return yearData.find(d => d.date === dateStr) || yearData[0]; // Fallback safe
};

export const getCalendarMonthData = (year: number, month: number, tradition: CountryTradition = 'RO'): CalendarDay[] => {
  const yearData = generateCalendarDataForYear(year, tradition);
  const str = `${year}-${String(month + 1).padStart(2, '0')}`;
  return yearData.filter(d => d.date.startsWith(str));
};
