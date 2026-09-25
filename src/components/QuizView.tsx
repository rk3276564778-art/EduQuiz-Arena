import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Award,
  Volume2,
  VolumeX,
  Timer,
  AlertTriangle,
  MinusCircle,
} from 'lucide-react';
import { Question, SubjectConfig, UserAnswer } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { soundEffects } from '../utils/soundEffects';

interface QuizViewProps {
  subject: SubjectConfig;
  questions: Question[];
  onFinishQuiz: (finalScore: number, answers: UserAnswer[], maxStreak: number) => void;
  onExitToDashboard: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const QUESTION_DURATION = 20; // 20 seconds countdown per question
const TIMEOUT_PENALTY = 5; // Points deducted on timer expiry

export const QuizView: React.FC<QuizViewProps> = ({
  subject,
  questions,
  onFinishQuiz,
  onExitToDashboard,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_DURATION);
  const [score, setScore] = useState<number>(0);
  const [scoreNotification, setScoreNotification] = useState<{ text: string; type: 'plus' | 'minus' } | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length; // 15

  // Timeout handler: Deduct points when timer reaches 0 before answer selection
  const handleTimeout = useCallback(() => {
    if (isAnswered) return;

    setIsAnswered(true);
    setIsTimedOut(true);
    setSelectedOption(null);

    soundEffects.playTimeout();

    // Deduct points, with a minimum floor of 0
    setScore((prevScore) => {
      return Math.max(0, prevScore - TIMEOUT_PENALTY);
    });

    const deduction = Math.min(score, TIMEOUT_PENALTY);
    setScoreNotification({
      text: deduction > 0 ? `-${deduction} Pts (Time Expired)` : 'Time Expired!',
      type: 'minus',
    });
    setTimeout(() => setScoreNotification(null), 1600);

    setStreak(0);

    const answerRecord: UserAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      options: currentQuestion.options,
      selectedOptionIndex: -1,
      correctAnswerIndex: currentQuestion.correctAnswerIndex,
      isCorrect: false,
      explanation: currentQuestion.explanation,
      isTimedOut: true,
      timeRemaining: 0,
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  }, [isAnswered, currentQuestion, score]);

  // Countdown timer effect
  useEffect(() => {
    // If answered or exit modal is open, do not tick
    if (isAnswered || showExitConfirm) {
      return;
    }

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 5 && next > 0) {
          soundEffects.playTick();
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, showExitConfirm, handleTimeout]);

  // Keyboard navigation & Next Question
  const handleNext = useCallback(() => {
    soundEffects.playClick();

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsTimedOut(false);
      setTimeLeft(QUESTION_DURATION);
    } else {
      // Finished all 15 questions
      onFinishQuiz(score, userAnswers, maxStreak);
    }
  }, [currentIndex, totalQuestions, onFinishQuiz, score, userAnswers, maxStreak]);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return;

      setSelectedOption(optionIndex);
      setIsAnswered(true);
      setIsTimedOut(false);

      const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;

      const answerRecord: UserAnswer = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        options: currentQuestion.options,
        selectedOptionIndex: optionIndex,
        correctAnswerIndex: currentQuestion.correctAnswerIndex,
        isCorrect,
        explanation: currentQuestion.explanation,
        isTimedOut: false,
        timeRemaining: timeLeft,
      };

      setUserAnswers((prev) => [...prev, answerRecord]);

      if (isCorrect) {
        soundEffects.playCorrect();
        const newScore = score + 10;
        setScore(newScore);
        setScoreNotification({ text: '+10 Pts', type: 'plus' });
        setTimeout(() => setScoreNotification(null), 1200);

        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
      } else {
        soundEffects.playWrong();
        setStreak(0);
      }
    },
    [isAnswered, currentQuestion, score, streak, maxStreak, timeLeft]
  );

  // Handle hotkeys (1-4 for options, Space/Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm) return;

      if (!isAnswered) {
        if (['1', 'a', 'A'].includes(e.key)) handleSelectOption(0);
        else if (['2', 'b', 'B'].includes(e.key)) handleSelectOption(1);
        else if (['3', 'c', 'C'].includes(e.key)) handleSelectOption(2);
        else if (['4', 'd', 'D'].includes(e.key)) handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleSelectOption, handleNext, showExitConfirm]);

  // Determine timer color styling based on remaining time
  const timerPercent = (timeLeft / QUESTION_DURATION) * 100;
  let timerTextColor = 'text-emerald-400';
  let timerBgColor = 'bg-emerald-500/10 border-emerald-500/30';
  let timerBarColor = 'bg-emerald-500';

  if (timeLeft <= 5) {
    timerTextColor = 'text-rose-400';
    timerBgColor = 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
    timerBarColor = 'bg-rose-500';
  } else if (timeLeft <= 10) {
    timerTextColor = 'text-amber-400';
    timerBgColor = 'bg-amber-500/15 border-amber-500/40';
    timerBarColor = 'bg-amber-500';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={() => {
              if (userAnswers.length > 0) {
                setShowExitConfirm(true);
              } else {
                onExitToDashboard();
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {/* Subject Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <div
              className={`w-6 h-6 rounded-md bg-gradient-to-br ${subject.themeColor} flex items-center justify-center text-white text-xs`}
            >
              <SubjectIcon name={subject.iconName} className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              {subject.name}
            </span>
          </div>

          {/* Live Score Tracker, Streak & Countdown Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{streak} Streak!</span>
              </motion.div>
            )}

            {/* Live Score Badge with Animated Bump */}
            <div
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                scoreNotification?.type === 'plus'
                  ? 'bg-emerald-500/25 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105'
                  : scoreNotification?.type === 'minus'
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 hidden xs:inline">Score:</span>
              <motion.span
                key={score}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-sm font-extrabold text-white"
              >
                {score}
              </motion.span>
              <span className="text-xs text-slate-500">/ 150 pts</span>

              {/* Floating Points Notification Badge */}
              <AnimatePresence>
                {scoreNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -24, scale: 1 }}
                    exit={{ opacity: 0, y: -34 }}
                    className={`absolute -top-3 right-0 px-2 py-0.5 rounded-md text-[11px] font-black tracking-wide shadow-lg whitespace-nowrap pointer-events-none ${
                      scoreNotification.type === 'plus'
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/40'
                        : 'bg-rose-600 text-white shadow-rose-600/40'
                    }`}
                  >
                    {scoreNotification.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Question Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${subject.themeColor}`}
            animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* Main Question Interface */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col justify-center">
        {/* Question Meta Info & Countdown Timer Bar */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-semibold text-slate-300">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-medium">
              {currentQuestion.category}
            </span>
          </div>

          {/* Interactive Countdown Timer */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={timeLeft <= 5 && !isAnswered ? { scale: [1, 1.06, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold transition-colors ${timerBgColor} ${timerTextColor}`}
            >
              <Timer className={`w-3.5 h-3.5 ${timeLeft <= 5 && !isAnswered ? 'animate-spin' : ''}`} />
              <span>
                {timeLeft}s remaining
              </span>
            </motion.div>
          </div>
        </div>

        {/* Real-time Dynamic Countdown Bar */}
        <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
          <motion.div
            className={`h-full transition-all duration-300 rounded-full ${timerBarColor}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Time's Up Banner (Shown when timer expires) */}
        <AnimatePresence>
          {isTimedOut && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-between gap-3 text-rose-200"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-rose-100">
                    ⏱️ Time Expired! -{TIMEOUT_PENALTY} Points Penalty
                  </p>
                  <p className="text-xs text-rose-300/90">
                    You did not choose an answer in time. The correct answer has been highlighted below.
                  </p>
                </div>
              </div>
              <span className="shrink-0 px-2 py-1 rounded bg-rose-600 text-white font-bold text-xs flex items-center gap-1">
                <MinusCircle className="w-3.5 h-3.5" />
                -{TIMEOUT_PENALTY} pts
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed mb-6">
              {currentQuestion.question}
            </h2>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 gap-3.5">
              {currentQuestion.options.map((optionText, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = selectedOption === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;

                // Visual Feedback Styling:
                // Green glow for correct, Red glow for wrong, and correct highlighted if wrong/timed out.
                let buttonStyle =
                  'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';
                let letterBadgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

                if (isAnswered) {
                  if (isSelected) {
                    if (isCorrectAnswer) {
                      // Correct option picked by user: VIBRANT GREEN GLOW
                      buttonStyle =
                        'bg-emerald-500/20 border-emerald-400 text-emerald-100 ring-4 ring-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.7)] font-semibold';
                      letterBadgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
                    } else {
                      // Wrong option picked by user: VIBRANT RED GLOW
                      buttonStyle =
                        'bg-rose-500/20 border-rose-500 text-rose-100 ring-4 ring-rose-500 shadow-[0_0_28px_rgba(244,63,94,0.7)] font-semibold';
                      letterBadgeStyle = 'bg-rose-500 text-white font-bold border-rose-400';
                    }
                  } else if (isCorrectAnswer) {
                    // Correct answer revealed after picking wrong option OR on timeout
                    buttonStyle =
                      'bg-emerald-500/15 border-emerald-400/80 text-emerald-200 ring-2 ring-emerald-400/50 shadow-[0_0_18px_rgba(52,211,153,0.35)] font-medium';
                    letterBadgeStyle = 'bg-emerald-500/80 text-slate-950 font-bold border-emerald-400';
                  } else {
                    // Unselected wrong options dimmed
                    buttonStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    letterBadgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectOption(index)}
                    disabled={isAnswered}
                    className={`relative w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer disabled:cursor-default ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 transition-colors ${letterBadgeStyle}`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base font-medium">
                        {optionText}
                      </span>
                    </div>

                    {/* Feedback Icon */}
                    {isAnswered && (
                      <div className="shrink-0 ml-3">
                        {isSelected && isCorrectAnswer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs"
                          >
                            <span>Correct! +10</span>
                            <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
                          </motion.div>
                        )}
                        {isSelected && !isCorrectAnswer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1.5 text-rose-400 font-bold text-xs"
                          >
                            <span>Incorrect</span>
                            <XCircle className="w-5 h-5 fill-rose-500 text-white" />
                          </motion.div>
                        )}
                        {!isSelected && isCorrectAnswer && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs"
                          >
                            <span>Correct Answer</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Educational Explanation Box (Animates in after answering or timeout) */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-xl p-4 mb-6 border ${
                selectedOption === currentQuestion.correctAnswerIndex
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : isTimedOut
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                  : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedOption === currentQuestion.correctAnswerIndex
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isTimedOut
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                    Explanation
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="sticky bottom-0 z-20 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            {!isAnswered ? (
              <span>Tip: Press 1-4 or A-D to select an answer before the 20s timer expires</span>
            ) : (
              <span>Press Space or Enter for next question</span>
            )}
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                isAnswered
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5'
                  : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex + 1 === totalQuestions ? 'View Final Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Leave Current Quiz?</h3>
            <p className="text-sm text-slate-400 mb-6">
              You have answered {currentIndex} of 15 questions. If you exit now, your current session progress will not be recorded as completed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
              >
                Continue Quiz
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitToDashboard();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30"
              >
                Exit to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
