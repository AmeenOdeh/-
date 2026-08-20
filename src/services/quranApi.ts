import { Ayah, SurahDetail, TafsirSource } from '../types/quran';
import { SURAHS_LIST } from '../data/surahs';
import { OFFLINE_SURAHS_SAMPLE } from '../data/offlineSampleData';

const cache: Map<string, any> = new Map();

// LocalStorage cache helper
const getStoredCache = (key: string) => {
  try {
    const item = localStorage.getItem(`quran_cache_${key}`);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

const setStoredCache = (key: string, data: any) => {
  try {
    localStorage.setItem(`quran_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    // Storage might be full, silent ignore
  }
};

export async function fetchSurah(surahNumber: number, tafsirId: string = 'ar.muyassar'): Promise<SurahDetail> {
  const meta = SURAHS_LIST.find((s) => s.number === surahNumber) || SURAHS_LIST[0];
  const cacheKey = `surah_${surahNumber}_${tafsirId}`;

  // Check in-memory cache
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Check localStorage cache
  const stored = getStoredCache(cacheKey);
  if (stored) {
    cache.set(cacheKey, stored);
    return stored;
  }

  try {
    // Fetch Quran text (Uthmani) and Tafsir in parallel
    const [textRes, tafsirRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${tafsirId}`).catch(() => null)
    ]);

    if (!textRes.ok) {
      throw new Error(`Failed to load surah ${surahNumber}`);
    }

    const textData = await textRes.json();
    let tafsirData = null;
    if (tafsirRes && tafsirRes.ok) {
      tafsirData = await tafsirRes.json();
    }

    const rawAyahs = textData.data.ayahs;
    const rawTafsirAyahs = tafsirData?.data?.ayahs || [];

    const ayahs: Ayah[] = rawAyahs.map((ayah: any, index: number) => {
      let cleanText = ayah.text;
      // If surah is not Al-Fatiha and it starts with Bismillah in ayah 1, clean duplicate prefix if needed
      if (surahNumber !== 1 && surahNumber !== 9 && index === 0) {
        if (cleanText.startsWith("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ")) {
          cleanText = cleanText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ", "");
        } else if (cleanText.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ")) {
          cleanText = cleanText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ", "");
        }
      }

      return {
        number: ayah.number,
        text: cleanText,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        manzil: ayah.manzil,
        page: ayah.page,
        ruku: ayah.ruku,
        hizbQuarter: ayah.hizbQuarter,
        sajda: ayah.sajda,
        tafsir: rawTafsirAyahs[index]?.text || "التفسير غير متوفر لهذه الآية حالياً"
      };
    });

    const surahDetail: SurahDetail = {
      ...meta,
      ayahs,
      bismillahPre: surahNumber !== 1 && surahNumber !== 9
    };

    cache.set(cacheKey, surahDetail);
    setStoredCache(cacheKey, surahDetail);
    return surahDetail;
  } catch (error) {
    console.warn(`Network fetch failed for surah ${surahNumber}, checking offline fallback:`, error);
    
    // Check fallback sample
    if (OFFLINE_SURAHS_SAMPLE[surahNumber]) {
      const fallback: SurahDetail = {
        ...meta,
        ayahs: OFFLINE_SURAHS_SAMPLE[surahNumber].ayahs,
        bismillahPre: surahNumber !== 1 && surahNumber !== 9
      };
      return fallback;
    }

    throw error;
  }
}

export async function fetchAyahTafsir(surahNumber: number, ayahNumberInSurah: number, tafsirId: string = 'ar.muyassar'): Promise<string> {
  const cacheKey = `ayah_tafsir_${surahNumber}_${ayahNumberInSurah}_${tafsirId}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumberInSurah}/${tafsirId}`);
    if (!res.ok) throw new Error("Tafsir not found");
    const json = await res.json();
    const tafsirText = json.data?.text || "التفسير غير متوفر حالياً";
    cache.set(cacheKey, tafsirText);
    return tafsirText;
  } catch (e) {
    return "تعذر تحميل التفسير. يرجى التحقق من اتصال الإنترنت.";
  }
}

export interface SearchResultItem {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
}

export async function searchQuranText(query: string): Promise<SearchResultItem[]> {
  if (!query || query.trim().length < 2) return [];
  const cleanQuery = query.trim();

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(cleanQuery)}/all/ar`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status === 'OK' && data.data?.matches) {
      return data.data.matches.map((m: any) => ({
        number: m.number,
        text: m.text,
        numberInSurah: m.numberInSurah,
        surah: {
          number: m.surah.number,
          name: m.surah.name,
          englishName: m.surah.englishName
        }
      }));
    }
    return [];
  } catch (e) {
    console.error("Search failed:", e);
    return [];
  }
}
