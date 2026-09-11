import React from 'react';
import { Award, TrendingUp, CheckCircle } from 'lucide-react';
import { PointIncrementNotice } from '@/types/fathomITS';

export interface ItsProgressBadgeProps {
  data: PointIncrementNotice & { currentLevel?: string; feedback?: string };
}

export const ItsProgressBadge: React.FC<ItsProgressBadgeProps> = ({ data }) => {
  return (
    <div className="w-full my-2.5 flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#0a0c10]/90 backdrop-blur-md border border-white/[0.08] shadow-sm font-sans select-none" dir="rtl">
      <div className="flex items-center gap-2.5">
        <div className="size-6 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
          <Award className="size-3.5 text-zinc-200" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-zinc-100">
            {data.reason || 'إتقان لغوي مستمر'}
          </span>
          {data.metric && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07] text-zinc-300">
              {data.metric}
            </span>
          )}
          {data.currentLevel && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
              CEFR {data.currentLevel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
        <TrendingUp className="size-3.5" />
        <span>+{data.delta || 1} pts</span>
      </div>
    </div>
  );
};
