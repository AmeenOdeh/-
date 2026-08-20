import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume2, 
  VolumeX, 
  User, 
  ChevronUp, 
  ChevronDown, 
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Gauge
} from 'lucide-react';
import { RECITERS_LIST, getAyahAudioUrl } from '../data/reciters';
import { Reciter, Ayah } from '../types/quran';

interface AudioPlayerProps {
  currentSurahNumber: number;
  currentSurahName: string;
  currentAyahIndex: number;
  ayahs: Ayah[];
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  onAyahChange: (index: number) => void;
  onSurahComplete?: () => void;
  selectedReciter: Reciter;
  onReciterChange: (reciter: Reciter) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSurahNumber,
  currentSurahName,
  currentAyahIndex,
  ayahs,
  isPlaying,
  onPlayStateChange,
  onAyahChange,
  onSurahComplete,
  selectedReciter,
  onReciterChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecitersList, setShowRecitersList] = useState(false);

  // Memorization / Repeat State
  const [repeatMode, setRepeatMode] = useState<number>(1); // 1 = play once, 3, 5, 10, -1 = infinite
  const [currentRepeatCount, setCurrentRepeatCount] = useState<number>(1);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const currentAyah = ayahs[currentAyahIndex];

  // Update audio source when ayah or reciter changes
  useEffect(() => {
    if (!currentAyah || !audioRef.current) return;

    const audioUrl = getAyahAudioUrl(selectedReciter.id, currentAyah.number);
    audioRef.current.src = audioUrl;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback interrupted:", err);
      });
    }
  }, [currentAyah?.number, selectedReciter.id]);

  // Handle Play/Pause trigger
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn(err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Ayah Ended event with repeat loop logic
  const handleEnded = () => {
    if (repeatMode === -1 || (repeatMode > 1 && currentRepeatCount < repeatMode)) {
      // Repeat current Ayah
      setCurrentRepeatCount((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => console.warn(e));
      }
    } else {
      // Finished repeats for this ayah, reset counter
      setCurrentRepeatCount(1);
      if (autoAdvance && currentAyahIndex < ayahs.length - 1) {
        // Move to next ayah in surah
        onAyahChange(currentAyahIndex + 1);
      } else if (autoAdvance && currentAyahIndex === ayahs.length - 1) {
        // Finished Surah
        onPlayStateChange(false);
        if (onSurahComplete) onSurahComplete();
      } else {
        onPlayStateChange(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleNextAyah = () => {
    setCurrentRepeatCount(1);
    if (currentAyahIndex < ayahs.length - 1) {
      onAyahChange(currentAyahIndex + 1);
    }
  };

  const handlePrevAyah = () => {
    setCurrentRepeatCount(1);
    if (currentAyahIndex > 0) {
      onAyahChange(currentAyahIndex - 1);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf7]/95 dark:bg-[#0F1218]/95 backdrop-blur-md border-t border-stone-200 dark:border-[#222933] shadow-2xl transition-all duration-300">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Expanded Controls Drawer (Memorization & Reciters) */}
        {isExpanded && (
          <div className="mb-3 pt-2 pb-3 border-b border-stone-200/80 dark:border-[#222933] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Memorization & Repeat options */}
            <div className="flex flex-col gap-2 bg-stone-100/70 dark:bg-[#161A21] p-3 rounded-2xl border dark:border-[#2D3540]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-[#E0E0E0] flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" />
                  وضع التكرار والتحفيظ
                </span>
                {repeatMode > 1 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#D4AF37]/20 text-emerald-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30 font-mono">
                    تكرار {currentRepeatCount} من {repeatMode}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'بدون تكرار (1x)', val: 1 },
                  { label: '3 مرات', val: 3 },
                  { label: '5 مرات', val: 5 },
                  { label: '10 مرات', val: 10 },
                  { label: 'مستمر (∞)', val: -1 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setRepeatMode(opt.val);
                      setCurrentRepeatCount(1);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                      repeatMode === opt.val
                        ? 'bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] shadow-xs'
                        : 'bg-white dark:bg-[#1A1F26] text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#222933] dark:hover:text-white border dark:border-[#2D3540]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-stone-500 dark:text-[#718096]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="rounded text-emerald-600 dark:text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                  />
                  <span className="dark:text-[#A0AEC0]">الانتقال التلقائي للآية التالية</span>
                </label>

                <button
                  onClick={cycleSpeed}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-[#1A1F26] text-stone-700 dark:text-[#E0E0E0] hover:bg-stone-300 dark:hover:bg-[#222933] font-mono text-xs border dark:border-[#2D3540]"
                  title="تغيير سرعة القراءة"
                >
                  <Gauge className="w-3 h-3 text-[#D4AF37]" />
                  <span>{playbackRate}x</span>
                </button>
              </div>
            </div>

            {/* Reciters Picker */}
            <div className="flex flex-col gap-2 bg-stone-100/70 dark:bg-[#161A21] p-3 rounded-2xl border dark:border-[#2D3540]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-[#E0E0E0] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4AF37]" />
                  اختيار القارئ المفضل ({RECITERS_LIST.length} قارئ)
                </span>
                <span className="text-[11px] text-stone-500 dark:text-[#A0AEC0] truncate max-w-[150px]">
                  {selectedReciter.style}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                {RECITERS_LIST.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      onReciterChange(reciter);
                      setCurrentRepeatCount(1);
                    }}
                    className={`p-2 rounded-xl text-right text-xs transition-all flex flex-col cursor-pointer ${
                      selectedReciter.id === reciter.id
                        ? 'bg-emerald-700 dark:bg-[#D4AF37] text-white dark:text-[#0A0C10] font-bold shadow-xs'
                        : 'bg-white dark:bg-[#1A1F26] text-stone-700 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#222933] dark:hover:text-white border dark:border-[#2D3540]'
                    }`}
                  >
                    <span className="truncate">{reciter.arabicName}</span>
                    <span className={`text-[10px] truncate ${
                      selectedReciter.id === reciter.id ? 'text-emerald-100 dark:text-[#0A0C10]/80' : 'text-stone-400 dark:text-[#718096]'
                    }`}>
                      {reciter.style}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Audio Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Current Track Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-[28%] sm:max-w-[32%]">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl text-stone-500 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#1A1F26] dark:hover:text-white transition-colors"
              title={isExpanded ? 'طي الخيارات' : 'خيارات التحفيظ والقراء'}
            >
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-[#E0E0E0] truncate">
                  {currentSurahName}
                </span>
                {currentAyah && (
                  <span className="text-xs font-mono px-1.5 py-0.2 rounded-md bg-stone-200 dark:bg-[#1A1F26] text-stone-700 dark:text-[#D4AF37] border dark:border-[#2D3540]">
                    الآية {currentAyah.numberInSurah}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-[11px] text-emerald-700 dark:text-[#D4AF37] text-right truncate hover:underline"
              >
                {selectedReciter.arabicName}
              </button>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="flex flex-col items-center flex-1 max-w-xl">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                id="btn-player-prev"
                onClick={handlePrevAyah}
                disabled={currentAyahIndex === 0}
                className="p-1.5 sm:p-2 rounded-full text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#1A1F26] dark:hover:text-white disabled:opacity-30 transition-colors"
                title="الآية السابقة"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                id="btn-player-toggle"
                onClick={() => onPlayStateChange(!isPlaying)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-[#D4AF37] dark:hover:bg-[#c59f2e] text-white dark:text-[#0A0C10] flex items-center justify-center shadow-md dark:shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 transition-all active:scale-95 cursor-pointer font-bold"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
              </button>

              <button
                id="btn-player-next"
                onClick={handleNextAyah}
                disabled={currentAyahIndex >= ayahs.length - 1}
                className="p-1.5 sm:p-2 rounded-full text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#1A1F26] dark:hover:text-white disabled:opacity-30 transition-colors"
                title="الآية التالية"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Time progress bar */}
            <div className="w-full flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-stone-400 dark:text-[#718096] w-8 text-left">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-stone-200 dark:bg-[#2D3540] rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-[#D4AF37]"
              />
              <span className="text-[10px] font-mono text-stone-400 dark:text-[#718096] w-8 text-right">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Volume & Tools */}
          <div className="flex items-center gap-2 min-w-0 max-w-[28%] sm:max-w-[25%] justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-xl text-xs font-bold hidden md:flex items-center gap-1.5 transition-colors ${
                repeatMode > 1
                  ? 'bg-emerald-100 dark:bg-[#D4AF37]/20 text-emerald-800 dark:text-[#D4AF37] border dark:border-[#D4AF37]/30'
                  : 'text-stone-600 dark:text-[#A0AEC0] hover:bg-stone-200 dark:hover:bg-[#1A1F26] dark:hover:text-white'
              }`}
              title="خيارات الحفظ والتكرار"
            >
              <Repeat className="w-4 h-4" />
              <span>{repeatMode > 1 ? `${repeatMode}x` : 'تكرار'}</span>
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg text-stone-500 dark:text-[#A0AEC0] hover:text-stone-800 dark:hover:text-white"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-stone-200 dark:bg-[#2D3540] rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
