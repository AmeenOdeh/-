import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  MapPin, 
  FileText, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  X,
  Clock
} from 'lucide-react';
import { SURAHS_LIST, JUZ_NAMES } from '../data/surahs';
import { SurahMeta } from '../types/quran';

interface SurahIndexProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
  currentSurahNumber: number;
  lastReadSurah?: number;
  lastReadAyah?: number;
}

type TabType = 'all' | 'meccan' | 'medinan' | 'juz';

export const SurahIndex: React.FC<SurahIndexProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
  currentSurahNumber,
  lastReadSurah,
  lastReadAyah,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [pageJumpInput, setPageJumpInput] = useState('');

  // Filtered Surahs list
  const filteredSurahs = useMemo(() => {
    let list = SURAHS_LIST;

    if (activeTab === 'meccan') {
      list = list.filter((s) => s.revelationType === 'Meccan');
    } else if (activeTab === 'medinan') {
      list = list.filter((s) => s.revelationType === 'Medinan');
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.trim().toLowerCase();
    // Normalize Arabic text for search (remove diacritics / tatweel / alef variations)
    const normalizeArabic = (text: string) => {
      return text
        .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel
        .replace(/[إأآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .toLowerCase();
    };

    const normQ = normalizeArabic(q);

    return list.filter((s) => {
      const normName = normalizeArabic(s.name);
      const matchesName = normName.includes(normQ);
      const matchesEng = s.englishName.toLowerCase().includes(q) || s.englishNameTranslation.toLowerCase().includes(q);
      const matchesNumber = s.number.toString() === q;
      const matchesPage = s.pageStart.toString() === q;

      return matchesName || matchesEng || matchesNumber || matchesPage;
    });
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  const handleSurahClick = (num: number) => {
    onSelectSurah(num);
    onClose();
  };

  const handlePageJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageJumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
      // Find surah that starts around or before this page
      const foundSurah = [...SURAHS_LIST].reverse().find((s) => s.pageStart <= pageNum) || SURAHS_LIST[0];
      onSelectSurah(foundSurah.number);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfbf7] dark:bg-[#0F1218] text-stone-800 dark:text-[#E0E0E0] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-stone-200 dark:border-[#222933] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-[#222933] flex items-center justify-between gap-4 bg-stone-50/50 dark:bg-[#161A21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] flex items-center justify-center font-bold text-xl shadow-xs">
              📜
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-cairo text-stone-900 dark:text-[#D4AF37]">
                فهرس سور القرآن الكريم والأجزاء
              </h2>
              <p className="text-xs text-stone-500 dark:text-[#A0AEC0]">
                114 سورة مُفصّلة حسب ترتيب المصحف الشريف وعدد الآيات والصفحات
              </p>
            </div>
          </div>

          <button
            id="btn-close-surah-index"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:text-[#A0AEC0] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-[#1A1F26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs Controls */}
        <div className="p-4 border-b border-stone-200 dark:border-[#222933] flex flex-col sm:flex-row gap-3 items-center justify-between bg-stone-50/30 dark:bg-[#0A0C10]/40">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#718096]" />
            <input
              id="input-surah-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم السورة، رقمها، أو صفحتها..."
              className="w-full pl-3 pr-10 py-2 rounded-xl bg-white dark:bg-[#0A0C10] border border-stone-200 dark:border-[#2D3540] text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#D4AF37] text-stone-800 dark:text-[#E0E0E0] placeholder-stone-400 dark:placeholder-[#718096]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-[#A0AEC0] hover:text-stone-600 dark:hover:text-white"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Page Jump */}
          <form onSubmit={handlePageJumpSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="1"
              max="604"
              value={pageJumpInput}
              onChange={(e) => setPageJumpInput(e.target.value)}
              placeholder="رقم الصفحة (1-604)"
              className="w-36 py-2 px-3 rounded-xl bg-white dark:bg-[#0A0C10] border border-stone-200 dark:border-[#2D3540] text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#D4AF37] text-stone-800 dark:text-[#E0E0E0] placeholder-stone-400 dark:placeholder-[#718096]"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-stone-200 dark:bg-[#1A1F26] hover:bg-stone-300 dark:hover:bg-[#222933] text-stone-800 dark:text-[#E0E0E0] text-xs font-bold rounded-xl transition-colors border dark:border-[#2D3540]"
            >
              انتقال
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-[#1A1F26] p-1 rounded-xl w-full sm:w-auto overflow-x-auto border dark:border-[#2D3540]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                  : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              الكل (114)
            </button>
            <button
              onClick={() => setActiveTab('meccan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'meccan'
                  ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                  : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              مكية (86)
            </button>
            <button
              onClick={() => setActiveTab('medinan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'medinan'
                  ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                  : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              مدنية (28)
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'juz'
                  ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                  : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              الأجزاء (30)
            </button>
          </div>
        </div>

        {/* Last Read Quick Jump Banner */}
        {lastReadSurah && (
          <div className="px-4 py-2.5 bg-emerald-50 dark:bg-[#D4AF37]/10 border-b border-emerald-100 dark:border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-[#D4AF37]">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-[#D4AF37]" />
              <span>آخر موضع قراءة:</span>
              <strong className="font-semibold">{SURAHS_LIST.find((s) => s.number === lastReadSurah)?.name}</strong>
              {lastReadAyah && <span>(الآية {lastReadAyah})</span>}
            </div>
            <button
              onClick={() => handleSurahClick(lastReadSurah)}
              className="text-xs font-bold text-emerald-700 dark:text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              متابعة القراءة
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {activeTab === 'juz' ? (
            /* 30 Juz Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {JUZ_NAMES.map((name, index) => {
                const juzNum = index + 1;
                const startingSurah = SURAHS_LIST.find((s) => s.juzStart === juzNum) || SURAHS_LIST[0];
                return (
                  <div
                    key={juzNum}
                    onClick={() => handleSurahClick(startingSurah.number)}
                    className="p-3.5 rounded-2xl border border-stone-200 dark:border-[#222933] bg-white dark:bg-[#161A21] hover:border-emerald-600 dark:hover:border-[#D4AF37] hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-[#D4AF37]/15 text-emerald-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30 font-bold text-xs flex items-center justify-center">
                        {juzNum}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900 dark:text-[#E0E0E0] group-hover:text-emerald-700 dark:group-hover:text-[#D4AF37] transition-colors">
                          {name}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-[#718096]">
                          يبدأ بسورة {startingSurah.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 dark:text-[#718096] font-mono">
                      ص {startingSurah.pageStart}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 114 Surahs Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredSurahs.map((surah) => {
                const isCurrent = surah.number === currentSurahNumber;
                return (
                  <div
                    key={surah.number}
                    id={`surah-card-${surah.number}`}
                    onClick={() => handleSurahClick(surah.number)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-[#161A21] dark:border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'border-stone-200 dark:border-[#222933] bg-white dark:bg-[#161A21] hover:border-emerald-500/70 dark:hover:border-[#D4AF37]/60 hover:shadow-md'
                    }`}
                  >
                    {/* Surah Number Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                        isCurrent
                          ? 'bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10]'
                          : 'bg-stone-100 dark:bg-[#0A0C10] text-stone-700 dark:text-[#A0AEC0] border dark:border-[#2D3540] group-hover:bg-emerald-100 dark:group-hover:bg-[#D4AF37]/20 group-hover:text-emerald-800 dark:group-hover:text-[#D4AF37]'
                      }`}>
                        {surah.number}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold font-quran text-stone-900 dark:text-[#E0E0E0] group-hover:text-emerald-700 dark:group-hover:text-[#D4AF37] transition-colors">
                            {surah.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-[#718096]">
                          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                            surah.revelationType === 'Meccan'
                              ? 'bg-amber-100 dark:bg-[#D4AF37]/15 text-amber-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30'
                              : 'bg-teal-100 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300'
                          }`}>
                            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                          </span>
                          <span>{surah.numberOfAyahs} آية</span>
                        </div>
                      </div>
                    </div>

                    {/* Left Details (Page & English transliteration) */}
                    <div className="flex flex-col items-end text-left">
                      <span className="text-xs font-mono text-stone-400 dark:text-[#718096]">
                        ص {surah.pageStart}
                      </span>
                      <span className="text-[11px] text-stone-400 dark:text-[#718096] truncate max-w-[80px]">
                        {surah.englishName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredSurahs.length === 0 && activeTab !== 'juz' && (
            <div className="py-12 text-center text-stone-500 dark:text-[#718096]">
              <Search className="w-8 h-8 mx-auto mb-2 text-stone-400 dark:text-[#718096] opacity-60" />
              <p className="text-sm">لم يتم العثور على سورة مطابقة للبحث "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Modal Footer info */}
        <div className="p-3 px-6 border-t border-stone-200 dark:border-[#222933] bg-stone-50/50 dark:bg-[#161A21] text-xs text-stone-500 dark:text-[#718096] flex items-center justify-between">
          <span>المصحف الشريف برواية حفص عن عاصم بالرسم العثماني</span>
          <span className="font-mono text-[#D4AF37]">604 صفحات • 30 جزءاً • 6236 آية</span>
        </div>
      </div>
    </div>
  );
};
