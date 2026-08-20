import React, { useState } from 'react';
import { Search, X, BookOpen, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { searchQuranText, SearchResultItem } from '../services/quranApi';

interface QuranSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (surahNumber: number, ayahNumber: number) => void;
}

export const QuranSearchModal: React.FC<QuranSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await searchQuranText(query);
      setResults(res);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickKeyword = (kw: string) => {
    setQuery(kw);
    setIsLoading(true);
    setHasSearched(true);
    searchQuranText(kw).then((res) => {
      setResults(res);
      setIsLoading(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfbf7] dark:bg-[#0F1218] text-stone-800 dark:text-[#E0E0E0] w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl border border-stone-200 dark:border-[#222933] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#222933] flex items-center justify-between bg-stone-50/70 dark:bg-[#161A21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-[#D4AF37] font-cairo">
                البحث في آيات القرآن الكريم
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A0AEC0]">
                البحث الفوري بالنص أو الكلمات المفتاحية في جميع السور
              </p>
            </div>
          </div>

          <button
            id="btn-close-search-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:text-[#A0AEC0] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-[#1A1F26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="p-4 border-b border-stone-200 dark:border-[#222933] space-y-3 bg-stone-50/30 dark:bg-[#0A0C10]/40">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#718096]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة أو آية للبحث (مثال: الصبر، الجنة، قل هو الله أحد)..."
              autoFocus
              className="w-full pl-24 pr-11 py-3 rounded-2xl bg-white dark:bg-[#0A0C10] border border-stone-200 dark:border-[#2D3540] text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#D4AF37] text-stone-900 dark:text-[#E0E0E0] placeholder-stone-400 dark:placeholder-[#718096]"
            />
            <button
              type="submit"
              disabled={isLoading || query.trim().length < 2}
              className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#D4AF37] dark:hover:bg-[#c59f2e] disabled:opacity-50 text-white dark:text-[#0A0C10] rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'بحث'}
            </button>
          </div>

          {/* Quick Keywords Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-stone-500 dark:text-[#A0AEC0]">
            <span>اقتراحات سريعة:</span>
            {['الصبر', 'الجنة', 'الرحمن', 'المؤمنين', 'التقوى', 'الرحمة', 'الصلاة'].map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => handleQuickKeyword(kw)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1A1F26] text-stone-700 dark:text-[#A0AEC0] hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-[#D4AF37]/20 dark:hover:text-[#D4AF37] border dark:border-[#2D3540] transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </form>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-stone-400 dark:text-[#718096]">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-[#D4AF37]" />
              <span className="text-sm">جاري البحث في المصحف الشريف...</span>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="text-xs text-stone-500 dark:text-[#A0AEC0] mb-3">
                تم العثور على <strong className="text-emerald-700 dark:text-[#D4AF37]">{results.length}</strong> نتيجة مطابقة:
              </div>

              <div className="space-y-3">
                {results.map((item) => (
                  <div
                    key={item.number}
                    onClick={() => {
                      onSelectResult(item.surah.number, item.numberInSurah);
                      onClose();
                    }}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-[#222933] bg-white dark:bg-[#161A21] hover:border-emerald-500 dark:hover:border-[#D4AF37]/50 hover:shadow-md cursor-pointer transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-[#E0E0E0] font-cairo">
                          {item.surah.name}
                        </span>
                        <span className="text-xs font-mono px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-[#0A0C10] text-stone-600 dark:text-[#D4AF37] border dark:border-[#2D3540]">
                          الآية {item.numberInSurah}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-700 dark:text-[#D4AF37] font-bold group-hover:underline flex items-center gap-1">
                        الانتقال للآية
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <p className="text-base sm:text-lg font-quran text-stone-800 dark:text-[#F0E6D2] leading-relaxed">
                      ﴿ {item.text} ﴾
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="py-16 text-center text-stone-400 dark:text-[#718096]">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40 text-stone-500 dark:text-[#718096]" />
              <p className="text-sm">لم يتم العثور على نتائج مطابقة لـ "{query}"</p>
              <p className="text-xs text-stone-500 dark:text-[#718096] mt-1">تأكد من كتابة الكلمة بدون أخطاء إملائية</p>
            </div>
          ) : (
            <div className="py-16 text-center text-stone-400 dark:text-[#718096]">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-600 dark:text-[#D4AF37]" />
              <p className="text-sm">اكتب ما تبحث عنه للوصول المباشر لأي آية في المصحف</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
