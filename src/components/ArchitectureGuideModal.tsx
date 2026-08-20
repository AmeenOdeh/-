import React, { useState } from 'react';
import { 
  Code2, 
  X, 
  Layers, 
  Cpu, 
  Database, 
  Radio, 
  CheckCircle2, 
  Copy, 
  Check, 
  Smartphone, 
  Globe, 
  Sparkles,
  Workflow
} from 'lucide-react';

interface ArchitectureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureGuideModal: React.FC<ArchitectureGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'plan' | 'snippets' | 'flutter'>('architecture');

  if (!isOpen) return null;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleApiServiceCode = `// services/quranService.ts
// خدمة الربط مع Alquran.cloud و Quran.com APIs مع نظام الكاش الذكي

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  tafsir?: string;
}

export async function getSurahWithTafsir(surahId: number, tafsirEdition = 'ar.muyassar') {
  // 1. جلب نص السورة بالرسم العثماني
  const textPromise = fetch(\`https://api.alquran.cloud/v1/surah/\${surahId}/quran-uthmani\`);
  
  // 2. جلب التفسير الميسر بالتوازي
  const tafsirPromise = fetch(\`https://api.alquran.cloud/v1/surah/\${surahId}/\${tafsirEdition}\`);

  const [textRes, tafsirRes] = await Promise.all([textPromise, tafsirPromise]);
  const textJson = await textRes.json();
  const tafsirJson = await tafsirRes.json();

  const ayahs: Ayah[] = textJson.data.ayahs.map((ayah: any, idx: number) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    juz: ayah.juz,
    page: ayah.page,
    tafsir: tafsirJson.data.ayahs[idx]?.text || ""
  }));

  return {
    number: textJson.data.number,
    name: textJson.data.name,
    ayahs
  };
}`;

  const flutterSampleCode = `// lib/services/quran_service.dart
// نموذج Flutter / Dart لجلب السور والتلاوات الصوتية

import 'dart:convert';
import 'package:http/http.dart' as http;

class QuranService {
  static const String baseUrl = 'https://api.alquran.cloud/v1';

  // جلب قائمة السور كاملة
  static Future<List<dynamic>> getAllSurahs() async {
    final response = await http.get(Uri.parse('$baseUrl/surah'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data'];
    }
    throw Exception('فشل جلب قائمة السور');
  }

  // رابط التلاوة الصوتية للآية للقارئ مشاري العفاسي
  static String getAyahAudioUrl(int globalAyahNumber, {String reciter = 'ar.alafasy'}) {
    return 'https://cdn.islamic.network/quran/audio/128/$reciter/$globalAyahNumber.mp3';
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfbf7] dark:bg-[#161b22] text-stone-800 dark:text-stone-100 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white font-cairo">
                الهيكل المعماري وخطة بناء تطبيق القرآن الكريم
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Architecture Blueprint, Implementation Roadmap & Code Starters
              </p>
            </div>
          </div>

          <button
            id="btn-close-architecture-guide"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-2 border-b border-stone-200 dark:border-stone-800 flex gap-1 bg-stone-100/70 dark:bg-stone-900/40 overflow-x-auto">
          {[
            { id: 'architecture', label: 'الهيكل البرمجي (Architecture)', icon: Layers },
            { id: 'plan', label: 'خطة العمل خطوة بخطوة', icon: Workflow },
            { id: 'snippets', label: 'كود نموذجي (React / Web)', icon: Globe },
            { id: 'flutter', label: 'تطبيق الهواتف (Flutter / Dart)', icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-stone-800 text-indigo-700 dark:text-indigo-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar text-sm font-cairo">
          {/* TAB 1: Architecture Layers */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200">
                <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  المعمارية النموذجية المطبقة في هذا المشروع (Clean Layered Architecture)
                </h4>
                <p className="text-xs leading-relaxed text-indigo-800/80 dark:text-indigo-300">
                  تم تصميم التطبيق وفق نموذج الطبقات النظيفة المنفصلة لضمان أقصى درجات السرعة، إمكانية العمل بدون اتصال (Offline-First)، والتزامن الدقيق بين الصوت والنص.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 space-y-2">
                  <h5 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    1. طبقة واجهة المستخدم (UI Presentation)
                  </h5>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>3 أوضاع عرض:</strong> آية بآية، المصحف المستمر، وصفحات المصحف (604 صفحة).</li>
                    <li><strong>الخط العثماني:</strong> استخدام خطوط Amiri Quran و Scheherazade New بالتشكيل الدقيق.</li>
                    <li><strong>دعم السمات:</strong> نهاري، سيبيا دافئ لراحة العين، وداكن ليلي.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 space-y-2">
                  <h5 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    2. محرك الصوت والتظليل (Audio & Sync Engine)
                  </h5>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>تزامن ذكي:</strong> تمييز الآية النشطة وتمرير الشاشة تلقائياً (Smooth Scroll).</li>
                    <li><strong>نظام التحفيظ والتكرار:</strong> تكرار الآية (1x, 3x, 5x, 10x, ∞) مع عداد تكرار مرئي.</li>
                    <li><strong>شبكة القراء:</strong> بث التلاوات عبر CDN عالي السرعة لـ 14+ قارئاً معتمداً.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 space-y-2">
                  <h5 className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    3. طبقة البيانات والتفاسير (Data & Tafsir Layer)
                  </h5>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>التفاسير المدمجة:</strong> التفسير الميسر، السعدي، ابن كثير، الجلالين، والبغوي.</li>
                    <li><strong>كاش هجين (Memory + LocalStorage):</strong> تحميل فوري بدون انتظار السيرفر.</li>
                    <li><strong>بيانات مسبقة التضمين (Bundled Fallback):</strong> تشغيل فوري حتى لو انقطع الإنترنت.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 space-y-2">
                  <h5 className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    4. إدارة الفواصل والختمة (Bookmarks & Progress)
                  </h5>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>الفواصل المصنفة:</strong> علامات مرجعية مع ملاحظات شخصية وتصنيف (ورد، حفظ، تدبر).</li>
                    <li><strong>تتبع الختمة (Khatmah Tracker):</strong> حساب النسبة المئوية والأيام المتوقعة للختم.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Roadmap / Step-by-Step Plan */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              {[
                {
                  step: 'المرحلة 1',
                  title: 'إعداد المشروع والخطوط العربية (Setup & Typography)',
                  desc: 'تجهيز بيئة العمل (React أو Flutter)، ربط خطوط الخط العثماني (Amiri Quran أو Scheherazade)، وضبط اتجاه الشاشة RTL ودعم الوضع الليلي والنهاري والسيبيا.'
                },
                {
                  step: 'المرحلة 2',
                  title: 'هيكلة البيانات والاتصال بالـ APIs',
                  desc: 'الربط مع Alquran.cloud API لجلب فهرس السور (114 سورة) ونصوص الآيات بالرسم العثماني مع أرقام الأجزاء والأحزاب والصفحات.'
                },
                {
                  step: 'المرحلة 3',
                  title: 'بناء مشغل الصوت وخوارزمية التكرار الذكي',
                  desc: 'ربط ملفات الصوت لكل آية برقمها العالمي، برمجة التظليل التفاعلي للآية الحالية، وخاصية تكرار الآية (Repeat Loop) للمساعدة على الحفظ والتثبيت.'
                },
                {
                  step: 'المرحلة 4',
                  title: 'دمج كتب التفاسير والبحث السريع',
                  desc: 'جلب التفسير الميسر وتفسير السعدي وعرضه في نافذة منبثقة عند النقر على أي آية، مع محرك بحث فوري بالكلمات والجمل.'
                },
                {
                  step: 'المرحلة 5',
                  title: 'نظام الفواصل المرجعية وعداد الختمة والتخزين المحلي',
                  desc: 'تخزين مواضع التوقف والورد اليومي في LocalStorage / SQLite للرجوع إليها في أي وقت دون فقدان البيانات.'
                }
              ].map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{p.step}:</span>
                      <h5 className="font-bold text-stone-900 dark:text-white text-sm">{p.title}</h5>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: React / TypeScript Code Snippet */}
          {activeTab === 'snippets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  كود خدمة الـ API في React / TypeScript:
                </span>
                <button
                  onClick={() => handleCopyCode('ts', sampleApiServiceCode)}
                  className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSection === 'ts' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'ts' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto custom-scrollbar leading-relaxed text-left" dir="ltr">
                {sampleApiServiceCode}
              </pre>
            </div>
          )}

          {/* TAB 4: Flutter / Dart Snippet */}
          {activeTab === 'flutter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  كود خدمة الـ API لتطبيقات الموبايل (Flutter / Dart):
                </span>
                <button
                  onClick={() => handleCopyCode('flutter', flutterSampleCode)}
                  className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSection === 'flutter' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'flutter' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto custom-scrollbar leading-relaxed text-left" dir="ltr">
                {flutterSampleCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50 flex items-center justify-between text-xs text-stone-500">
          <span>APIs المعتمدة: Alquran.cloud • Quran.com API v4 • Islamic Network CDN</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold hover:bg-stone-300"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
