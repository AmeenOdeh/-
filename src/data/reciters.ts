import { Reciter } from '../types/quran';

export const RECITERS_LIST: Reciter[] = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'مرتل ومتقن',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy',
  },
  {
    id: 'ar.abdulbasitmurattal',
    name: 'Abdul Basit (Murattal)',
    arabicName: 'عبد الباسط عبد الصمد (مرتل)',
    style: 'مرتل هادئ وواضح',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal',
  },
  {
    id: 'ar.abdulbasitmujawwad',
    name: 'Abdul Basit (Mujawwad)',
    arabicName: 'عبد الباسط عبد الصمد (مجود)',
    style: 'تجويد خاشع ومقامي',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmujawwad',
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري (مرتل)',
    style: 'أدق أحكام التجويد ومخارج الحروف',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.husary',
  },
  {
    id: 'ar.husarymuallim',
    name: 'Al-Husary (Muallim / Educational)',
    arabicName: 'محمود خليل الحصري (المصحف المعلم)',
    style: 'بطيء ومناسب للحفظ والترديد',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.husarymuallim',
  },
  {
    id: 'ar.minshawi',
    name: 'Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي (مرتل)',
    style: 'صوت باكي وخاشع',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.minshawi',
  },
  {
    id: 'ar.minshawimujawwad',
    name: 'Al-Minshawi (Mujawwad)',
    arabicName: 'محمد صديق المنشاوي (مجود)',
    style: 'تجويد رائع مع إحساس عميق',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.minshawimujawwad',
  },
  {
    id: 'ar.saadalghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'تلاوة سريعة وسلسة',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.saadalghamdi',
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    style: 'تلاوة الحرم المكي الشريف',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly',
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdur-Rahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    style: 'إمام الحرم المكي',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais',
  },
  {
    id: 'ar.shaatree',
    name: 'Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    style: 'نبرة حجازية مميزة ورخيمة',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.shaatree',
  },
  {
    id: 'ar.ahmedajamy',
    name: 'Ahmed Al-Ajmy',
    arabicName: 'أحمد بن علي العجمي',
    style: 'شجي ومؤثر جداً',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy',
  },
  {
    id: 'ar.hudhaify',
    name: 'Ali Al-Hudhaify',
    arabicName: 'علي بن عبد الرحمن الحذيفي',
    style: 'إمام المسجد النبوي الشريف',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.hudhaify',
  },
  {
    id: 'ar.aymanswoid',
    name: 'Ayman Sowaid',
    arabicName: 'أيمن سويد (معلم التجويد)',
    style: 'تعليمي دقيق لأحكام التلاوة',
    serverUrlFormat: 'https://cdn.islamic.network/quran/audio/128/ar.aymanswoid',
  }
];

export const getAyahAudioUrl = (reciterId: string, globalAyahNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
};
