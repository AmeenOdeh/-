import React, { useState } from 'react';
import { 
  Bookmark, 
  X, 
  Trash2, 
  Plus, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  ArrowLeft, 
  BookOpen, 
  Sparkles,
  Edit2,
  FolderOpen
} from 'lucide-react';
import { Bookmark as BookmarkType, ReadingProgress } from '../types/quran';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onRemoveBookmark: (id: string) => void;
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  readingProgress: ReadingProgress;
  onUpdateDailyGoal: (pages: number) => void;
  onLogDailyPages: (pages: number) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onSelectBookmark,
  readingProgress,
  onUpdateDailyGoal,
  onLogDailyPages,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'khatmah'>('bookmarks');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newLogPages, setNewLogPages] = useState<string>('1');

  if (!isOpen) return null;

  const filteredBookmarks = filterCategory === 'all' 
    ? bookmarks 
    : bookmarks.filter((b) => b.category === filterCategory);

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'daily':
        return <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-100 dark:bg-[#D4AF37]/15 text-emerald-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30">ورد يومي</span>;
      case 'memorize':
        return <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border dark:border-indigo-800/40">حفظ ومراجعة</span>;
      case 'reflection':
        return <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-100 dark:bg-[#D4AF37]/10 text-amber-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30">تدبر</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] bg-stone-100 dark:bg-[#1A1F26] text-stone-700 dark:text-[#A0AEC0] border dark:border-[#2D3540]">عام</span>;
    }
  };

  const calculateKhatmahDaysLeft = () => {
    const pagesLeft = 604 - readingProgress.lastPage;
    const goal = readingProgress.dailyGoalPages || 5;
    return Math.ceil(pagesLeft / goal);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfbf7] dark:bg-[#0F1218] text-stone-800 dark:text-[#E0E0E0] w-full max-w-md h-full shadow-2xl border-r border-stone-200 dark:border-[#222933] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#222933] flex items-center justify-between bg-stone-50/70 dark:bg-[#161A21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] flex items-center justify-center font-bold shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-[#D4AF37] font-cairo">
                الفواصل ومتابعة الختمة
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A0AEC0]">
                حفظ مواضع التوقف وتتبع ورد القراءة اليومي
              </p>
            </div>
          </div>

          <button
            id="btn-close-bookmarks-drawer"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:text-[#A0AEC0] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-[#1A1F26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 border-b border-stone-200 dark:border-[#222933] flex gap-1 bg-stone-100/70 dark:bg-[#0A0C10]/60">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-white dark:bg-[#D4AF37] text-amber-700 dark:text-[#0A0C10] shadow-xs'
                : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>الفواصل المحفوظة ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('khatmah')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'khatmah'
                ? 'bg-white dark:bg-[#D4AF37] text-emerald-700 dark:text-[#0A0C10] shadow-xs'
                : 'text-stone-600 dark:text-[#A0AEC0] hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>خطة الختمة والورد</span>
          </button>
        </div>

        {/* Tab 1: Bookmarks List */}
        {activeTab === 'bookmarks' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Category filter pills */}
            <div className="p-3 border-b border-stone-200 dark:border-[#222933] flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'daily', label: 'ورد يومي' },
                { id: 'memorize', label: 'حفظ' },
                { id: 'reflection', label: 'تدبر' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    filterCategory === c.id
                      ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] shadow-xs'
                      : 'bg-stone-100 dark:bg-[#1A1F26] text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#222933] dark:hover:text-white border dark:border-[#2D3540]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Bookmarks Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredBookmarks.length === 0 ? (
                <div className="py-16 text-center text-stone-400 dark:text-[#718096]">
                  <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-600 dark:text-[#D4AF37]" />
                  <p className="text-sm font-medium dark:text-[#E0E0E0]">لا توجد علامات مرجعية محفوظة بعد</p>
                  <p className="text-xs text-stone-500 dark:text-[#718096] mt-1 max-w-xs mx-auto">
                    أثناء تلاوة القرآن، انقر على أي آية واختر "حفظ فاصل" لترقيم موضع توقفك للعودة إليه لاحقاً.
                  </p>
                </div>
              ) : (
                filteredBookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl border border-stone-200 dark:border-[#222933] bg-white dark:bg-[#161A21] hover:border-amber-500/50 dark:hover:border-[#D4AF37]/50 hover:shadow-md transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-[#E0E0E0] font-cairo">
                          {b.surahName}
                        </span>
                        <span className="text-xs font-mono px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-[#D4AF37]/20 text-amber-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30">
                          الآية {b.ayahNumber}
                        </span>
                        {getCategoryBadge(b.category)}
                      </div>

                      <button
                        onClick={() => onRemoveBookmark(b.id)}
                        className="text-stone-400 hover:text-rose-600 dark:text-[#718096] dark:hover:text-rose-400 p-1 rounded-md opacity-70 group-hover:opacity-100 transition-opacity"
                        title="حذف العلامة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm font-quran text-stone-700 dark:text-[#F0E6D2] line-clamp-2 leading-relaxed">
                      ﴿ {b.text} ﴾
                    </p>

                    {b.note && (
                      <div className="text-xs text-stone-500 dark:text-[#A0AEC0] bg-stone-50 dark:bg-[#0A0C10] p-2 rounded-xl border dark:border-[#222933] italic">
                        📝 {b.note}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-[#222933] text-[11px] text-stone-400 dark:text-[#718096]">
                      <span>{new Date(b.timestamp).toLocaleDateString('ar-SA')}</span>
                      <button
                        onClick={() => {
                          onSelectBookmark(b.surahNumber, b.ayahNumber);
                          onClose();
                        }}
                        className="text-amber-700 dark:text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
                      >
                        الانتقال للموضع
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Khatmah Tracker */}
        {activeTab === 'khatmah' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 custom-scrollbar">
            {/* Khatmah Progress Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-900 dark:from-[#161A21] dark:via-[#0F1218] dark:to-[#0A0C10] text-white shadow-xl space-y-4 border border-emerald-600/30 dark:border-[#D4AF37]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-100 dark:text-[#D4AF37] uppercase tracking-wider">
                  مستوى الإنجاز الحالي
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-[#D4AF37]/20 text-white dark:text-[#D4AF37] font-mono border dark:border-[#D4AF37]/30">
                  الصفحة {readingProgress.lastPage} من 604
                </span>
              </div>

              <div>
                <div className="text-3xl font-extrabold font-mono mb-1 text-white dark:text-[#D4AF37]">
                  {((readingProgress.lastPage / 604) * 100).toFixed(1)}%
                </div>
                <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white dark:bg-[#D4AF37] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                    style={{ width: `${(readingProgress.lastPage / 604) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10 dark:border-[#222933] text-emerald-100 dark:text-[#A0AEC0]">
                <div>
                  <span className="opacity-75 block">الصفحات المتبقية:</span>
                  <strong className="text-white dark:text-[#E0E0E0] text-sm">{604 - readingProgress.lastPage} صفحة</strong>
                </div>
                <div>
                  <span className="opacity-75 block">الأيام المتوقعة للختم:</span>
                  <strong className="text-white dark:text-[#D4AF37] text-sm">{calculateKhatmahDaysLeft()} يوم</strong>
                </div>
              </div>
            </div>

            {/* Daily Goal Settings */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#222933] bg-white dark:bg-[#161A21] space-y-3">
              <h4 className="text-sm font-bold text-stone-900 dark:text-[#E0E0E0] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-[#D4AF37]" />
                الهدف اليومي (الورد القرآني)
              </h4>

              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: '2 صفحة', val: 2 },
                  { label: '5 صفحات (ربع حزب)', val: 5 },
                  { label: '10 صفحات (نصف حزب)', val: 10 },
                  { label: '20 صفحة (جزء كامل)', val: 20 },
                ].map((g) => (
                  <button
                    key={g.val}
                    onClick={() => onUpdateDailyGoal(g.val)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      readingProgress.dailyGoalPages === g.val
                        ? 'bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] shadow-xs'
                        : 'bg-stone-100 dark:bg-[#1A1F26] text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#222933] dark:hover:text-white border dark:border-[#2D3540]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Log today's progress */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#222933] bg-white dark:bg-[#161A21] space-y-3">
              <h4 className="text-sm font-bold text-stone-900 dark:text-[#E0E0E0] flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600 dark:text-[#D4AF37]" />
                تسجيل قراءة ورد اليوم
              </h4>
              <p className="text-xs text-stone-500 dark:text-[#A0AEC0]">
                قرأت اليوم: <strong className="text-emerald-700 dark:text-[#D4AF37]">{readingProgress.pagesReadToday}</strong> من {readingProgress.dailyGoalPages} صفحة
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newLogPages}
                  onChange={(e) => setNewLogPages(e.target.value)}
                  className="w-20 py-2 px-3 rounded-xl border border-stone-200 dark:border-[#2D3540] bg-stone-50 dark:bg-[#0A0C10] text-sm font-mono text-center text-stone-800 dark:text-[#E0E0E0] focus:ring-2 focus:ring-[#D4AF37]"
                />
                <button
                  onClick={() => {
                    const p = parseInt(newLogPages, 10);
                    if (!isNaN(p) && p > 0) {
                      onLogDailyPages(p);
                      setNewLogPages('1');
                    }
                  }}
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#D4AF37] dark:hover:bg-[#c59f2e] text-white dark:text-[#0A0C10] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  إضافة للصفحات المقروءة (+{newLogPages})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
