// ============================================================================
// FATHOM ITS 1 — EXTENDED CONTINUOUS TUTORING DIALOGUE ENGINE
// Real-Time Voice Synthesis (ElevenLabs), Voice Input (STT), MSQ Quizzes,
// Point-by-Point Granular Progression (+1 Point), and Real-Time Correction Cards
// Pure Obsidian Glassmorphism — Strictly Zero Glowing / Zero Neon
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  FathomITSStudentProfile,
  FathomITSMessage,
  MSQQuizItem,
  PointIncrementNotice,
  CorrectionCard
} from '../../types/fathomITS';
import { FathomITSService } from '../../services/fathomITSService';
import { FathomITSSoundManager } from './FathomITSSoundManager';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Zap,
  BookOpen
} from 'lucide-react';

interface FathomITSTutoringChatProps {
  profile: FathomITSStudentProfile;
  onUpdateProfile: (updated: FathomITSStudentProfile) => void;
  onBackToRoadmap: () => void;
}

export const FathomITSTutoringChat: React.FC<FathomITSTutoringChatProps> = ({
  profile,
  onUpdateProfile,
  onBackToRoadmap
}) => {
  const [messages, setMessages] = useState<FathomITSMessage[]>(() => {
    const saved = FathomITSService.loadTutoringMessages();
    if (saved.length > 0) return saved;

    // Default pedagogical opening message tailored to the student's baseline
    const initialText = `Welcome to Fathom ITS 1! I am ${profile.selectedVoice.name}, your personal tutor. 

Based on your Cambridge diagnostic evaluation, your baseline is **${profile.currentCEFR}** (${profile.baselineAssessment?.cambridgeScale ? `Cambridge Scale: ${profile.baselineAssessment.cambridgeScale}` : ''}). Our target is **${profile.targetCEFR}**.

We will engage in an extended, immersive conversational discourse. You can reply by speaking via the microphone or by typing. Every correct structure, grammatical improvement, and quiz solved will earn you points (+1 Point) toward your mastery goal.

To begin, tell me: what specific professional or academic goals are driving your journey to master English?`;

    return [
      {
        id: 'msg-init',
        role: 'tutor',
        content: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pointIncrement: {
          id: 'pt-0',
          delta: 1,
          metric: 'Fluency',
          reason: 'Initial session initialization and diagnostic baseline establishment.',
          timestamp: new Date().toISOString()
        }
      }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [autoSpeakTutor, setAutoSpeakTutor] = useState<boolean>(true);

  // Speech Recognition State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechInterim, setSpeechInterim] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    FathomITSService.saveTutoringMessages(profile.deviceId, messages);
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      FathomITSSoundManager.stopCurrentAudio();
      FathomITSSoundManager.stopListening();
    };
  }, []);

  // Handle Tutor Speech Synthesis
  const handlePlayTutorAudio = async (msgId: string, text: string) => {
    if (activePlaybackId === msgId) {
      FathomITSSoundManager.stopCurrentAudio();
      setActivePlaybackId(null);
      return;
    }

    setActivePlaybackId(msgId);
    await FathomITSSoundManager.speakText(text, profile.selectedVoice.id, {
      playbackRate: audioSpeed,
      onStart: () => setActivePlaybackId(msgId),
      onEnd: () => setActivePlaybackId(null),
      onError: () => setActivePlaybackId(null)
    });
  };

  // Toggle Voice Input (Microphone STT)
  const handleToggleMic = () => {
    if (isRecording) {
      FathomITSSoundManager.stopListening();
      setIsRecording(false);
      return;
    }

    const started = FathomITSSoundManager.startListening(
      (res) => {
        setSpeechInterim(res.transcript);
        if (res.isFinal) {
          setInputVal((prev) => (prev ? prev + ' ' + res.transcript : res.transcript));
          setSpeechInterim('');
        }
      },
      () => {
        setIsRecording(false);
        setSpeechInterim('');
      },
      (err) => {
        console.error('STT error:', err);
        setIsRecording(false);
        setSpeechInterim('');
      }
    );

    if (started) {
      setIsRecording(true);
    }
  };

  // Handle Sending a Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isSending) return;

    if (isRecording) {
      FathomITSSoundManager.stopListening();
      setIsRecording(false);
    }

    const userMsg: FathomITSMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setSpeechInterim('');
    setIsSending(true);

    try {
      const response = await fetch('/api/fathom-its/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          studentProfile: {
            targetLanguage: profile.targetLanguage,
            voiceName: profile.selectedVoice.name,
            currentCEFR: profile.currentCEFR,
            targetCEFR: profile.targetCEFR,
            currentPoints: profile.currentPoints,
            baselineAssessment: profile.baselineAssessment
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const tutorMsg: FathomITSMessage = {
        id: `tut-${Date.now()}`,
        role: 'tutor',
        content: data.tutorReply || 'Thank you for your response. Let us continue.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pointIncrement: data.pointIncrement
          ? {
              id: `pt-${Date.now()}`,
              delta: data.pointIncrement.delta || 1,
              metric: data.pointIncrement.metric || 'Syntax',
              reason: data.pointIncrement.reason || 'Accurate communicative performance.',
              timestamp: new Date().toISOString()
            }
          : undefined,
        msq: data.msq
          ? {
              id: `msq-${Date.now()}`,
              question: data.msq.question,
              options: data.msq.options,
              correctIndex: data.msq.correctIndex,
              explanation: data.msq.explanation,
              pointsAwarded: data.msq.pointsAwarded || 2,
              isAnswered: false
            }
          : undefined,
        correction: data.correction
          ? {
              originalText: data.correction.originalText,
              improvedText: data.correction.improvedText,
              ruleExplanation: data.correction.ruleExplanation,
              category: data.correction.category || 'Grammar'
            }
          : undefined
      };

      // Update student points in profile if increment awarded
      if (tutorMsg.pointIncrement) {
        const newPoints = profile.currentPoints + tutorMsg.pointIncrement.delta;
        const updatedProfile = {
          ...profile,
          currentPoints: newPoints,
          lastActive: new Date().toISOString()
        };
        onUpdateProfile(updatedProfile);
        FathomITSService.saveStudentProfile(updatedProfile);
      }

      setMessages((prev) => [...prev, tutorMsg]);

      // Auto-speak tutor response if enabled
      if (autoSpeakTutor && data.spokenScript) {
        handlePlayTutorAudio(tutorMsg.id, data.spokenScript);
      }
    } catch (err) {
      console.error('[Tutoring Send Error]:', err);
      // Fallback message
      const fallbackMsg: FathomITSMessage = {
        id: `tut-${Date.now()}`,
        role: 'tutor',
        content: `I received your message: "${text}". Let us focus on maintaining syntactic consistency. Could you expand further on that thought using a formal passive structure?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle User Solving Inline MSQ Quiz
  const handleAnswerMSQ = (msgId: string, optionIdx: number) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId && msg.msq && !msg.msq.isAnswered) {
          const isCorrect = optionIdx === msg.msq.correctIndex;
          const updatedMsq: MSQQuizItem = {
            ...msg.msq,
            userSelectedIndex: optionIdx,
            isAnswered: true
          };

          if (isCorrect) {
            const addedPoints = msg.msq.pointsAwarded || 2;
            const updatedProfile = {
              ...profile,
              currentPoints: profile.currentPoints + addedPoints,
              quizzesSolved: profile.quizzesSolved + 1
            };
            onUpdateProfile(updatedProfile);
            FathomITSService.saveStudentProfile(updatedProfile);
          }

          return {
            ...msg,
            msq: updatedMsq
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 flex flex-col h-[calc(100vh-4.5rem)] select-none">
      {/* Top Header Information & Points Bar */}
      <div className="rounded-2xl bg-[#090a0f]/95 border border-white/[0.08] backdrop-blur-2xl p-3 sm:p-4 mb-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3 shrink-0" dir="rtl">
        {/* Left Info: Tutor Avatar & Current Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xl shrink-0">
            {profile.selectedVoice.avatar}
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
              <span>{profile.selectedVoice.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.06]">
                ElevenLabs Audio
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              FATHOM ITS 1 • {profile.selectedVoice.roleTitle}
            </div>
          </div>
        </div>

        {/* Center / Right Metrics: Points and CEFR Level */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Points Pill (Point-by-Point Progression) */}
          <div className="px-3 py-1.5 rounded-xl bg-[#0e1017] border border-white/[0.07] flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-zinc-300" />
            <div className="text-right">
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider leading-none">
                النقاط اللغوية
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {profile.currentPoints}{' '}
                <span className="text-[10px] font-normal text-zinc-400">نقطة</span>
              </div>
            </div>
          </div>

          {/* CEFR Level Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-[#0e1017] border border-white/[0.07] flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
            <div className="text-right">
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider leading-none">
                المستوى (CEFR)
              </div>
              <div className="text-xs font-mono font-bold text-zinc-200">
                {profile.currentCEFR} → {profile.targetCEFR}
              </div>
            </div>
          </div>

          {/* Audio Controls (Auto-speak toggle & Speed) */}
          <button
            type="button"
            onClick={() => setAutoSpeakTutor((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              autoSpeakTutor
                ? 'bg-white/[0.08] border-white/[0.15] text-white'
                : 'bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-zinc-300'
            }`}
            title={autoSpeakTutor ? 'نطق المعلم الصوتي مفعل تلقائياً' : 'النطق الصوتي معطل'}
          >
            {autoSpeakTutor ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Back to Roadmap */}
          <button
            type="button"
            onClick={onBackToRoadmap}
            className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all cursor-pointer"
          >
            الخطة والساعات
          </button>
        </div>
      </div>

      {/* Main Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 sm:p-4 rounded-2xl bg-[#07080a]/80 border border-white/[0.06] backdrop-blur-2xl shadow-inner mb-3">
        {messages.map((msg) => {
          const isTutor = msg.role === 'tutor';
          const isAudioPlaying = activePlaybackId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'} w-full`}
            >
              {/* Message Header Label */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-zinc-500">
                <span>{isTutor ? profile.selectedVoice.name : 'أنت (الطالب)'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content Box */}
              <div
                className={`max-w-[92%] sm:max-w-[80%] p-4 sm:p-5 rounded-2xl border text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-[#0a0b10] border-white/[0.08] text-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                    : 'bg-[#12131b] border-white/[0.12] text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                }`}
                dir={isTutor ? 'ltr' : 'ltr'}
              >
                {/* Text Body */}
                <div className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</div>

                {/* Tutor Audio Playback Strip */}
                {isTutor && (
                  <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handlePlayTutorAudio(msg.id, msg.content)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                        isAudioPlaying
                          ? 'bg-white/20 border-white/30 text-white shadow-inner'
                          : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.08] text-zinc-300 hover:text-white'
                      }`}
                    >
                      {isAudioPlaying ? (
                        <Square className="w-3.5 h-3.5 fill-white text-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-zinc-300 text-zinc-300" />
                      )}
                      <span>{isAudioPlaying ? 'Stop Audio' : 'Listen with ElevenLabs'}</span>
                    </button>

                    {/* Non-Glowing Obsidian Wave Indicator */}
                    {isAudioPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-zinc-400 rounded-full animate-pulse" />
                        <div className="w-1 h-5 bg-zinc-200 rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-2 bg-zinc-500 rounded-full animate-pulse delay-150" />
                        <div className="w-1 h-4 bg-zinc-300 rounded-full animate-pulse delay-100" />
                      </div>
                    )}
                  </div>
                )}

                {/* Real Error Correction & Phrasing Card */}
                {msg.correction && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]" dir="rtl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>بطاقة التصحيح اللغوي والبلاغي ({msg.correction.category})</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="text-zinc-400">
                        صياغتك الأصلية:{' '}
                        <span className="line-through text-zinc-500 font-mono" dir="ltr">
                          &quot;{msg.correction.originalText}&quot;
                        </span>
                      </div>
                      <div className="text-zinc-200 font-medium">
                        الصياغة الأكاديمية الدقيقة:{' '}
                        <span className="text-white font-mono" dir="ltr">
                          &quot;{msg.correction.improvedText}&quot;
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-white/[0.04]">
                        القاعدة: {msg.correction.ruleExplanation}
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline MSQ Quiz Card */}
                {msg.msq && (
                  <div className="mt-4 p-4 rounded-xl bg-[#0d0e16] border border-white/[0.08]" dir="ltr">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                        <Zap className="w-3.5 h-3.5 text-zinc-300" />
                        <span>Interactive Cambridge Challenge (+{msg.msq.pointsAwarded} pts)</span>
                      </div>
                      {msg.msq.isAnswered && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                          Answered
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-medium text-zinc-200 mb-3 whitespace-pre-line">
                      {msg.msq.question}
                    </div>

                    <div className="space-y-2">
                      {msg.msq.options.map((opt, optIdx) => {
                        const isSelected = msg.msq?.userSelectedIndex === optIdx;
                        const isCorrect = optIdx === msg.msq?.correctIndex;
                        const answered = msg.msq?.isAnswered;

                        let styleClasses = 'bg-white/[0.03] border-white/[0.06] text-zinc-300 hover:bg-white/[0.07]';
                        if (answered) {
                          if (isCorrect) {
                            styleClasses = 'bg-white/[0.12] border-white/[0.25] text-white font-bold';
                          } else if (isSelected && !isCorrect) {
                            styleClasses = 'bg-white/[0.02] border-white/[0.04] text-zinc-500 line-through';
                          } else {
                            styleClasses = 'opacity-40 border-transparent text-zinc-600';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={answered}
                            onClick={() => handleAnswerMSQ(msg.id, optIdx)}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${styleClasses} ${
                              !answered ? 'cursor-pointer' : 'cursor-default'
                            }`}
                          >
                            <span>{opt}</span>
                            {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-zinc-200 shrink-0" />}
                            {answered && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {msg.msq.isAnswered && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] text-zinc-400">
                        <strong>Rationale:</strong> {msg.msq.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Point-by-Point Progression Real-Time Notification Pill */}
              {msg.pointIncrement && (
                <div className="mt-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 shadow-sm" dir="rtl">
                  <Award className="w-3 h-3 text-zinc-300" />
                  <span className="font-bold text-white">+{msg.pointIncrement.delta} نقطة</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-zinc-400">{msg.pointIncrement.reason}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isSending && (
          <div className="flex flex-col items-start w-full">
            <div className="text-[11px] font-mono text-zinc-500 mb-1 px-1">
              {profile.selectedVoice.name} يستدل ويحلل تفاعلك...
            </div>
            <div className="p-4 rounded-2xl bg-[#0a0b10] border border-white/[0.08] flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse delay-150" />
              <span className="font-mono text-xs text-zinc-400 ml-2">
                meta/muse-spark-1.3-contributor reasoning
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Text + Mic STT + Quick Shortcuts) */}
      <div className="p-3 rounded-2xl bg-[#090a0f]/95 border border-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] shrink-0">
        {/* Live STT Interim Preview */}
        {speechInterim && (
          <div className="px-3 py-1.5 mb-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 font-mono truncate" dir="ltr">
            Listening: {speechInterim}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Microphone STT Button */}
          {FathomITSSoundManager.isSTTSupported() && (
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isRecording
                  ? 'bg-white/20 border-white/30 text-white animate-pulse'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.07] text-zinc-300 hover:text-white'
              }`}
              title={isRecording ? 'إيقاف التسجيل الصوتي' : 'التحدث صوتياً (Voice STT)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* Text Input */}
          <input
            type="text"
            dir="ltr"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isRecording
                ? 'Speak in English now... your words will appear here'
                : 'Reply in English (speak or type)...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="button"
            disabled={!inputVal.trim() || isSending}
            onClick={() => handleSendMessage()}
            className={`p-3 rounded-xl border transition-all shrink-0 ${
              inputVal.trim() && !isSending
                ? 'bg-zinc-100 hover:bg-white text-black border-transparent cursor-pointer active:scale-95 shadow-[0_2px_12px_rgba(255,255,255,0.08)]'
                : 'bg-white/[0.02] border-white/[0.04] text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggested Prompts */}
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/[0.04] overflow-x-auto text-[11px] text-zinc-400 no-scrollbar" dir="ltr">
          <span className="text-[10px] text-zinc-600 font-mono shrink-0">Suggestions:</span>
          {[
            'Could you give me an example with inversion?',
            'How can I improve my Cambridge B2/C1 vocabulary?',
            'Test my listening comprehension with an audio prompt.',
            'Give me an MSQ challenge on conditionals.'
          ].map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(promptText)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] text-zinc-300 hover:text-white shrink-0 transition-all cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
