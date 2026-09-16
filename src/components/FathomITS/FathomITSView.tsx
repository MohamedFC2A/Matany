// ============================================================================
// FATHOM ITS 1 — MAIN SYSTEM VIEW & STATE MACHINE ORCHESTRATOR
// The World's First Autonomous Sovereign Intelligent Tutoring System
// Pure Obsidian Glassmorphism — Zero Glowing / Zero Neon
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  FathomITSFlowState,
  FathomITSStudentProfile,
  TargetLanguageCode,
  CEFRLevel,
  TutorVoice,
  DiagnosticResult,
  CURATED_TUTOR_VOICES
} from '../../types/fathomITS';
import { FathomITSService } from '../../services/fathomITSService';
import { getOrCreateDeviceId } from '../../services/supabase';
import { FathomITSOnboarding } from './FathomITSOnboarding';
import { FathomITSDiagnosticTest } from './FathomITSDiagnosticTest';
import { FathomITSRoadmap } from './FathomITSRoadmap';
import { FathomITSTutoringChat } from './FathomITSTutoringChat';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface FathomITSViewProps {
  onExitToMainChat: () => void;
}

export const FathomITSView: React.FC<FathomITSViewProps> = ({ onExitToMainChat }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FathomITSStudentProfile | null>(null);
  const [flowState, setFlowState] = useState<FathomITSFlowState>('onboarding');

  // Load existing profile from Supabase / localStorage on mount
  useEffect(() => {
    let isMounted = true;

    const initProfile = async () => {
      try {
        const existing = await FathomITSService.loadStudentProfile();
        if (isMounted) {
          if (existing) {
            setProfile(existing);
            // If they already took the diagnostic test, resume at roadmap or tutoring
            if (existing.baselineAssessment) {
              setFlowState('tutoring');
            } else {
              setFlowState('diagnostic');
            }
          } else {
            setFlowState('onboarding');
          }
          setLoading(false);
        }
      } catch (e) {
        console.error('[Fathom ITS Init Error]:', e);
        if (isMounted) {
          setFlowState('onboarding');
          setLoading(false);
        }
      }
    };

    initProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler: Complete Onboarding Setup
  const handleCompleteOnboarding = async (config: {
    language: TargetLanguageCode;
    voice: TutorVoice;
    targetCEFR: CEFRLevel;
  }) => {
    const deviceId = getOrCreateDeviceId();
    const newProfile: FathomITSStudentProfile = {
      deviceId,
      targetLanguage: config.language,
      selectedVoice: config.voice,
      targetCEFR: config.targetCEFR,
      currentCEFR: 'A1',
      currentPoints: 0,
      baselineAssessment: null,
      totalStudyMinutes: 0,
      sessionsCompleted: 0,
      quizzesSolved: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setProfile(newProfile);
    await FathomITSService.saveStudentProfile(newProfile);
    setFlowState('diagnostic');
  };

  // Handler: Complete Diagnostic Test
  const handleCompleteDiagnostic = async (assessment: DiagnosticResult) => {
    if (!profile) return;

    const updatedProfile: FathomITSStudentProfile = {
      ...profile,
      currentCEFR: assessment.diagnosedLevel,
      currentPoints: assessment.rawScore,
      baselineAssessment: assessment,
      lastActive: new Date().toISOString()
    };

    setProfile(updatedProfile);
    await FathomITSService.saveStudentProfile(updatedProfile);
    await FathomITSService.saveAssessment(updatedProfile, assessment);
    setFlowState('roadmap');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060709] flex flex-col items-center justify-center text-center p-4 select-none">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <div className="text-sm font-mono text-zinc-300">جاري تهيئة منظومة Fathom ITS 1 التعليمية...</div>
        <div className="text-xs text-zinc-500 mt-1 font-mono">Loading long-term student memory</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Subtle non-glowing ambient background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Navigation Bar for Fathom ITS 1 */}
      <header className="sticky top-0 z-50 w-full bg-[#060709]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-8 py-3 select-none flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.6)]" dir="rtl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitToMainChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer"
            title="العودة للمحادثات العامة"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للمنصة</span>
          </button>

          <div className="h-4 w-[1px] bg-white/[0.1] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider bg-white/[0.08] text-white border border-white/[0.1]">
              FATHOM ITS 1
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline font-sans">
              المنظومة التعليمية المستقلة الأولى عالمياً • English Language
            </span>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setFlowState('onboarding')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              flowState === 'onboarding'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            1. الإعداد
          </button>

          <span className="text-zinc-700 text-xs">/</span>

          <button
            type="button"
            onClick={() => setFlowState('diagnostic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              flowState === 'diagnostic'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            2. الاختبار التشخيصي
          </button>

          <span className="text-zinc-700 text-xs">/</span>

          <button
            type="button"
            onClick={() => setFlowState('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              flowState === 'roadmap'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            3. خريطة الساعات
          </button>

          <span className="text-zinc-700 text-xs">/</span>

          <button
            type="button"
            onClick={() => setFlowState('tutoring')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              flowState === 'tutoring'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            4. التدريس الحي
          </button>
        </div>
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-1 relative z-10 flex flex-col justify-center">
        {flowState === 'onboarding' && (
          <FathomITSOnboarding
            onComplete={handleCompleteOnboarding}
            onCancel={onExitToMainChat}
          />
        )}

        {flowState === 'diagnostic' && (
          <FathomITSDiagnosticTest
            selectedVoice={profile?.selectedVoice || (CURATED_TUTOR_VOICES[0] as TutorVoice)}
            onCompleteTest={handleCompleteDiagnostic}
            onCancel={() => setFlowState('onboarding')}
          />
        )}

        {flowState === 'roadmap' && profile && (
          <FathomITSRoadmap
            currentCEFR={profile.currentCEFR}
            targetCEFR={profile.targetCEFR}
            baselineAssessment={profile.baselineAssessment}
            selectedVoice={profile.selectedVoice}
            onStartTutoring={() => setFlowState('tutoring')}
            onRecalibrate={() => setFlowState('onboarding')}
          />
        )}

        {flowState === 'tutoring' && profile && (
          <FathomITSTutoringChat
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
            onBackToRoadmap={() => setFlowState('roadmap')}
          />
        )}
      </main>
    </div>
  );
};
