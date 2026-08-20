import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  Play, 
  Volume2, 
  Share2, 
  Layers,
  Sparkles,
  Loader2
} from 'lucide-react';
import { TAFSIR_SOURCES } from '../data/tafsirList';
import { Ayah, TafsirSource } from '../types/quran';
import { fetchAyahTafsir } from '../services/quranApi';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  ayah: Ayah | null;
  totalAyahs: number;
  onNavigateAyah: (ayahIndex: number) => void;
  onPlayAyah: (ayahIndex: number) => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  ayah,
  totalAyahs,
  onNavigateAyah,
  onPlayAyah,
}) => {
  const [selectedTafsir, setSelectedTafsir] = useState<TafsirSource>(TAFSIR_SOURCES[0]);
  const [tafsirText, setTafsirText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !ayah) return;

    // If tafsir is already attached on ayah object for Muyassar, use it or fetch specifically
    if (selectedTafsir.id === 'ar.muyassar' && ayah.tafsir && ayah.tafsir !== "التفسير غير متوفر لهذه الآية حالياً") {
      setTafsirText(ayah.tafsir);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    fetchAyahTafsir(surahNumber, ayah.numberInSurah, selectedTafsir.slug)
      .then((res) => {
        if (isMounted) {
          setTafsirText(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTafsirText("تعذر جلب التفسير المختار حالياً، يرجى المحاولة لاحقاً.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, ayah?.number, selectedTafsir.id]);

  if (!isOpen || !ayah) return null;

  const handleCopy = () => {
    const fullContent = `﴿${ayah.text}﴾ [${surahName}: ${ayah.numberInSurah}]\n\n📖 التفسير (${selectedTafsir.name}):\n${tafsirText}`;
    navigator.clipboard.writeText(fullContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const currentIndex = ayah.numberInSurah - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfbf7] dark:bg-[#0F1218] text-stone-800 dark:text-[#E0E0E0] w-full max-w-3xl max-h-[88vh] rounded-3xl shadow-2xl border border-stone-200 dark:border-[#222933] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#222933] flex items-center justify-between gap-3 bg-stone-50/70 dark:bg-[#161A21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-[#D4AF37]/15 text-amber-700 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-[#D4AF37] font-cairo">
                  تفسير وبيان الآية {ayah.numberInSurah}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 dark:bg-[#1A1F26] text-stone-700 dark:text-[#E0E0E0] border dark:border-[#2D3540] font-semibold">
                  {surahName}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-[#A0AEC0]">
                الجزء {ayah.juz} • الحزب {ayah.hizbQuarter} • الصفحة {ayah.page}
              </p>
            </div>
          </div>

          <button
            id="btn-close-tafsir-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:text-[#A0AEC0] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-[#1A1F26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tafsir Source Selector & Actions Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-stone-200 dark:border-[#222933] flex flex-wrap items-center justify-between gap-3 bg-white/60 dark:bg-[#0A0C10]/50">
          {/* Source Dropdown / Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 dark:text-[#A0AEC0] whitespace-nowrap">مصدر التفسير:</span>
            <select
              value={selectedTafsir.id}
              onChange={(e) => {
                const src = TAFSIR_SOURCES.find((s) => s.id === e.target.value);
                if (src) setSelectedTafsir(src);
              }}
              className="py-1.5 px-3 rounded-lg bg-stone-100 dark:bg-[#0A0C10] border border-stone-200 dark:border-[#2D3540] text-xs font-semibold text-stone-800 dark:text-[#E0E0E0] focus:outline-hidden focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#D4AF37]"
            >
              {TAFSIR_SOURCES.map((source) => (
                <option key={source.id} value={source.id} className="dark:bg-[#0F1218] dark:text-[#E0E0E0]">
                  {source.name} ({source.author})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayAyah(currentIndex)}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-[#D4AF37] dark:hover:bg-[#c59f2e] text-white dark:text-[#0A0C10] text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
              title="استماع لتلاوة هذه الآية"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>استماع</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#1A1F26] dark:hover:bg-[#222933] text-stone-700 dark:text-[#E0E0E0] text-xs font-medium flex items-center gap-1.5 transition-colors border dark:border-[#2D3540]"
              title="نسخ الآية والتفسير"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
          {/* Ayah Card Banner */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent dark:from-[#161A21] dark:to-[#0A0C10] border border-emerald-600/20 dark:border-[#D4AF37]/30 text-center relative">
            <span className="text-xs font-bold text-emerald-800 dark:text-[#D4AF37] mb-2 block">
              نص الآية الكريمة
            </span>
            <p className="text-xl sm:text-2xl font-quran text-stone-900 dark:text-[#F0E6D2] leading-loose">
              ﴿ {ayah.text} ﴾
            </p>
          </div>

          {/* Tafsir Content Card */}
          <div className="bg-white dark:bg-[#161A21] p-5 rounded-2xl border border-stone-200 dark:border-[#222933] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-[#222933] text-xs text-stone-500 dark:text-[#718096]">
              <span className="font-semibold text-emerald-700 dark:text-[#D4AF37]">
                {selectedTafsir.name}
              </span>
              <span className="dark:text-[#A0AEC0]">المؤلف: {selectedTafsir.author}</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-400 dark:text-[#718096]">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-[#D4AF37]" />
                <span className="text-xs">جاري تحميل التفسير...</span>
              </div>
            ) : (
              <div className="text-stone-700 dark:text-[#E0E0E0] leading-relaxed text-sm sm:text-base font-cairo whitespace-pre-line text-justify">
                {tafsirText}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation (Prev / Next Ayah) */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-[#222933] bg-stone-50/70 dark:bg-[#161A21] flex items-center justify-between">
          <button
            onClick={() => onNavigateAyah(currentIndex - 1)}
            disabled={currentIndex <= 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1A1F26] border border-stone-200 dark:border-[#2D3540] text-stone-700 dark:text-[#E0E0E0] hover:bg-stone-100 dark:hover:bg-[#222933] disabled:opacity-40 flex items-center gap-1.5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الآية السابقة ({currentIndex > 0 ? currentIndex : 1})</span>
          </button>

          <span className="text-xs text-stone-500 dark:text-[#A0AEC0]">
            الآية {ayah.numberInSurah} من {totalAyahs}
          </span>

          <button
            onClick={() => onNavigateAyah(currentIndex + 1)}
            disabled={currentIndex >= totalAyahs - 1}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1A1F26] border border-stone-200 dark:border-[#2D3540] text-stone-700 dark:text-[#E0E0E0] hover:bg-stone-100 dark:hover:bg-[#222933] disabled:opacity-40 flex items-center gap-1.5 transition-colors"
          >
            <span>الآية التالية ({currentIndex < totalAyahs - 1 ? currentIndex + 2 : totalAyahs})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
