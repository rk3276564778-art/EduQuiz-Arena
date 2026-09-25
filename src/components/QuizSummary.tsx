import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Home,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Timer,
  AlertTriangle,
} from 'lucide-react';
import { SubjectConfig, UserAnswer, SubjectId } from '../types';
import { SUBJECTS } from '../data/quizQuestions';
import { SubjectIcon } from './SubjectIcon';
import { soundEffects } from '../utils/soundEffects';

interface QuizSummaryProps {
  subject: SubjectConfig;
  finalScore: number;
  userAnswers: UserAnswer[];
  maxStreak: number;
  onRetake: () => void;
  onGoHome: () => void;
  onSelectNextSubject: (nextSubjectId: SubjectId) => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  subject,
  finalScore,
  userAnswers,
  maxStreak,
  onRetake,
  onGoHome,
  onSelectNextSubject,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const totalQuestions = userAnswers.length; // 15
  const maxScore = subject.maxScore; // 150
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const timedOutCount = userAnswers.filter((a) => a.isTimedOut).length;
  const wrongCount = totalQuestions - correctCount - timedOutCount;
  const percentage = Math.round((finalScore / maxScore) * 100);

  // Trigger celebration on mount
  useEffect(() => {
    soundEffects.playFanfare();

    if (percentage >= 60) {
      try {
        confetti({
          particleCount: percentage >= 90 ? 120 : 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
        });
      } catch {
        // Confetti unsupported or blocked
      }
    }
  }, [percentage]);

  // Determine performance badge and tier
  let badgeTitle = 'Scholar';
  let badgeDescription = 'Solid effort! Review your answers below to sharpen your mastery.';
  let badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';

  if (percentage === 100) {
    badgeTitle = '🌟 Flawless Grandmaster!';
    badgeDescription = 'Incredible! You earned a perfect 150 / 150 points with zero mistakes!';
    badgeColor = 'text-amber-300 bg-amber-500/15 border-amber-500/40';
  } else if (percentage >= 80) {
    badgeTitle = '🏆 High Honors Scholar!';
    badgeDescription = 'Exceptional performance! You demonstrated outstanding subject mastery.';
    badgeColor = 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40';
  } else if (percentage >= 60) {
    badgeTitle = '✨ Competent Thinker';
    badgeDescription = 'Great job passing the benchmark! A little more practice will push you to mastery.';
    badgeColor = 'text-indigo-300 bg-indigo-500/15 border-indigo-500/40';
  } else {
    badgeTitle = '📚 Apprentice Explorer';
    badgeDescription = 'Learning is a journey! Review the explanations below and try again.';
    badgeColor = 'text-rose-300 bg-rose-500/15 border-rose-500/40';
  }

  // Find next subject in sequence
  const currentSubjectIndex = SUBJECTS.findIndex((s) => s.id === subject.id);
  const nextSubject = SUBJECTS[(currentSubjectIndex + 1) % SUBJECTS.length];

  const toggleAccordion = (index: number) => {
    soundEffects.playClick();
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-center overflow-hidden shadow-2xl mb-8"
        >
          {/* Background Ambient Glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top center, ${subject.glowColor}, transparent 70%)`,
            }}
          />

          {/* Subject Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 mb-6">
            <div
              className={`w-5 h-5 rounded-md bg-gradient-to-br ${subject.themeColor} flex items-center justify-center text-white text-[10px]`}
            >
              <SubjectIcon name={subject.iconName} className="w-3 h-3" />
            </div>
            <span>{subject.name} Quiz Completed</span>
          </div>

          {/* Trophy Crest */}
          <div className="relative mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-lg" />
            <div className="relative z-10 w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-10 h-10 text-slate-950 fill-amber-300" />
            </div>
          </div>

          {/* Badge Title & Description */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            {badgeTitle}
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
            {badgeDescription}
          </p>

          {/* Big Score Display */}
          <div className="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-8 min-w-[240px]">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
              Final Subject Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                {finalScore}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-500">
                / {maxScore} pts
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold mt-1">
              {percentage}% Accuracy ({correctCount} of {totalQuestions} correct)
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct</span>
              </div>
              <p className="text-xl font-bold text-white">{correctCount}</p>
              <p className="text-[11px] text-slate-400">+{correctCount * 10} pts</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold mb-1">
                <XCircle className="w-4 h-4" />
                <span>Incorrect</span>
              </div>
              <p className="text-xl font-bold text-white">{wrongCount}</p>
              <p className="text-[11px] text-slate-400">0 penalty</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                <Timer className="w-4 h-4" />
                <span>Timed Out</span>
              </div>
              <p className="text-xl font-bold text-white">{timedOutCount}</p>
              <p className="text-[11px] text-rose-400">-{timedOutCount * 5} pts penalty</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>Best Streak</span>
              </div>
              <p className="text-xl font-bold text-white">{maxStreak}</p>
              <p className="text-[11px] text-slate-400">in a row</p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundEffects.playClick();
                onRetake();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onGoHome();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onSelectNextSubject(nextSubject.id);
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${nextSubject.buttonClass}`}
            >
              <span>Next Subject: {nextSubject.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Detailed Question Review Section */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Question-by-Question Review</span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect every question, your selected choice, and the educational reasoning.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
              15 Questions
            </span>
          </div>

          <div className="space-y-3">
            {userAnswers.map((answer, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div
                  key={answer.questionId}
                  className={`rounded-xl border transition-colors overflow-hidden ${
                    answer.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : answer.isTimedOut
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-rose-500/30 bg-rose-950/10'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          answer.isCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : answer.isTimedOut
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-1">
                          {answer.questionText}
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                          <span
                            className={
                              answer.isCorrect
                                ? 'text-emerald-400 font-medium'
                                : answer.isTimedOut
                                ? 'text-rose-400 font-medium flex items-center gap-1'
                                : 'text-rose-400 font-medium'
                            }
                          >
                            {answer.isCorrect
                              ? 'Correct (+10 pts)'
                              : answer.isTimedOut
                              ? '⏱️ Time Expired (-5 pts penalty)'
                              : 'Missed (+0 pts)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 text-xs sm:text-sm space-y-3">
                      {/* Notice if timed out */}
                      {answer.isTimedOut && (
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>Timer ran out before an answer was chosen. The correct answer is highlighted below.</span>
                        </div>
                      )}

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {answer.options.map((opt, optIdx) => {
                          const isPicked = answer.selectedOptionIndex === optIdx;
                          const isRight = answer.correctAnswerIndex === optIdx;

                          let optBadge = 'bg-slate-900 border-slate-800 text-slate-400';
                          if (isRight) {
                            optBadge = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold';
                          } else if (isPicked && !isRight) {
                            optBadge = 'bg-rose-500/20 border-rose-400 text-rose-200 line-through';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optBadge}`}
                            >
                              <span>
                                <strong className="mr-1.5">
                                  {String.fromCharCode(65 + optIdx)}.
                                </strong>
                                {opt}
                              </span>
                              {isRight && (
                                <span className="text-[10px] text-emerald-400 uppercase font-bold shrink-0 ml-1">
                                  Correct
                                </span>
                              )}
                              {isPicked && !isRight && (
                                <span className="text-[10px] text-rose-400 uppercase font-bold shrink-0 ml-1">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                        <strong className="text-indigo-300 block mb-1">
                          Why this is correct:
                        </strong>
                        {answer.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
