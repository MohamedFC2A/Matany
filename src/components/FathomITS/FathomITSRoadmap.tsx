// ============================================================================
// FATHOM ITS 1 — GUIDED LEARNING HOURS & CEFR ROADMAP MATRIX
// Empirical ALTE/Cambridge Study Hours Calculator & Trajectory Planning
// Pure Obsidian Glassmorphism — Zero Glowing / Zero Neon
// ============================================================================

import React from 'react';
import { CEFRLevel, DiagnosticResult, TutorVoice, GuidedLearningProjection } from '../../types/fathomITS';
import { FathomITSService } from '../../services/fathomITSService';
import { Clock, Calendar, Zap, Compass, CheckCircle2, ArrowLeft, Target, ShieldCheck } from 'lucide-react';

interface FathomITSRoadmapProps {
  currentCEFR: CEFRLevel;
  targetCEFR: CEFRLevel;
  baselineAssessment?: DiagnosticResult | null;
  selectedVoice: TutorVoice;
  onStartTutoring: () => void;
  onRecalibrate?: () => void;
}

export const FathomITSRoadmap: React.FC<FathomITSRoadmapProps> = ({
  currentCEFR,
  targetCEFR,
  baselineAssessment,
  selectedVoice,
  onStartTutoring,
  onRecalibrate
}) => {
  const projection: GuidedLearningProjection = FathomITSService.computeGuidedHours(currentCEFR, targetCEFR);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none" dir="rtl">
      {/* Top Banner Card */}
      <div className="rounded-2xl bg-[#090a0f]/95 border border-white/[0.08] backdrop-blur-2xl p-6 sm:p-8 mb-6 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-zinc-300 mb-3">
              <Compass className="w-3.5 h-3.5 text-zinc-300" />
              <span>ALTE & CAMBRIDGE GUIDED LEARNING HOURS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              خريطة الطريق ومصفوفة الساعات الموجهة
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              وفق بيانات اختبارك التشخيصي المكتمل، تم حساب الساعات المعتمدة المطلوبة بدقة للانتقال من مستواك الحالي{' '}
              <strong className="text-zinc-200">({currentCEFR})</strong> إلى هدفك المنشود{' '}
              <strong className="text-zinc-200">({targetCEFR})</strong> مع تحديد مساري الإنجاز الأسرع والأطول.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0e15] border border-white/[0.06] shrink-0">
            <span className="text-2xl">{selectedVoice.avatar}</span>
            <div>
              <div className="text-xs font-bold text-zinc-200">{selectedVoice.name}</div>
              <div className="text-[10px] text-zinc-400 font-mono">معلّمك الشخصي النشط</div>
            </div>
          </div>
        </div>

        {/* Level Progression Indicator */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
              نقطة البداية (المستوى الحالي)
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{currentCEFR}</span>
              {baselineAssessment && (
                <span className="text-xs font-mono text-zinc-400 font-normal">
                  ({baselineAssessment.subLevelString} • Scale: {baselineAssessment.cambridgeScale})
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
              الهدف المستهدف (CEFR Target)
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-zinc-300" />
              <span>{targetCEFR} Mastery</span>
            </div>
          </div>
        </div>

        {/* The Two Time Estimation Pathways (Min Time vs Max Time) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pathway 1: Accelerated Path (Minimum Time with Max Daily Hours) */}
          <div className="p-5 rounded-xl bg-[#0c0d14]/90 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-zinc-200" />
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                  المسار المكثف (الوقت الأقل)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                دراسة سريعة
              </span>
            </div>

            <div className="text-3xl font-extrabold text-white mb-2">
              {projection.accelerated.weeks} أسابيع{' '}
              <span className="text-xs font-normal text-zinc-400 font-mono">
                (~{projection.accelerated.days} يوماً)
              </span>
            </div>

            <div className="text-xs text-zinc-400 leading-relaxed mb-4">
              يتطلب هذا المسار وتيرة تعلم مركزة بمعدل{' '}
              <strong className="text-zinc-200">{projection.accelerated.hoursPerDay} ساعات يومياً</strong>{' '}
              (الحد الأقصى لساعات التعلم اليومية الفعالة لسرعة الوصول للمستوى).
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-3 border-t border-white/[0.04]">
              إجمالي ساعات كامبريدج المطلوبة: {projection.totalGuidedHours} ساعة موجهة
            </div>
          </div>

          {/* Pathway 2: Steady Path (Maximum Time with Min Daily Hours) */}
          <div className="p-5 rounded-xl bg-[#0c0d14]/90 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-200" />
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                  المسار التدريجي (الوقت الأقصى)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                دراسة مرنة
              </span>
            </div>

            <div className="text-3xl font-extrabold text-white mb-2">
              {projection.steady.months} أشهر{' '}
              <span className="text-xs font-normal text-zinc-400 font-mono">تقريباً</span>
            </div>

            <div className="text-xs text-zinc-400 leading-relaxed mb-4">
              يعتمد هذا المسار على وتيرة هادئة بمعدل{' '}
              <strong className="text-zinc-200">45 دقيقة يومياً</strong>{' '}
              (الحد الأدنى لساعات التعلم اليومية دون انقطاع، مما يعطي مداً زمنياً أقصى).
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-3 border-t border-white/[0.04]">
              إجمالي ساعات كامبريدج المطلوبة: {projection.totalGuidedHours} ساعة موجهة
            </div>
          </div>
        </div>

        {/* Milestone Steps Breakdown */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
            المراحل المرحلية المعتمدة (Milestones)
          </h3>
          <div className="space-y-2.5">
            {projection.milestoneSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center font-mono text-[11px] font-bold text-zinc-300">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{step.description}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      الانتقال من {step.fromLevel} إلى {step.toLevel}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-zinc-300 shrink-0">
                  {step.hours} ساعة
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          {onRecalibrate && (
            <button
              type="button"
              onClick={onRecalibrate}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all cursor-pointer"
            >
              إعادة المعايرة أو تغيير المعلم
            </button>
          )}

          <button
            type="button"
            onClick={onStartTutoring}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs tracking-wide bg-zinc-100 hover:bg-white text-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.08)] active:scale-95"
          >
            <span>بدء المحادثة التدريسية الممتدة والتفاعل الحي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
