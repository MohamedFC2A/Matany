// ============================================================================
// FATHOM ITS 1 — CAMBRIDGE DIAGNOSTIC PLACEMENT TEST ENGINE
// 3-5 Minute Calibrated Benchmark with Real ElevenLabs Audio & STT Production
// Pure Obsidian Glassmorphism — Zero Glowing / Zero Neon
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  TutorVoice,
  DiagnosticQuestion,
  DiagnosticResult,
  QuestionCategory
} from '../../types/fathomITS';
import { CAMBRIDGE_DIAGNOSTIC_BANK, FathomITSService } from '../../services/fathomITSService';
import { FathomITSSoundManager } from './FathomITSSoundManager';
import {
  Clock,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

interface FathomITSDiagnosticTestProps {
  selectedVoice: TutorVoice;
  onCompleteTest: (result: DiagnosticResult) => void;
  onCancel?: () => void;
}

const TOTAL_TEST_SECONDS = 300; // 5 minutes max

export const FathomITSDiagnosticTest: React.FC<FathomITSDiagnosticTestProps> = ({
  selectedVoice,
  onCompleteTest,
  onCancel
}) => {
  const questions = CAMBRIDGE_DIAGNOSTIC_BANK;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_TEST_SECONDS);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<DiagnosticResult | null>(null);

  // Audio Playback State for Listening Questions
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  // Speech Recognition State for Production Question
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  const currentQ = questions[currentIndex];

  // 3-5 Minute Countdown Timer
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, answers]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      FathomITSSoundManager.stopCurrentAudio();
      FathomITSSoundManager.stopListening();
    };
  }, []);

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleTextProduction = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handlePlayListeningPrompt = async () => {
    if (!currentQ.audioPromptText) return;

    if (isPlayingAudio) {
      FathomITSSoundManager.stopCurrentAudio();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setAudioLoading(true);
      await FathomITSSoundManager.speakText(currentQ.audioPromptText, selectedVoice.id, {
        onStart: () => {
          setAudioLoading(false);
          setIsPlayingAudio(true);
        },
        onEnd: () => {
          setIsPlayingAudio(false);
        },
        onError: () => {
          setAudioLoading(false);
          setIsPlayingAudio(false);
        }
      });
    } catch {
      setAudioLoading(false);
      setIsPlayingAudio(false);
    }
  };

  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      FathomITSSoundManager.stopListening();
      setIsRecording(false);
      return;
    }

    const success = FathomITSSoundManager.startListening(
      (res) => {
        setSpeechTranscript(res.transcript);
        setAnswers((prev) => ({ ...prev, [currentQ.id]: res.transcript }));
      },
      () => {
        setIsRecording(false);
      },
      (err) => {
        console.error('STT error:', err);
        setIsRecording(false);
      }
    );

    if (success) {
      setIsRecording(true);
    }
  };

  const handleFinalSubmit = () => {
    FathomITSSoundManager.stopCurrentAudio();
    FathomITSSoundManager.stopListening();

    const result = FathomITSService.calculateDiagnosticResult(answers);
    setAssessmentResult(result);
    setIsSubmitted(true);
  };

  // If already submitted, show the comprehensive assessment report
  if (isSubmitted && assessmentResult) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none" dir="rtl">
        <div className="rounded-2xl bg-[#090a0f]/95 border border-white/[0.08] backdrop-blur-2xl p-6 sm:p-10 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
          {/* Header Banner */}
          <div className="text-center pb-8 border-b border-white/[0.06]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-4">
              <Award className="w-3.5 h-3.5 text-zinc-200" />
              <span>CAMBRIDGE CEFR DIAGNOSTIC MATRIX</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              تقرير التقييم اللغوي المعياري الشامل
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
              تم تحليل إجاباتك بنسبة 100% وفق مقياس كامبريدج المعتمد وإطار CEFR وتثبيت المستوى الأساسي في الذاكرة الدائمة.
            </p>
          </div>

          {/* Primary Metric Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {/* CEFR Baseline */}
            <div className="p-5 rounded-xl bg-[#0d0e15]/80 border border-white/[0.06] text-center">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                المستوى المشخّص (CEFR)
              </div>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                {assessmentResult.subLevelString}
              </div>
              <div className="text-xs text-zinc-400 mt-2 font-medium">
                {assessmentResult.levelDescriptor}
              </div>
            </div>

            {/* Cambridge English Scale */}
            <div className="p-5 rounded-xl bg-[#0d0e15]/80 border border-white/[0.06] text-center">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                درجة مقياس كامبريدج (Scale)
              </div>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                {assessmentResult.cambridgeScale}{' '}
                <span className="text-xs text-zinc-500 font-mono">/ 230</span>
              </div>
              <div className="text-xs text-zinc-400 mt-2 font-medium">
                دقة الأداء: {assessmentResult.percentage}%
              </div>
            </div>

            {/* Raw Points Baseline */}
            <div className="p-5 rounded-xl bg-[#0d0e15]/80 border border-white/[0.06] text-center">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                نقاط الأساس اللغوية (Baseline)
              </div>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                {assessmentResult.rawScore}{' '}
                <span className="text-xs text-zinc-500 font-mono">/ {assessmentResult.maxScore}</span>
              </div>
              <div className="text-xs text-zinc-400 mt-2 font-medium">
                نقطة تقييمية معيارية
              </div>
            </div>
          </div>

          {/* Detailed Competency Breakdown */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              تفصيل المهارات اللغوية الخمس
            </h3>
            <div className="space-y-3">
              {(Object.keys(assessmentResult.categoryScores) as QuestionCategory[]).map((cat) => {
                const item = assessmentResult.categoryScores[cat];
                const labelMap: Record<QuestionCategory, string> = {
                  grammar: 'الصرف والنحو (Syntax & Morphology)',
                  vocabulary: 'الثروة اللفظية والمتلازمات (Lexical Resource)',
                  listening: 'الاستماع والفهم السمعي (Auditory Comprehension)',
                  discourse: 'التماسك البلاغي وأدوات الربط (Discourse & Cohesion)',
                  production: 'الإنتاج النشط والطلاقة (Active Production)'
                };

                return (
                  <div key={cat} className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-zinc-200">{labelMap[cat]}</span>
                      <span className="font-mono text-zinc-300 font-bold">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-zinc-200 transition-all duration-700"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                <span>نقاط القوة الملحوظة</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed">
                {assessmentResult.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-200">
                <AlertCircle className="w-4 h-4 text-zinc-300" />
                <span>محاور التطوير المستهدفة</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed">
                {assessmentResult.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Continue Button */}
          <div className="flex justify-end pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => onCompleteTest(assessmentResult)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs tracking-wide bg-zinc-100 hover:bg-white text-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.08)] active:scale-95"
            >
              <span>الانتقال لمصفوفة الساعات وخريطة الطريق التعليمية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Test Interface
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none" dir="rtl">
      {/* Top Test Control Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090a0f]/90 border border-white/[0.08] backdrop-blur-2xl mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.06] text-zinc-200 border border-white/[0.08]">
            سؤال {currentIndex + 1} من {questions.length}
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            اختبار كامبريدج التشخيصي المعياري
          </span>
        </div>

        {/* 3-5 Minute Countdown Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] font-mono text-xs text-zinc-200">
          <Clock className="w-4 h-4 text-zinc-400" />
          <span>{formatTimer(remainingSeconds)}</span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-zinc-300 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#090a0f]/95 border border-white/[0.08] backdrop-blur-2xl mb-6 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        {/* Category & Target Level Badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.05]">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            المجال:{' '}
            <strong className="text-zinc-200">
              {currentQ.category.toUpperCase()}
            </strong>
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300">
            مستوى المعايرة: {currentQ.cefrTarget}
          </span>
        </div>

        {/* Question Text */}
        <div
          className="text-base sm:text-lg font-medium text-zinc-100 mb-6 leading-relaxed whitespace-pre-line"
          dir="ltr"
        >
          {currentQ.question}
        </div>

        {/* Listening Question Specific Audio Trigger */}
        {currentQ.category === 'listening' && currentQ.audioPromptText && (
          <div className="p-4 rounded-xl bg-[#0c0d14] border border-white/[0.06] mb-6 flex items-center justify-between gap-4" dir="ltr">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-lg">
                {selectedVoice.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">{selectedVoice.name} (ElevenLabs Voice)</div>
                <div className="text-[11px] text-zinc-400">Click play to listen to the audio prompt</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayListeningPrompt}
              disabled={audioLoading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-white/20 border-white/30 text-white'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-zinc-200 hover:text-white'
              }`}
            >
              {audioLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span>{audioLoading ? 'Buffering...' : isPlayingAudio ? 'Pause Audio' : 'Play Audio Prompt'}</span>
            </button>
          </div>
        )}

        {/* Multiple Choice Options */}
        {currentQ.options && currentQ.options.length > 0 && (
          <div className="space-y-3" dir="ltr">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-white/[0.1] border-white/[0.25] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                      : 'bg-[#0b0c12]/70 border-white/[0.05] text-zinc-300 hover:bg-white/[0.04] hover:border-white/[0.1]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-white text-black'
                        : 'bg-white/[0.05] border border-white/[0.08] text-zinc-400'
                    }`}
                  >
                    {optionLetters[optIdx]}
                  </div>
                  <span className="text-sm font-medium leading-normal">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Production (Speaking or Writing) */}
        {currentQ.category === 'production' && (
          <div className="space-y-4" dir="ltr">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                You can speak your sentence aloud or type it below:
              </span>

              {FathomITSSoundManager.isSTTSupported() && (
                <button
                  type="button"
                  onClick={handleToggleVoiceRecording}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-white/20 border-white/30 text-white animate-pulse'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening (Speak now)...' : 'Record with Microphone'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={String(answers[currentQ.id] || speechTranscript || '')}
              onChange={(e) => handleTextProduction(e.target.value)}
              placeholder="Type your formal passive rephrasing here..."
              className="w-full p-3.5 rounded-xl bg-[#0c0d14] border border-white/[0.08] text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white/[0.25] transition-all"
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => {
            FathomITSSoundManager.stopCurrentAudio();
            setCurrentIndex((prev) => Math.max(0, prev - 1));
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            currentIndex === 0
              ? 'opacity-40 border-white/[0.02] text-zinc-600 cursor-not-allowed'
              : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06] text-zinc-300 hover:text-white cursor-pointer'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          <span>السؤال السابق</span>
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              FathomITSSoundManager.stopCurrentAudio();
              setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-zinc-200 hover:bg-white text-black flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_2px_12px_rgba(255,255,255,0.06)]"
          >
            <span>السؤال التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="px-7 py-2.5 rounded-xl text-xs font-bold bg-white text-black flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
          >
            <span>إنهاء واستخراج النتيجة المعيارية</span>
            <CheckCircle2 className="w-4 h-4 text-black" />
          </button>
        )}
      </div>
    </div>
  );
};
