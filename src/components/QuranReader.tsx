import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  BookOpen, 
  Bookmark, 
  Copy, 
  Check, 
  Share2, 
  Repeat, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Layers,
  FileText,
  Volume2
} from 'lucide-react';
import { SurahDetail, Ayah, ViewMode, QuranFont } from '../types/quran';

interface QuranReaderProps {
  surah: SurahDetail;
  currentAyahIndex: number;
  isPlaying: boolean;
  onPlayAyah: (index: number) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  onAddBookmark: (ayah: Ayah) => void;
  isBookmarked: (ayahNumber: number) => boolean;
  fontSize: number;
  fontType: QuranFont;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  surah,
  currentAyahIndex,
  isPlaying,
  onPlayAyah,
  onOpenTafsir,
  onAddBookmark,
  isBookmarked,
  fontSize,
  fontType,
  viewMode,
  onViewModeChange,
  onNextSurah,
  onPrevSurah,
}) => {
  const [selectedAyahForMenu, setSelectedAyahForMenu] = useState<Ayah | null>(null);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const activeAyahRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll active ayah into view during audio playback
  useEffect(() => {
    if (isPlaying && activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentAyahIndex, isPlaying]);

  const handleCopyAyah = (ayah: Ayah, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const formatted = `﴿${ayah.text}﴾ [سورة ${surah.name}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedAyahNumber(ayah.number);
      setTimeout(() => setCopiedAyahNumber(null), 2000);
    });
  };

  const handleShareAyah = (ayah: Ayah, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const formatted = `﴿${ayah.text}﴾\n[سورة ${surah.name} - الآية ${ayah.numberInSurah}]`;
    if (navigator.share) {
      navigator.share({
        title: `آية من سورة ${surah.name}`,
        text: formatted,
      }).catch(() => {});
    } else {
      handleCopyAyah(ayah);
    }
  };

  // Font family class resolver
  const getFontFamilyClass = () => {
    switch (fontType) {
      case 'amiri-quran':
        return 'font-quran';
      case 'scheherazade':
        return 'font-uthmani';
      default:
        return 'font-cairo';
    }
  };

  // Convert English numbers to Arabic-Indic digits ﴿١﴾ ﴿٢﴾
  const toArabicDigits = (num: number) => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/[0-9]/g, (d) => arabicDigits[+d]);
  };

  // Group Ayahs by page for Page Mode
  const ayahsByPage = React.useMemo<Record<number, Ayah[]>>(() => {
    const pages: Record<number, Ayah[]> = {};
    surah.ayahs.forEach((a) => {
      if (!pages[a.page]) pages[a.page] = [];
      pages[a.page].push(a);
    });
    return pages;
  }, [surah.ayahs]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-40">
      {/* Top View Mode Switcher and Surah Nav */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-stone-100/80 dark:bg-[#0F1218] p-2 sm:p-2.5 rounded-2xl border border-stone-200 dark:border-[#222933]">
        {/* Previous Surah button */}
        <button
          onClick={onPrevSurah}
          disabled={surah.number <= 1}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-[#A0AEC0] hover:bg-white dark:hover:bg-[#1A1F26] dark:hover:text-white disabled:opacity-30 flex items-center gap-1 transition-colors border border-transparent dark:hover:border-[#2D3540]"
          title="السورة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="hidden sm:inline">السورة السابقة</span>
        </button>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-[#1A1F26] p-1 rounded-xl border dark:border-[#2D3540]">
          <button
            onClick={() => onViewModeChange('surah')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'surah'
                ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            آية بآية
          </button>
          <button
            onClick={() => onViewModeChange('continuous')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'continuous'
                ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            المصحف المستمر
          </button>
          <button
            onClick={() => onViewModeChange('page')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'page'
                ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            صفحات المصحف
          </button>
        </div>

        {/* Next Surah button */}
        <button
          onClick={onNextSurah}
          disabled={surah.number >= 114}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-[#A0AEC0] hover:bg-white dark:hover:bg-[#1A1F26] dark:hover:text-white disabled:opacity-30 flex items-center gap-1 transition-colors border border-transparent dark:hover:border-[#2D3540]"
          title="السورة التالية"
        >
          <span className="hidden sm:inline">السورة التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Surah Decorative Header Frame */}
      <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 dark:from-[#161A21] dark:via-[#0F1218] dark:to-[#0A0C10] text-white shadow-xl overflow-hidden border border-emerald-700/30 dark:border-[#D4AF37]/30 text-center">
        {/* Subtle Islamic pattern background effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 dark:bg-[#D4AF37]/15 border border-emerald-600/40 dark:border-[#D4AF37]/30 text-emerald-200 dark:text-[#D4AF37] text-xs font-mono">
            <span>سُورَة رقم {surah.number}</span>
            <span>•</span>
            <span>{surah.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'}</span>
            <span>•</span>
            <span>{surah.numberOfAyahs} آية</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-quran text-amber-200 dark:text-[#D4AF37] tracking-wide">
            {surah.name}
          </h2>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-emerald-100/90 dark:text-[#A0AEC0] font-cairo pt-1">
            <span>الجزء: {surah.juzStart}</span>
            <span>•</span>
            <span>الصفحة: {surah.pageStart}</span>
            <span>•</span>
            <span className="text-[#D4AF37]/90">{surah.englishName} ({surah.englishNameTranslation})</span>
          </div>
        </div>
      </div>

      {/* Bismillah Header (except Surah 9 At-Tawba) */}
      {surah.bismillahPre && (
        <div className="my-8 text-center">
          <div className="inline-block p-4 sm:p-6 rounded-2xl bg-amber-500/5 dark:bg-[#0F1218] border border-amber-500/20 dark:border-[#D4AF37]/30 shadow-xs">
            <p className="text-2xl sm:text-3xl font-quran text-amber-900 dark:text-[#D4AF37] select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: Verse by Verse (Default) */}
      {viewMode === 'surah' && (
        <div className="space-y-4">
          {surah.ayahs.map((ayah, index) => {
            const isActive = isPlaying && index === currentAyahIndex;
            const bookmarked = isBookmarked(ayah.number);

            return (
              <div
                key={ayah.number}
                ref={isActive ? activeAyahRef : null}
                id={`ayah-card-${ayah.numberInSurah}`}
                className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 relative ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-[#161A21] dark:border-[#D4AF37] shadow-md ring-2 ring-emerald-500/30 dark:ring-[#D4AF37]/30 active-ayah-highlight'
                    : 'border-stone-200/80 dark:border-[#222933] bg-white dark:bg-[#0F1218] hover:border-stone-300 dark:hover:border-[#2D3540] shadow-xs'
                }`}
              >
                {/* Ayah Header Bar: Number + Action buttons */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-[#222933] text-xs">
                  {/* Ayah Number Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs transition-colors ${
                      isActive
                        ? 'bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10]'
                        : 'bg-stone-100 dark:bg-[#1A1F26] text-stone-700 dark:text-[#A0AEC0] border dark:border-[#2D3540]'
                    }`}>
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-stone-400 dark:text-[#718096] font-mono hidden sm:inline">
                      جزء {ayah.juz} • ص {ayah.page}
                    </span>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Play Ayah Audio */}
                    <button
                      onClick={() => onPlayAyah(index)}
                      className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isActive
                          ? 'bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10]'
                          : 'text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-100 dark:hover:bg-[#1A1F26] dark:hover:text-white'
                      }`}
                      title={isActive ? 'الآية قيد التلاوة' : 'استماع للآية'}
                    >
                      {isActive ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span className="hidden sm:inline">{isActive ? 'تلاوة' : 'استماع'}</span>
                    </button>

                    {/* Tafsir */}
                    <button
                      onClick={() => onOpenTafsir(ayah)}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold text-amber-800 dark:text-[#D4AF37] bg-amber-50 dark:bg-[#D4AF37]/10 hover:bg-amber-100 dark:hover:bg-[#D4AF37]/20 border border-transparent dark:border-[#D4AF37]/20 flex items-center gap-1 transition-colors"
                      title="عرض تفسير الآية"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-[#D4AF37]" />
                      <span className="hidden sm:inline">التفسير</span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => onAddBookmark(ayah)}
                      className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        bookmarked
                          ? 'bg-amber-500 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10]'
                          : 'text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-100 dark:hover:bg-[#1A1F26] dark:hover:text-white'
                      }`}
                      title={bookmarked ? 'فاصل محفوظ' : 'حفظ فاصل عند هذه الآية'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                      <span className="hidden md:inline">{bookmarked ? 'محفوظ' : 'فاصل'}</span>
                    </button>

                    {/* Copy */}
                    <button
                      onClick={(e) => handleCopyAyah(ayah, e)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-[#718096] dark:hover:text-[#E0E0E0] hover:bg-stone-100 dark:hover:bg-[#1A1F26] transition-colors"
                      title="نسخ نص الآية"
                    >
                      {copiedAyahNumber === ayah.number ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Share */}
                    <button
                      onClick={(e) => handleShareAyah(ayah, e)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-[#718096] dark:hover:text-[#E0E0E0] hover:bg-stone-100 dark:hover:bg-[#1A1F26] transition-colors"
                      title="مشاركة الآية"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Ayah Text in Uthmani Font with customizable size */}
                <div className="py-2">
                  <p 
                    className={`${getFontFamilyClass()} text-stone-900 dark:text-[#F0E6D2] text-right leading-loose select-text`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {ayah.text}
                    <span className="inline-flex items-center justify-center px-2 py-0.5 mx-1.5 rounded-full text-emerald-700 dark:text-[#D4AF37] font-bold select-none text-[0.8em] align-middle border border-emerald-600/30 dark:border-[#D4AF37]/40 bg-emerald-500/5 dark:bg-[#D4AF37]/5">
                      ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                    </span>
                  </p>
                </div>

                {/* Tafsir Quick Sneak Peek / Snippet */}
                {ayah.tafsir && (
                  <div className="mt-3 pt-3 border-t border-stone-100 dark:border-[#222933] text-xs sm:text-sm text-stone-600 dark:text-[#A0AEC0] font-cairo leading-relaxed bg-stone-50/50 dark:bg-[#0A0C10] p-3 rounded-xl border dark:border-[#222933]">
                    <span className="font-bold text-amber-700 dark:text-[#D4AF37] ml-1">التفسير الميسر:</span>
                    {ayah.tafsir}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: Continuous Mushaf Flow */}
      {viewMode === 'continuous' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0F1218] border border-stone-200 dark:border-[#222933] shadow-md">
          <div 
            className={`${getFontFamilyClass()} text-stone-900 dark:text-[#F0E6D2] text-justify leading-[2.6] select-text`}
            style={{ fontSize: `${fontSize + 2}px` }}
          >
            {surah.ayahs.map((ayah, index) => {
              const isActive = isPlaying && index === currentAyahIndex;
              return (
                <span
                  key={ayah.number}
                  ref={isActive ? activeAyahRef : null}
                  onClick={() => onOpenTafsir(ayah)}
                  className={`inline cursor-pointer transition-colors px-1 py-0.5 rounded-lg ${
                    isActive
                      ? 'bg-emerald-500/20 dark:bg-[#D4AF37]/20 text-emerald-950 dark:text-[#D4AF37] font-bold ring-1 ring-emerald-500 dark:ring-[#D4AF37]'
                      : 'hover:bg-amber-500/15 dark:hover:bg-[#D4AF37]/10'
                  }`}
                  title="انقر لعرض التفسير والخيارات"
                >
                  {ayah.text}
                  <span className="inline-flex items-center justify-center px-2 py-0.5 mx-1.5 text-amber-700 dark:text-[#D4AF37] font-bold select-none text-[0.75em] border border-amber-600/30 dark:border-[#D4AF37]/40 rounded-full align-middle">
                    ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Page by Page */}
      {viewMode === 'page' && (
        <div className="space-y-8">
          {(Object.entries(ayahsByPage) as [string, Ayah[]][]).map(([pageNumber, pageAyahs]) => (
            <div
              key={pageNumber}
              className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0F1218] border border-stone-200 dark:border-[#222933] shadow-md relative"
            >
              {/* Page Top Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-[#222933] text-xs text-stone-400 dark:text-[#718096] font-cairo">
                <span>الجزء {pageAyahs[0]?.juz}</span>
                <span className="font-bold text-stone-700 dark:text-[#D4AF37] font-quran">{surah.name}</span>
                <span>الحزب {pageAyahs[0]?.hizbQuarter}</span>
              </div>

              {/* Page Body Text */}
              <div 
                className={`${getFontFamilyClass()} text-stone-900 dark:text-[#F0E6D2] text-justify leading-[2.6] select-text`}
                style={{ fontSize: `${fontSize + 1}px` }}
              >
                {pageAyahs.map((ayah) => {
                  const globalIdx = surah.ayahs.findIndex((a) => a.number === ayah.number);
                  const isActive = isPlaying && globalIdx === currentAyahIndex;
                  return (
                    <span
                      key={ayah.number}
                      ref={isActive ? activeAyahRef : null}
                      onClick={() => onOpenTafsir(ayah)}
                      className={`inline cursor-pointer transition-colors px-1 py-0.5 rounded-lg ${
                        isActive
                          ? 'bg-emerald-500/20 dark:bg-[#D4AF37]/20 text-emerald-950 dark:text-[#D4AF37] font-bold ring-1 ring-emerald-500 dark:ring-[#D4AF37]'
                          : 'hover:bg-amber-500/15 dark:hover:bg-[#D4AF37]/10'
                      }`}
                    >
                      {ayah.text}
                      <span className="inline-flex items-center justify-center px-2 py-0.5 mx-1.5 text-emerald-700 dark:text-[#D4AF37] font-bold select-none text-[0.75em] border border-emerald-600/30 dark:border-[#D4AF37]/40 rounded-full align-middle">
                        ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Page Bottom Footer */}
              <div className="pt-4 mt-6 border-t border-stone-100 dark:border-[#222933] text-center">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-stone-100 dark:bg-[#1A1F26] text-stone-500 dark:text-[#A0AEC0] border dark:border-[#2D3540] font-semibold">
                  صفحة {pageNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
