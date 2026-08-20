import React, { useState } from 'react';
import { Bookmark, X, Tag, Check } from 'lucide-react';
import { Ayah } from '../types/quran';

interface BookmarkNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surahName: string;
  surahNumber: number;
  onSaveBookmark: (data: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    page: number;
    text: string;
    note?: string;
    category?: 'daily' | 'memorize' | 'reflection' | 'general';
  }) => void;
}

export const BookmarkNoteModal: React.FC<BookmarkNoteModalProps> = ({
  isOpen,
  onClose,
  ayah,
  surahName,
  surahNumber,
  onSaveBookmark,
}) => {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<'daily' | 'memorize' | 'reflection' | 'general'>('daily');

  if (!isOpen || !ayah) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBookmark({
      surahNumber,
      surahName,
      ayahNumber: ayah.numberInSurah,
      page: ayah.page,
      text: ayah.text,
      note: note.trim() || undefined,
      category,
    });
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfbf7] dark:bg-[#161b22] text-stone-800 dark:text-stone-100 w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-white font-cairo">
              حفظ فاصل قراءة عند الآية {ayah.numberInSurah}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
            سورة {surahName} - الآية {ayah.numberInSurah} (ص {ayah.page})
          </p>
          <p className="text-sm font-quran text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed">
            ﴿ {ayah.text} ﴾
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
              تصنيف العلامة المرجعية:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'daily', label: 'ورد يومي' },
                { id: 'memorize', label: 'حفظ ومراجعة' },
                { id: 'reflection', label: 'تدبر' },
                { id: 'general', label: 'عام' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                    category === c.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
              ملاحظة شخصية (اختياري):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: توقفت هنا بعد صلاة الفجر، مراجعة مع الشيخ..."
              className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تأكيد وحفظ الفاصل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
