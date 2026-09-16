// ============================================================================
// FATHOM ITS 1 — ONBOARDING & ARCHITECTURAL CONFIGURATION
// Language Selection, 7-Voice Previews, and Target CEFR Goal Setting
// Pure Obsidian Glassmorphism — Strictly Zero Neon / Zero Glowing
// ============================================================================

import React, { useState } from 'react';
import { TargetLanguageCode, CEFRLevel, TutorVoice, CURATED_TUTOR_VOICES } from '../../types/fathomITS';
import { FathomITSSoundManager } from './FathomITSSoundManager';
import { Volume2, Play, Square, Check, Sparkles, Globe, Compass, ArrowLeft } from 'lucide-react';

interface FathomITSOnboardingProps {
  onComplete: (config: {
    language: TargetLanguageCode;
    voice: TutorVoice;
    targetCEFR: CEFRLevel;
  }) => void;
  onCancel?: () => void;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en' as TargetLanguageCode, name: 'English (US & UK)', native: 'الإنجليزية', flag: '🇬🇧 🇺🇸', active: true },
  { code: 'fr' as TargetLanguageCode, name: 'French', native: 'الفرنسية', flag: '🇫🇷', active: false },
  { code: 'de' as TargetLanguageCode, name: 'German', native: 'الألمانية', flag: '🇩🇪', active: false },
  { code: 'es' as TargetLanguageCode, name: 'Spanish', native: 'الإسبانية', flag: '🇪🇸', active: false },
  { code: 'ja' as TargetLanguageCode, name: 'Japanese', native: 'اليابانية', flag: '🇯🇵', active: false },
  { code: 'it' as TargetLanguageCode, name: 'Italian', native: 'الإيطالية', flag: '🇮🇹', active: false },
  { code: 'zh' as TargetLanguageCode, name: 'Mandarin Chinese', native: 'الصينية', flag: '🇨🇳', active: false },
];

const CEFR_LEVELS_SELECTION: { level: CEFRLevel; title: string; exam: string; desc: string }[] = [
  { level: 'A1', title: 'A1 - Breakthrough', exam: 'Beginner', desc: 'بناء الأساسيات والتراكيب الابتدائية للمحادثة البسيطة.' },
  { level: 'A2', title: 'A2 - Elementary', exam: 'Cambridge A2 Key (KET)', desc: 'فهم التعبيرات الشائعة والتواصل في المهام اليومية المعتادة.' },
  { level: 'B1', title: 'B1 - Intermediate', exam: 'Cambridge B1 Preliminary (PET)', desc: 'التعامل مع معظم المواقف الحياتية والتعبير عن الآراء بوضوح.' },
  { level: 'B2', title: 'B2 - Upper Intermediate', exam: 'Cambridge B2 First (FCE)', desc: 'الطلاقة التفاعلية الفعالة مع الناطقين الأصليين دون عناء.' },
  { level: 'C1', title: 'C1 - Advanced', exam: 'Cambridge C1 Advanced (CAE)', desc: 'استخدام لغة أكاديمية ومهنية مرنة في المواقف المعقدة.' },
  { level: 'C2', title: 'C2 - Mastery', exam: 'Cambridge C2 Proficiency (CPE)', desc: 'الإتقان اللغوي الكامل والتلقائي المكافئ للناطقين الأصليين.' },
];

export const FathomITSOnboarding: React.FC<FathomITSOnboardingProps> = ({ onComplete, onCancel }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<TargetLanguageCode>('en');
  const [selectedVoice, setSelectedVoice] = useState<TutorVoice>(CURATED_TUTOR_VOICES[0] as TutorVoice);
  const [targetCEFR, setTargetCEFR] = useState<CEFRLevel>('B2');

  // Preview Audio State
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);

  const handleToggleAudioPreview = async (voice: TutorVoice, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingVoiceId === voice.id) {
      FathomITSSoundManager.stopCurrentAudio();
      setPlayingVoiceId(null);
      return;
    }

    try {
      setLoadingVoiceId(voice.id);
      await FathomITSSoundManager.speakText(voice.previewText, voice.id, {
        onStart: () => {
          setLoadingVoiceId(null);
          setPlayingVoiceId(voice.id);
        },
        onEnd: () => {
          setPlayingVoiceId(null);
        },
        onError: () => {
          setLoadingVoiceId(null);
          setPlayingVoiceId(null);
        }
      });
    } catch {
      setLoadingVoiceId(null);
      setPlayingVoiceId(null);
    }
  };

  const handleProceed = () => {
    FathomITSSoundManager.stopCurrentAudio();
    onComplete({
      language: selectedLanguage,
      voice: selectedVoice,
      targetCEFR: targetCEFR
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 select-none" dir="rtl">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#090a0f]/90 border border-white/[0.08] backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                FATHOM ITS 1
              </span>
              <span className="text-xs text-zinc-500 font-sans">
                المنظومة التعليمية الذكية المستقلة الأولى عالمياً
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              تهيئة خطة التعلّم وإعداد المساعد الأكاديمي
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              اختر اللغة التي ترغب في إتقانها، واستمع للأصوات الأكاديمية السبعة الرائدة عالمياً لاختيار معلّمك الشخصي، ثم حدد هدفك المنشود وفق نظام CEFR قبل خوض الاختبار التشخيصي.
            </p>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all cursor-pointer"
            >
              إلغاء والعودة
            </button>
          )}
        </div>
      </div>

      {/* Step 1: Language Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">
            1. اختر لغة التعلم المستهدفة
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                disabled={!lang.active}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`relative p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                  lang.active
                    ? isSelected
                      ? 'bg-white/[0.09] border-white/[0.22] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] cursor-pointer'
                      : 'bg-[#0b0c12]/70 border-white/[0.05] text-zinc-300 hover:bg-white/[0.04] hover:border-white/[0.1] cursor-pointer'
                    : 'bg-[#08080c]/40 border-white/[0.03] text-zinc-600 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg">{lang.flag}</span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!lang.active && (
                    <span className="text-[10px] text-zinc-500 font-mono px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04]">
                      قريباً
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold">{lang.native}</div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{lang.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Voice Assistant Selection (7 World-Class ElevenLabs Voices + Live Audio Preview) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">
              2. اختر المساعد الصوتي الأكاديمي (7 أصوات ElevenLabs رائدة)
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            اضغط على أيقونة الاستماع لتجربة الصوت الحقيقي قبل الاختيار
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CURATED_TUTOR_VOICES.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isPlaying = playingVoiceId === voice.id;
            const isLoading = loadingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice as TutorVoice)}
                className={`relative p-4 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/[0.08] border-white/[0.22] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'bg-[#090a0f]/80 border-white/[0.05] text-zinc-300 hover:bg-white/[0.04] hover:border-white/[0.1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{voice.avatar}</span>
                      <div>
                        <div className="text-sm font-bold flex items-center gap-2">
                          {voice.name}
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-zinc-200 border border-white/15">
                              المحدد
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">{voice.accent}</div>
                      </div>
                    </div>

                    {/* Live Audio Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleAudioPreview(voice as TutorVoice, e)}
                      disabled={isLoading}
                      className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-white/20 border-white/30 text-white shadow-inner'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300 hover:text-white'
                      }`}
                      title="تجربة الاستماع للصوت الآن"
                    >
                      {isLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : isPlaying ? (
                        <Square className="w-3 h-3 fill-white text-white" />
                      ) : (
                        <Play className="w-3 h-3 fill-zinc-300 text-zinc-300" />
                      )}
                      <span className="text-[11px] font-sans">
                        {isLoading ? 'تحضير...' : isPlaying ? 'إيقاف' : 'تيست الصوت'}
                      </span>
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-zinc-300 mt-2 mb-1">
                    {voice.roleTitle}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {voice.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.04] text-[10px] text-zinc-500 font-mono truncate" dir="ltr">
                  &quot;{voice.previewText}&quot;
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Target CEFR Level Selection */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">
            3. حدد المستوى اللغوي الذي تريد الوصول له (CEFR Framework)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CEFR_LEVELS_SELECTION.map((item) => {
            const isSelected = targetCEFR === item.level;
            return (
              <div
                key={item.level}
                onClick={() => setTargetCEFR(item.level)}
                className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/[0.09] border-white/[0.22] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'bg-[#090a0f]/80 border-white/[0.05] text-zinc-300 hover:bg-white/[0.04] hover:border-white/[0.1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-zinc-100">{item.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300">
                    {item.level}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-medium mb-1">{item.exam}</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-[#090a0f]/90 border border-white/[0.08] backdrop-blur-xl">
        <div className="text-xs text-zinc-400">
          الخطوة التالية:{' '}
          <strong className="text-zinc-200 font-semibold">
            خوض الاختبار التشخيصي المعياري لكامبريدج (3 - 5 دقائق)
          </strong>{' '}
          لقياس مستواك الفعلي بدقة 100%.
        </div>

        <button
          type="button"
          onClick={handleProceed}
          className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs tracking-wide bg-zinc-100 hover:bg-white text-black transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.06)]"
        >
          <span>بدء الاختبار التشخيصي الشامل</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
