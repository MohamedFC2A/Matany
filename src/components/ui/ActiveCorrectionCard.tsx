import React from 'react';
import { ShieldCheck, ArrowLeft, SpellCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CorrectionCard } from '@/types/fathomITS';

export interface ActiveCorrectionCardProps {
  correction: CorrectionCard;
}

export const ActiveCorrectionCard: React.FC<ActiveCorrectionCardProps> = ({ correction }) => {
  return (
    <div className="w-full my-3.5 rounded-2xl bg-[#08090d]/95 backdrop-blur-xl border border-white/[0.08] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] font-sans select-none text-right transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 mb-3.5" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <SpellCheck className="size-4 text-zinc-200" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>تصحيح لغوي فوري (Active Correction)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 font-semibold">
                Cambridge Standard
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-normal">
              مقارنة العبارة المعيارية وتوضيح القاعدة النحوية أو الدلالية
            </div>
          </div>
        </div>

        {/* Category Pill */}
        {correction.category && (
          <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300">
            {correction.category}
          </div>
        )}
      </div>

      {/* Comparison Grid (Original vs Cambridge Native) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5 dir-ltr text-left">
        {/* Original Phrasing */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-rose-500/[0.05] border border-rose-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
              Original Phrase
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 font-medium">
              Needs Correction
            </span>
          </div>
          <p className="text-xs sm:text-sm text-rose-100/90 font-medium leading-relaxed line-through decoration-rose-400/60">
            {correction.originalText}
          </p>
        </div>

        {/* Improved Cambridge Phrasing */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/25">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Native British Standard
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-medium">
              Recommended
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-semibold leading-relaxed">
            {correction.improvedText}
          </p>
        </div>
      </div>

      {/* Rule Explanation */}
      {correction.ruleExplanation && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-right" dir="rtl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 mb-1">
            <ShieldCheck className="size-3.5 text-zinc-300" />
            <span>القاعدة التوجيهية (Grammar & Usage Rule):</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            {correction.ruleExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
