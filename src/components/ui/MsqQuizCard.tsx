import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Award, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MSQQuizItem } from '@/types/fathomITS';

export interface MsqQuizCardProps {
  quiz: MSQQuizItem;
  isStreaming?: boolean;
}

export const MsqQuizCard: React.FC<MsqQuizCardProps> = ({ quiz, isStreaming }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(quiz.userSelectedIndex ?? null);
  const [showExplanation, setShowExplanation] = useState<boolean>(Boolean(quiz.userSelectedIndex !== undefined));

  const isAnswered = selectedIndex !== null;
  const isCorrect = isAnswered && selectedIndex === quiz.correctIndex;
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleSelect = (index: number) => {
    if (isStreaming) return;
    setSelectedIndex(index);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setShowExplanation(false);
  };

  return (
    <div className="w-full my-3.5 rounded-2xl bg-[#08090d]/95 backdrop-blur-xl border border-white/[0.08] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] font-sans select-none text-right transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 mb-3.5" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <HelpCircle className="size-4 text-zinc-200" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>تحدي لغوي تفاعلي (MSQ)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 font-semibold">
                Fathom ITS 1
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-normal">
              اختر الإجابة الصحيحة للتحقق من الاستيعاب وتثبيت القاعدة
            </div>
          </div>
        </div>

        {/* Points Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-medium text-zinc-300">
          <Award className="size-3.5 text-zinc-300" />
          <span>+{quiz.pointsAwarded || 2} pts</span>
        </div>
      </div>

      {/* Question Body (LTR for English Target Language) */}
      <div className="text-left dir-ltr mb-4">
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
          Question
        </div>
        <p className="text-zinc-100 text-sm sm:text-base font-medium leading-relaxed">
          {quiz.question}
        </p>
      </div>

      {/* Interactive Options List */}
      <div className="space-y-2 dir-ltr text-left">
        {quiz.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isThisCorrect = idx === quiz.correctIndex;

          let stateStyles = "bg-white/[0.02] border-white/[0.07] text-zinc-300 hover:bg-white/[0.05] hover:border-white/[0.15]";
          if (isAnswered) {
            if (isThisCorrect) {
              stateStyles = "bg-emerald-500/[0.12] border-emerald-500/40 text-emerald-200 font-medium shadow-[0_0_15px_rgba(16,185,129,0.08)]";
            } else if (isSelected && !isThisCorrect) {
              stateStyles = "bg-rose-500/[0.12] border-rose-500/40 text-rose-200";
            } else {
              stateStyles = "bg-white/[0.01] border-white/[0.04] text-zinc-500 opacity-60";
            }
          }

          return (
            <button
              key={`opt-${idx}`}
              type="button"
              disabled={isStreaming}
              onClick={() => handleSelect(idx)}
              className={cn(
                "w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-sm transition-all text-left group cursor-pointer",
                stateStyles
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={cn(
                  "size-6 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-semibold border transition-all",
                  isAnswered && isThisCorrect
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : isAnswered && isSelected && !isThisCorrect
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                    : "bg-white/[0.04] border-white/[0.08] text-zinc-300 group-hover:border-white/[0.2]"
                )}>
                  {optionLetters[idx] || idx + 1}
                </span>
                <span className="font-sans leading-normal break-words">
                  {option}
                </span>
              </div>

              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="size-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer & Explanation Card */}
      {isAnswered && showExplanation && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] animate-in fade-in duration-200" dir="rtl">
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-right">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isCorrect ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    <span>إجابة صحيحة! أحسنت (+{quiz.pointsAwarded || 2} نقاط)</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="size-3.5" />
                    <span>إجابة غير دقيقة</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
                title="إعادة المحاولة"
              >
                <RotateCcw className="size-3" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {quiz.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
