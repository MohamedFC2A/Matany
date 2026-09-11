import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Play, 
  Check, 
  FileQuestion,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MSQExamSuite } from '@/types/fathomITS';

export interface MsqExamCardProps {
  exam: MSQExamSuite;
  isStreaming?: boolean;
}

export const MsqExamCard: React.FC<MsqExamCardProps> = ({ exam, isStreaming }) => {
  const [examState, setExamState] = useState<'intro' | 'active' | 'completed'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(
    (exam.durationMinutes || 10) * 60
  );
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect'>('all');

  const timerRef = useRef<any>(null);
  const totalQuestions = exam.questions?.length || 0;
  const currentQuestion = exam.questions?.[currentQuestionIndex];
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Start the countdown timer when entering active state
  useEffect(() => {
    if (examState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
        setTimeTakenSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    if (isStreaming || totalQuestions === 0) return;
    setExamState('active');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemainingSeconds((exam.durationMinutes || 10) * 60);
    setTimeTakenSeconds(0);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (examState !== 'active') return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleFinalSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowConfirmSubmitModal(false);
    setExamState('completed');
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds((exam.durationMinutes || 10) * 60);
    setTimeTakenSeconds(0);
    setExamState('intro');
  };

  // Evaluation calculations
  const { correctCount, percentage, isPassed, totalPointsEarned } = useMemo(() => {
    if (!exam.questions || exam.questions.length === 0) {
      return { correctCount: 0, percentage: 0, isPassed: false, totalPointsEarned: 0 };
    }
    let correct = 0;
    let earnedPoints = 0;
    exam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
        earnedPoints += (q.points || 2);
      }
    });
    const pct = Math.round((correct / exam.questions.length) * 100);
    const passing = pct >= (exam.passingScore || 70);
    return {
      correctCount: correct,
      percentage: pct,
      isPassed: passing,
      totalPointsEarned: earnedPoints,
    };
  }, [answers, exam.questions, exam.passingScore]);

  const answeredCount = Object.keys(answers).length;
  const isTimerCritical = timeRemainingSeconds <= 60;
  const isTimerWarning = timeRemainingSeconds <= 180 && !isTimerCritical;

  if (totalQuestions === 0) {
    return null;
  }

  // ============================================================================
  // 1. INTRO / START SCREEN
  // ============================================================================
  if (examState === 'intro') {
    return (
      <div className="w-full my-4 rounded-2xl bg-[#08090d]/95 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)] font-sans select-none text-right transition-all animate-in fade-in duration-200">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-4" dir="rtl">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-200">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>{exam.title || 'امتحان تقييمي شامل (Comprehensive Assessment)'}</span>
                {exam.level && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold">
                    CEFR {exam.level}
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-400 font-normal">
                منظومة Fathom ITS 1 التعليمية — معايير كامبريدج الأكاديمية
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs font-mono text-zinc-300">
            <Clock className="size-3.5 text-zinc-400" />
            <span>{exam.durationMinutes || 10} دقيقة</span>
          </div>
        </div>

        {/* Description & Overview */}
        {exam.description && (
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5 font-sans" dir="rtl">
            {exam.description}
          </p>
        )}

        {/* Meta Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5" dir="rtl">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[11px] text-zinc-400 mb-0.5">عدد الأسئلة</div>
            <div className="text-base sm:text-lg font-bold font-mono text-zinc-100">{totalQuestions}</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[11px] text-zinc-400 mb-0.5">مدة الامتحان</div>
            <div className="text-base sm:text-lg font-bold font-mono text-zinc-100">{exam.durationMinutes || 10} د</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[11px] text-zinc-400 mb-0.5">درجة الاجتياز</div>
            <div className="text-base sm:text-lg font-bold font-mono text-zinc-100">{exam.passingScore || 70}%</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[11px] text-zinc-400 mb-0.5">النقاط المتاحة</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">+{totalQuestions * 2} pts</div>
          </div>
        </div>

        {/* Instructions Alert */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5 text-right text-xs text-zinc-400 leading-relaxed" dir="rtl">
          <div className="font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
            <HelpCircle className="size-3.5 text-zinc-400" />
            <span>تعليمات أداء الامتحان:</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-zinc-400 text-[11.5px]">
            <li>سيبدأ مؤقت العد التنازلي فور الضغط على زر بدء الامتحان.</li>
            <li>يمكنك التنقل بحرية بين كافة الأسئلة ومراجعة وتعديل اختياراتك قبل التسليم.</li>
            <li>لن تُكشف الإجابات أثناء الاختبار؛ سيتم تقديم تقرير تحليلي وتصحيح تفصيلي فور التسليم.</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3" dir="rtl">
          <button
            type="button"
            disabled={isStreaming}
            onClick={handleStartExam}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white active:scale-95 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="size-4 fill-zinc-950" />
            <span>بدء الامتحان الآن</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. ACTIVE EXAM TAKING SCREEN
  // ============================================================================
  if (examState === 'active' && currentQuestion) {
    const selectedOptionForCurrent = answers[currentQuestionIndex];
    const isCurrentAnswered = selectedOptionForCurrent !== undefined;

    return (
      <div className="w-full my-4 rounded-2xl bg-[#08090d]/95 backdrop-blur-xl border border-white/[0.08] p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] font-sans select-none text-right transition-all animate-in fade-in duration-200">
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5 mb-4" dir="rtl">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <FileQuestion className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200">
                السؤال {currentQuestionIndex + 1} من {totalQuestions}
              </div>
              <div className="text-[11px] text-zinc-400">
                تمت الإجابة على ({answeredCount}/{totalQuestions})
              </div>
            </div>
          </div>

          {/* Real-time Countdown Timer */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs sm:text-sm font-mono font-bold transition-colors",
            isTimerCritical
              ? "bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse"
              : isTimerWarning
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-white/[0.04] border-white/[0.08] text-zinc-200"
          )}>
            <Clock className={cn("size-3.5", isTimerCritical ? "text-rose-400" : "text-zinc-400")} />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>
        </div>

        {/* Question Stepper Pills (Direct Question Jumper) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none" dir="rtl">
          {exam.questions.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isCurrent = idx === currentQuestionIndex;

            return (
              <button
                key={`step-${idx}`}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                className={cn(
                  "size-7 shrink-0 rounded-lg text-xs font-mono font-semibold transition-all border flex items-center justify-center cursor-pointer",
                  isCurrent
                    ? "bg-white text-zinc-950 border-white font-bold shadow-sm scale-105"
                    : isAnswered
                    ? "bg-white/[0.12] border-white/[0.22] text-zinc-100"
                    : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/[0.15]"
                )}
                title={`الانتقال للسؤال ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Current Question Body (English LTR) */}
        <div className="text-left dir-ltr p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            {currentQuestion.category && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300 font-medium">
                {currentQuestion.category}
              </span>
            )}
          </div>
          <p className="text-zinc-100 text-sm sm:text-base font-medium leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options List (Neutral Selection during exam) */}
        <div className="space-y-2 dir-ltr text-left mb-5">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedOptionForCurrent === optIdx;

            return (
              <button
                key={`opt-${currentQuestionIndex}-${optIdx}`}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-sm transition-all text-left group cursor-pointer",
                  isSelected
                    ? "bg-white/[0.12] border-white/[0.3] text-white shadow-[0_0_15px_rgba(255,255,255,0.06)] font-medium"
                    : "bg-white/[0.02] border-white/[0.06] text-zinc-300 hover:bg-white/[0.05] hover:border-white/[0.15]"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn(
                    "size-6 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-semibold border transition-all",
                    isSelected
                      ? "bg-white text-zinc-950 border-white font-bold"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-300 group-hover:border-white/[0.2]"
                  )}>
                    {optionLetters[optIdx] || optIdx + 1}
                  </span>
                  <span className="font-sans leading-normal break-words">
                    {option}
                  </span>
                </div>

                {isSelected && (
                  <div className="size-2 rounded-full bg-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation & Submission */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]" dir="rtl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 text-xs font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ArrowRight className="size-3.5" />
              <span>السابق</span>
            </button>

            <button
              type="button"
              disabled={currentQuestionIndex === totalQuestions - 1}
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 text-xs font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <span>التالي</span>
              <ArrowLeft className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (answeredCount < totalQuestions) {
                setShowConfirmSubmitModal(true);
              } else {
                handleFinalSubmit();
              }
            }}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm",
              answeredCount === totalQuestions
                ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                : "bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 border border-white/[0.1]"
            )}
          >
            <Check className="size-3.5" />
            <span>تسليم الامتحان ({answeredCount}/{totalQuestions})</span>
          </button>
        </div>

        {/* Unanswered Questions Confirmation Dialog */}
        {showConfirmSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#0d0f14] border border-white/10 p-5 shadow-2xl text-right font-sans" dir="rtl">
              <div className="flex items-center gap-2 text-amber-400 mb-2 font-bold text-sm">
                <AlertCircle className="size-4" />
                <span>تنبيه: أسئلة متبقية بدون إجابة</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                لقد أجبت على ({answeredCount}) من أصل ({totalQuestions}) سؤالاً. هل أنت متأكد من رغبتك في تسليم الامتحان الآن؟
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmitModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-zinc-300 hover:bg-white/5 cursor-pointer"
                >
                  العودة للاختبار
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                >
                  تسليم على أية حال
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 3. RESULTS & PERFORMANCE REVIEW SCREEN
  // ============================================================================
  const filteredQuestions = exam.questions.filter((q, idx) => {
    if (reviewFilter === 'incorrect') {
      return answers[idx] !== q.correctIndex;
    }
    return true;
  });

  return (
    <div className="w-full my-4 rounded-2xl bg-[#08090d]/95 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)] font-sans select-none text-right transition-all animate-in fade-in duration-200">
      {/* Result Header Banner */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5" dir="rtl">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "size-10 rounded-xl border flex items-center justify-center font-bold text-base font-mono",
            isPassed
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/15 border-rose-500/30 text-rose-300"
          )}>
            {percentage}%
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>{isPassed ? 'تم اجتياز الامتحان بنجاح' : 'تحتاج إلى مراجعة وتدريب'}</span>
              <span className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border",
                isPassed
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-300"
              )}>
                {correctCount} / {totalQuestions} صحيحة
              </span>
            </div>
            <div className="text-xs text-zinc-400 font-normal">
              استغرق الحل: {Math.floor(timeTakenSeconds / 60)} دقيقة و {timeTakenSeconds % 60} ثانية
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
            title="إعادة الامتحان"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">إعادة المحاولة</span>
          </button>
        </div>
      </div>

      {/* Points & Level Achievement Card */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5 flex items-center justify-between gap-3" dir="rtl">
        <div className="flex items-center gap-2">
          <Award className="size-4 text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-200">
            النقاط المكتسبة من الامتحان:
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            +{totalPointsEarned} pts
          </span>
        </div>
        {exam.level && (
          <span className="text-[11px] font-mono text-zinc-400">
            المستوى المستهدف: {exam.level}
          </span>
        )}
      </div>

      {/* Review Filter Tabs */}
      <div className="flex items-center justify-between gap-2 mb-3" dir="rtl">
        <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <span>المراجعة اللغوية التفصيلية لكافة الأسئلة</span>
          <span className="text-[11px] text-zinc-400 font-normal">
            ({filteredQuestions.length})
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.03] p-0.5 rounded-lg border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setReviewFilter('all')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
              reviewFilter === 'all'
                ? "bg-white/[0.1] text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            الكل ({totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => setReviewFilter('incorrect')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
              reviewFilter === 'incorrect'
                ? "bg-rose-500/15 text-rose-300"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            الأخطاء ({totalQuestions - correctCount})
          </button>
        </div>
      </div>

      {/* Questions Detailed Review Accordion */}
      <div className="space-y-3.5">
        {filteredQuestions.map((question) => {
          const originalIndex = exam.questions.findIndex((q) => q.id === question.id);
          const studentAnswerIndex = answers[originalIndex];
          const isCorrect = studentAnswerIndex === question.correctIndex;
          const isUnanswered = studentAnswerIndex === undefined;

          return (
            <div
              key={question.id || `q-${originalIndex}`}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left dir-ltr"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    Q{originalIndex + 1}
                  </span>
                  {question.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-zinc-400">
                      {question.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 font-sans">
                      <CheckCircle2 className="size-3.5" />
                      <span>Correct (+{question.points || 2} pts)</span>
                    </span>
                  ) : isUnanswered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 font-sans">
                      <AlertCircle className="size-3.5" />
                      <span>Unanswered</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 font-sans">
                      <XCircle className="size-3.5" />
                      <span>Incorrect</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Question Prompt */}
              <p className="text-xs sm:text-sm font-medium text-zinc-100 leading-relaxed mb-3">
                {question.question}
              </p>

              {/* Options Review Grid */}
              <div className="space-y-1.5 mb-3">
                {question.options.map((option, optIdx) => {
                  const isThisCorrect = optIdx === question.correctIndex;
                  const isStudentChoice = studentAnswerIndex === optIdx;

                  let optStyles = "bg-white/[0.01] border-white/[0.04] text-zinc-400 opacity-70";
                  if (isThisCorrect) {
                    optStyles = "bg-emerald-500/[0.12] border-emerald-500/40 text-emerald-200 font-medium";
                  } else if (isStudentChoice && !isThisCorrect) {
                    optStyles = "bg-rose-500/[0.12] border-rose-500/40 text-rose-200";
                  }

                  return (
                    <div
                      key={`rev-opt-${optIdx}`}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg border text-xs",
                        optStyles
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] font-semibold">
                          {optionLetters[optIdx]}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isThisCorrect && (
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          Correct Answer
                        </span>
                      )}
                      {isStudentChoice && !isThisCorrect && (
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                          Your Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Linguistic Rule & Explanation */}
              {question.explanation && (
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-right text-xs leading-relaxed" dir="rtl">
                  <span className="font-bold text-zinc-200 ml-1">التفسير الأكاديمي:</span>
                  <span className="text-zinc-300 font-sans">{question.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
