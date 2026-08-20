export type RevelationType = 'Meccan' | 'Medinan';

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  pageStart: number;
  juzStart: number;
  rukus: number;
}

export interface Ayah {
  number: number; // Global ayah number (1 to 6236)
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  audio?: string;
  tafsir?: string;
  translation?: string;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
  bismillahPre?: boolean;
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  serverUrlFormat: string; // url generator template or identifier
  subfolder?: string;
}

export interface TafsirSource {
  id: string;
  name: string;
  author: string;
  language: string;
  slug: string;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  page: number;
  text: string;
  timestamp: number;
  note?: string;
  color?: string;
  category?: 'daily' | 'memorize' | 'reflection' | 'general';
}

export interface ReadingProgress {
  lastSurah: number;
  lastAyah: number;
  lastPage: number;
  timestamp: number;
  dailyGoalPages: number;
  pagesReadToday: number;
  lastDateString: string;
}

export type ViewMode = 'surah' | 'page' | 'continuous';
export type ThemeMode = 'light' | 'sepia' | 'dark';
export type QuranFont = 'amiri-quran' | 'scheherazade' | 'cairo';
