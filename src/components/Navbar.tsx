import React from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Search, 
  Sun, 
  Moon, 
  Coffee, 
  Type, 
  Code2, 
  List, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { ThemeMode, QuranFont } from '../types/quran';

interface NavbarProps {
  currentSurahNumber: number;
  currentSurahName: string;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontType: QuranFont;
  onFontTypeChange: (font: QuranFont) => void;
  onOpenIndex: () => void;
  onOpenBookmarks: () => void;
  onOpenSearch: () => void;
  onOpenArchitecture: () => void;
  bookmarksCount: number;
  readingProgressPercent: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSurahNumber,
  currentSurahName,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  fontType,
  onFontTypeChange,
  onOpenIndex,
  onOpenBookmarks,
  onOpenSearch,
  onOpenArchitecture,
  bookmarksCount,
  readingProgressPercent,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[#fcfbf7]/90 dark:bg-[#0F1218]/95 border-b border-stone-200/80 dark:border-[#222933] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left Side: Brand & Index Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-open-surah-index"
            onClick={onOpenIndex}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-[#D4AF37] dark:hover:bg-[#c59f2e] text-white dark:text-[#0A0C10] shadow-xs hover:shadow transition-all text-xs sm:text-sm font-bold active:scale-95 cursor-pointer"
            title="فهرس السور والأجزاء"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">فهرس السور</span>
          </button>

          <div 
            onClick={onOpenIndex}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-[#D4AF37] dark:to-[#997a15] text-white dark:text-[#0A0C10] flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
              📖
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-[#D4AF37] leading-tight font-cairo flex items-center gap-1.5 font-serif">
                القرآن الكريم
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#D4AF37]/15 text-emerald-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30 font-normal hidden md:inline">
                  مصحف التلاوة
                </span>
              </h1>
              <span className="text-xs text-stone-500 dark:text-[#A0AEC0] truncate max-w-[130px] sm:max-w-[200px]">
                {currentSurahName || 'اختر سورة'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Khatmah progress mini pill on large screens */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-[#1A1F26] border border-stone-200 dark:border-[#2D3540] text-xs text-stone-600 dark:text-[#A0AEC0]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" />
          <span>إنجاز الختمة:</span>
          <div className="w-20 h-2 bg-stone-200 dark:bg-[#0A0C10] rounded-full overflow-hidden border dark:border-[#222933]">
            <div 
              className="h-full bg-emerald-600 dark:bg-[#D4AF37] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]" 
              style={{ width: `${Math.min(100, Math.max(0, readingProgressPercent))}%` }}
            />
          </div>
          <span className="font-semibold text-emerald-700 dark:text-[#D4AF37] font-mono">
            {Math.round(readingProgressPercent)}%
          </span>
        </div>

        {/* Right Side: Tools, Search, Bookmarks, Theme & Architecture */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Search */}
          <button
            id="btn-nav-search"
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-100 dark:hover:bg-[#1A1F26] dark:hover:text-white flex items-center gap-1.5 text-sm transition-colors border border-transparent dark:hover:border-[#2D3540]"
            title="بحث في آيات القرآن الكريم"
          >
            <Search className="w-4 h-4 text-emerald-600 dark:text-[#D4AF37]" />
            <span className="hidden md:inline">بحث</span>
          </button>

          {/* Bookmarks */}
          <button
            id="btn-nav-bookmarks"
            onClick={onOpenBookmarks}
            className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-100 dark:hover:bg-[#1A1F26] dark:hover:text-white flex items-center gap-1.5 text-sm transition-colors border border-transparent dark:hover:border-[#2D3540]"
            title="الفواصل والعلامات المرجعية"
          >
            <Bookmark className="w-4 h-4 text-amber-600 dark:text-[#D4AF37]" />
            <span className="hidden md:inline">الفواصل</span>
            {bookmarksCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10]">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Font Size Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-stone-100 dark:bg-[#1A1F26] p-1 rounded-xl border border-stone-200 dark:border-[#2D3540]">
            <button
              id="btn-font-decrease"
              onClick={() => onFontSizeChange(Math.max(18, fontSize - 2))}
              className="px-2 py-1 text-xs font-semibold text-stone-700 dark:text-[#A0AEC0] hover:bg-white dark:hover:bg-[#222933] dark:hover:text-white rounded-lg transition-colors"
              title="تصغير حجم الخط"
            >
              أ-
            </button>
            <span className="text-xs font-mono text-stone-500 dark:text-[#718096] px-1">{fontSize}</span>
            <button
              id="btn-font-increase"
              onClick={() => onFontSizeChange(Math.min(48, fontSize + 2))}
              className="px-2 py-1 text-xs font-semibold text-stone-700 dark:text-[#A0AEC0] hover:bg-white dark:hover:bg-[#222933] dark:hover:text-white rounded-lg transition-colors"
              title="تكبير حجم الخط"
            >
              أ+
            </button>
          </div>

          {/* Theme Switcher (Light / Sepia / Dark) */}
          <div className="flex items-center bg-stone-100 dark:bg-[#1A1F26] p-1 rounded-xl border border-stone-200 dark:border-[#2D3540]">
            <button
              id="theme-light-btn"
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light' 
                  ? 'bg-white text-amber-600 shadow-xs' 
                  : 'text-stone-500 hover:text-stone-800 dark:text-[#718096] dark:hover:text-stone-200'
              }`}
              title="الوضع النهاري"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-sepia-btn"
              onClick={() => onThemeChange('sepia')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'sepia' 
                  ? 'bg-[#f4ecd8] text-amber-900 shadow-xs' 
                  : 'text-stone-500 hover:text-stone-800 dark:text-[#718096] dark:hover:text-stone-200'
              }`}
              title="وضع القراءة الدافئ (سيبيا)"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-dark-btn"
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark' 
                  ? 'bg-[#D4AF37] text-[#0A0C10] shadow-xs font-bold' 
                  : 'text-stone-500 hover:text-stone-800 dark:text-[#718096] dark:hover:text-stone-200'
              }`}
              title="الوضع الليلي الفاخر (Sophisticated Dark)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Architecture & Code Guide modal button */}
          <button
            id="btn-open-architecture-guide"
            onClick={onOpenArchitecture}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-200/70 hover:bg-stone-300 dark:bg-[#1A1F26] dark:hover:bg-[#222933] text-stone-700 dark:text-[#E0E0E0] border border-transparent dark:border-[#2D3540] flex items-center gap-1.5 text-xs font-semibold transition-colors"
            title="الهيكل البرمجي وخطة المشروع"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#D4AF37]" />
            <span className="hidden sm:inline">دليل البناء والـ API</span>
          </button>
        </div>
      </div>
    </header>
  );
};
