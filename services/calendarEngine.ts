
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

// --- HELPER: DATE CALCULATIONS ---

/**
 * Returns the number of days difference between two dates (date - baseline).
 */
export const getDaysDifference = (date: Date, baseline: Date): number => {
  // Normalize to start of day to avoid DST issues
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const b = new Date(baseline.getFullYear(), baseline.getMonth(), baseline.getDate());
  const diffTime = d.getTime() - b.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
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

// --- 3. ROBUST FASTING HELPERS ---

/**
 * Checks if a date falls within Great Lent (Postul Mare).
 * Defined as: Clean Monday (-48 days from Pascha) up to Holy Saturday (-1 day).
 */
export const isGreatLent = (date: Date, pascha: Date): boolean => {
  const diff = getDaysDifference(date, pascha);
  return diff >= -48 && diff < 0;
};

/**
 * Checks if a date falls within the Nativity Fast (Postul Crăciunului).
 * Fixed period: November 15 to December 24.
 */
export const isNativityFast = (date: Date): boolean => {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  // Nov (10) 15-30 or Dec (11) 1-24
  if (month === 10 && day >= 15) return true;
  if (month === 11 && day <= 24) return true;
  return false;
};

/**
 * Checks if a date falls within the Dormition Fast (Postul Adormirii Maicii Domnului).
 * Fixed period: August 1 to August 14.
 */
export const isDormitionFast = (date: Date): boolean => {
  const month = date.getMonth(); // 7 = Aug
  const day = date.getDate();
  return month === 7 && day >= 1 && day <= 14;
};

/**
 * Checks if a date falls within the Apostles' Fast (Postul Sfinților Petru și Pavel).
 * Start: Monday after All Saints (Pascha + 57 days).
 * End: June 28 (Fixed).
 */
export const isApostlesFast = (date: Date, pascha: Date): boolean => {
  const startFast = new Date(pascha);
  startFast.setDate(pascha.getDate() + 57);

  // Normalize current date
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(startFast.getFullYear(), startFast.getMonth(), startFast.getDate());
  
  // End date is June 28 of current year
  const end = new Date(date.getFullYear(), 5, 29); // June 29 is Feast, so fast is < June 29 (through 28)

  return current >= start && current < end;
};

/**
 * Checks if a date is a Harți (Fast-Free) day.
 * 1. Christmas -> Epiphany Eve (Dec 25 - Jan 4)
 * 2. Week after Publican & Pharisee (Pascha - 69 to -63 approx)
 * 3. Bright Week (Pascha + 1 to + 6)
 * 4. Trinity Week (Pascha + 50 to + 56)
 */
export const isHarti = (date: Date, pascha: Date): boolean => {
  const diff = getDaysDifference(date, pascha);
  const month = date.getMonth();
  const day = date.getDate();

  // 1. Christmas period (Dec 25 - Jan 4)
  if ((month === 11 && day >= 25) || (month === 0 && day <= 4)) return true;

  // 2. Week after Publican & Pharisee (Triodion starts -70, Sunday. Week following is fast free)
  if (diff >= -69 && diff < -62) return true;

  // 3. Bright Week (Săptămâna Luminată)
  if (diff > 0 && diff < 7) return true;

  // 4. Trinity Week (Săptămâna de după Rusalii)
  if (diff >= 50 && diff < 57) return true;

  return false;
};


// --- 4. CORE ENGINE GENERATION ---

// Helper: Format YYYY-MM-DD
const formatDateStr = (date: Date) => date.toISOString().split('T')[0];

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
      saints.push(`Saint of ${dateStr}`);
    }

    if (dayOfWeek === 0 && importance === 'normal') {
      importance = 'sunday';
      feastName = feastName ? `${feastName} (Sunday)` : `Sunday Liturgy`;
    }

    // --- B. Identify Movable Feasts relative to Pascha ---
    const diffDays = getDaysDifference(current, pascha);

    if (diffDays === -48) { feastName = 'Start of Great Lent (Clean Monday)'; isFastDay = true; fastType = 'strict_fast'; importance='high_feast'; }
    else if (diffDays === -7) { feastName = 'Floriile (Palm Sunday)'; importance = 'high_feast'; isFastDay = true; fastType = 'fast_with_fish'; }
    else if (diffDays === -2) { feastName = 'Vinerea Mare (Great Friday)'; importance = 'high_feast'; isFastDay = true; fastType = 'strict_fast'; }
    else if (diffDays === -1) { feastName = 'Sâmbăta Mare'; importance = 'high_feast'; isFastDay = true; fastType = 'strict_fast'; }
    else if (diffDays === 0) { feastName = 'ÎNVIEREA DOMNULUI (PAȘTI)'; importance = 'high_feast'; isFastDay = false; fastType = 'no_fast'; }
    else if (diffDays > 0 && diffDays < 7) { feastName = 'Săptămâna Luminată'; isFastDay = false; fastType = 'no_fast'; }
    else if (diffDays === 39) { feastName = 'Înălțarea Domnului'; importance = 'high_feast'; }
    else if (diffDays === 49) { feastName = 'Pogorârea Sf. Duh (Rusalii)'; importance = 'high_feast'; }
    else if (diffDays === 50) { feastName = 'Sf. Treime'; importance = 'high_feast'; }
    
    // --- C. Fasting Logic ---
    
    // 1. Great Lent
    if (isGreatLent(current, pascha)) {
      isFastDay = true;
      fastType = 'fast_without_oil';
      // Weekends in Lent (except Holy Sat) -> Wine/Oil
      if ((dayOfWeek === 0 || dayOfWeek === 6) && diffDays !== -1) {
        fastType = 'fast_with_oil';
      }
      if (diffDays === -7) fastType = 'fast_with_fish'; // Palm Sunday
    }

    // 2. Nativity Fast
    if (isNativityFast(current)) {
       isFastDay = true;
       fastType = 'fast_without_oil';
       // Nov 15 - Dec 17 roughly allows fish on Sat/Sun
       const isLateAdvent = (current.getMonth() === 11 && current.getDate() >= 18);
       if ((dayOfWeek === 0 || dayOfWeek === 6) && !isLateAdvent) {
          fastType = 'fast_with_fish';
       } else if ((dayOfWeek === 0 || dayOfWeek === 6)) {
          fastType = 'fast_with_oil';
       }
       
       // Fixed Feast overrides for Fish in Advent
       if (['11-21', '11-30', '12-06'].includes(mmdd)) {
         fastType = 'fast_with_fish';
       }
    }

    // 3. Dormition Fast
    if (isDormitionFast(current)) {
      isFastDay = true;
      fastType = 'fast_without_oil';
      if (dayOfWeek === 0 || dayOfWeek === 6) fastType = 'fast_with_oil';
      if (mmdd === '08-06') fastType = 'fast_with_fish'; // Transfiguration
    }

    // 4. Apostles Fast
    if (isApostlesFast(current, pascha)) {
       isFastDay = true;
       fastType = 'fast_without_oil';
       if (dayOfWeek === 0 || dayOfWeek === 6) fastType = 'fast_with_fish'; 
    }

    // 5. Standard Wed/Fri Rule
    if (!isFastDay && fastType !== 'no_fast') {
      if (dayOfWeek === 3 || dayOfWeek === 5) {
        // Check Harți
        if (isHarti(current, pascha)) {
          isFastDay = false;
          fastType = 'no_fast';
        } else {
          isFastDay = true;
          fastType = 'fast_without_oil';
        }
      }
    }

    // --- D. Final Overrides from Fixed Dictionary ---
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
      descriptionShort: `${importance === 'high_feast' ? 'A major feast of the Church.' : 'Daily commemoration.'} ${isFastDay ? 'Fasting is prescribed.' : ''}`,
      saints: saints.length > 0 ? saints : ['Holy Martyrs and Confessors'],
      readings: dayOfWeek === 0 ? ['Epistle: Rom. 1', 'Gospel: Matt. 1'] : undefined
    });
  }

  return days;
};

// --- 5. PUBLIC API ---

export const getCalendarDay = (date: Date, tradition: CountryTradition = 'RO'): CalendarDay => {
  const year = date.getFullYear();
  const yearData = generateCalendarDataForYear(year, tradition);
  const dateStr = formatDateStr(date);
  return yearData.find(d => d.date === dateStr) || yearData[0];
};

export const getCalendarMonthData = (year: number, month: number, tradition: CountryTradition = 'RO'): CalendarDay[] => {
  const yearData = generateCalendarDataForYear(year, tradition);
  const str = `${year}-${String(month + 1).padStart(2, '0')}`;
  return yearData.filter(d => d.date.startsWith(str));
};
