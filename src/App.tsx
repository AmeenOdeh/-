import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SurahIndex } from './components/SurahIndex';
import { QuranReader } from './components/QuranReader';
import { AudioPlayer } from './components/AudioPlayer';
import { TafsirModal } from './components/TafsirModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { QuranSearchModal } from './components/QuranSearchModal';
import { ArchitectureGuideModal } from './components/ArchitectureGuideModal';
import { BookmarkNoteModal } from './components/BookmarkNoteModal';

import { 
  SurahDetail, 
  Ayah, 
  ThemeMode, 
  QuranFont, 
  ViewMode, 
  Bookmark, 
  ReadingProgress,
  Reciter 
} from './types/quran';
import { SURAHS_LIST } from './data/surahs';
import { RECITERS_LIST } from './data/reciters';
import { fetchSurah } from './services/quranApi';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Theme & Reading settings (defaults to Sophisticated Dark)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('quran_theme') as ThemeMode) || 'dark';
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('quran_fontsize');
    return saved ? parseInt(saved, 10) : 26;
  });
  const [fontType, setFontType] = useState<QuranFont>('amiri-quran');
  const [viewMode, setViewMode] = useState<ViewMode>('surah');

  // Quran state
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(() => {
    const saved = localStorage.getItem('quran_last_surah');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [currentSurah, setCurrentSurah] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  // Audio state
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS_LIST[0]);

  // Bookmarks & Khatmah state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() => {
    try {
      const saved = localStorage.getItem('quran_reading_progress');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      lastSurah: 1,
      lastAyah: 1,
      lastPage: 1,
      timestamp: Date.now(),
      dailyGoalPages: 5,
      pagesReadToday: 0,
      lastDateString: new Date().toISOString().slice(0, 10),
    };
  });

  // Modals state
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);
  const [selectedBookmarkAyah, setSelectedBookmarkAyah] = useState<Ayah | null>(null);

  // Apply Theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia-mode');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia-mode');
    }
    localStorage.setItem('quran_theme', theme);
  }, [theme]);

  // Save font size
  useEffect(() => {
    localStorage.setItem('quran_fontsize', fontSize.toString());
  }, [fontSize]);

  // Save Bookmarks
  useEffect(() => {
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save Reading Progress
  useEffect(() => {
    localStorage.setItem('quran_reading_progress', JSON.stringify(readingProgress));
  }, [readingProgress]);

  // Load Surah details when currentSurahNumber changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingSurah(true);
    setErrorLoading(null);
    setIsPlaying(false);

    fetchSurah(currentSurahNumber)
      .then((data) => {
        if (isMounted) {
          setCurrentSurah(data);
          setIsLoadingSurah(false);
          localStorage.setItem('quran_last_surah', currentSurahNumber.toString());

          // Update reading progress page
          setReadingProgress((prev) => ({
            ...prev,
            lastSurah: currentSurahNumber,
            lastPage: data.pageStart,
            timestamp: Date.now(),
          }));
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorLoading('تعذر تحميل السورة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
          setIsLoadingSurah(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentSurahNumber]);

  // Handle Surah Selection with optional target Ayah
  const handleSelectSurah = (surahNum: number, targetAyahNumber?: number) => {
    setCurrentSurahNumber(surahNum);
    if (targetAyahNumber && targetAyahNumber > 0) {
      setCurrentAyahIndex(targetAyahNumber - 1);
    } else {
      setCurrentAyahIndex(0);
    }
  };

  const handleNextSurah = () => {
    if (currentSurahNumber < 114) {
      handleSelectSurah(currentSurahNumber + 1);
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahNumber > 1) {
      handleSelectSurah(currentSurahNumber - 1);
    }
  };

  // Play Ayah audio
  const handlePlayAyah = (index: number) => {
    setCurrentAyahIndex(index);
    setIsPlaying(true);
  };

  // Bookmark actions
  const handleAddBookmarkClick = (ayah: Ayah) => {
    // Open bookmark notes modal
    setSelectedBookmarkAyah(ayah);
  };

  const handleSaveBookmarkConfirmed = (data: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    page: number;
    text: string;
    note?: string;
    category?: 'daily' | 'memorize' | 'reflection' | 'general';
  }) => {
    const newBookmark: Bookmark = {
      id: `${data.surahNumber}_${data.ayahNumber}_${Date.now()}`,
      surahNumber: data.surahNumber,
      surahName: data.surahName,
      ayahNumber: data.ayahNumber,
      page: data.page,
      text: data.text,
      timestamp: Date.now(),
      note: data.note,
      category: data.category || 'daily',
    };

    setBookmarks((prev) => [newBookmark, ...prev.filter((b) => !(b.surahNumber === data.surahNumber && b.ayahNumber === data.ayahNumber))]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isAyahBookmarked = (globalAyahNumber: number) => {
    if (!currentSurah) return false;
    const ayah = currentSurah.ayahs.find((a) => a.number === globalAyahNumber);
    if (!ayah) return false;
    return bookmarks.some((b) => b.surahNumber === currentSurah.number && b.ayahNumber === ayah.numberInSurah);
  };

  const handleSelectBookmarkJump = (surahNum: number, ayahNum: number) => {
    handleSelectSurah(surahNum, ayahNum);
  };

  const handleUpdateDailyGoal = (pages: number) => {
    setReadingProgress((prev) => ({ ...prev, dailyGoalPages: pages }));
  };

  const handleLogDailyPages = (pages: number) => {
    setReadingProgress((prev) => ({
      ...prev,
      pagesReadToday: prev.pagesReadToday + pages,
      lastPage: Math.min(604, prev.lastPage + pages),
    }));
  };

  const currentSurahMeta = SURAHS_LIST.find((s) => s.number === currentSurahNumber) || SURAHS_LIST[0];
  const readingProgressPercent = (readingProgress.lastPage / 604) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf7] dark:bg-[#0A0C10] text-stone-800 dark:text-[#E0E0E0] selection:bg-[#D4AF37] selection:text-[#0A0C10] transition-colors duration-200" dir="rtl">
      {/* Top Navigation */}
      <Navbar
        currentSurahNumber={currentSurahNumber}
        currentSurahName={currentSurahMeta.name}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        fontType={fontType}
        onFontTypeChange={setFontType}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        bookmarksCount={bookmarks.length}
        readingProgressPercent={readingProgressPercent}
      />

      {/* Main Content Area */}
      <main className="flex-1 bg-[#fcfbf7] dark:bg-[#0A0C10]">
        {isLoadingSurah ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-[#A0AEC0]">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
            <span className="text-base font-semibold font-cairo text-[#E0E0E0]">جاري فتح {currentSurahMeta.name}...</span>
          </div>
        ) : errorLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-stone-800 dark:text-[#E0E0E0] mb-2">عذراً، حدث خطأ</h3>
            <p className="text-sm text-[#718096] max-w-md mb-4">{errorLoading}</p>
            <button
              onClick={() => handleSelectSurah(currentSurahNumber)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c59f2e] text-[#0A0C10] text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        ) : currentSurah ? (
          <QuranReader
            surah={currentSurah}
            currentAyahIndex={currentAyahIndex}
            isPlaying={isPlaying}
            onPlayAyah={handlePlayAyah}
            onOpenTafsir={(ayah) => setSelectedTafsirAyah(ayah)}
            onAddBookmark={handleAddBookmarkClick}
            isBookmarked={isAyahBookmarked}
            fontSize={fontSize}
            fontType={fontType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onNextSurah={handleNextSurah}
            onPrevSurah={handlePrevSurah}
          />
        ) : null}
      </main>

      {/* Persistent Audio Player */}
      {currentSurah && (
        <AudioPlayer
          currentSurahNumber={currentSurah.number}
          currentSurahName={currentSurah.name}
          currentAyahIndex={currentAyahIndex}
          ayahs={currentSurah.ayahs}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
          onAyahChange={setCurrentAyahIndex}
          onSurahComplete={() => {
            if (currentSurahNumber < 114) {
              handleSelectSurah(currentSurahNumber + 1);
            }
          }}
          selectedReciter={selectedReciter}
          onReciterChange={setSelectedReciter}
        />
      )}

      {/* Modals & Drawers */}
      <SurahIndex
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onSelectSurah={handleSelectSurah}
        currentSurahNumber={currentSurahNumber}
        lastReadSurah={readingProgress.lastSurah}
        lastReadAyah={readingProgress.lastAyah}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onSelectBookmark={handleSelectBookmarkJump}
        readingProgress={readingProgress}
        onUpdateDailyGoal={handleUpdateDailyGoal}
        onLogDailyPages={handleLogDailyPages}
      />

      <QuranSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSurah}
      />

      <ArchitectureGuideModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <TafsirModal
        isOpen={!!selectedTafsirAyah}
        onClose={() => setSelectedTafsirAyah(null)}
        surahNumber={currentSurahNumber}
        surahName={currentSurahMeta.name}
        ayah={selectedTafsirAyah}
        totalAyahs={currentSurah?.ayahs.length || 0}
        onNavigateAyah={(newIdx) => {
          if (currentSurah && newIdx >= 0 && newIdx < currentSurah.ayahs.length) {
            setSelectedTafsirAyah(currentSurah.ayahs[newIdx]);
          }
        }}
        onPlayAyah={(idx) => {
          handlePlayAyah(idx);
          setSelectedTafsirAyah(null);
        }}
      />

      <BookmarkNoteModal
        isOpen={!!selectedBookmarkAyah}
        onClose={() => setSelectedBookmarkAyah(null)}
        ayah={selectedBookmarkAyah}
        surahName={currentSurahMeta.name}
        surahNumber={currentSurahNumber}
        onSaveBookmark={handleSaveBookmarkConfirmed}
      />
    </div>
  );
}
