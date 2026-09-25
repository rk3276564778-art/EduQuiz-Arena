import React from 'react';
import { motion } from 'motion/react';
import { Award, Trophy, Volume2, VolumeX, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Zap, Target, Timer } from 'lucide-react';
import { SUBJECTS } from '../data/quizQuestions';
import { ProgressMap, SubjectId } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { soundEffects } from '../utils/soundEffects';

interface DashboardProps {
  progress: ProgressMap;
  onSelectSubject: (subjectId: SubjectId) => void;
  onShowSplash: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onSelectSubject,
  onShowSplash,
  soundEnabled,
  onToggleSound,
}) => {
  // Calculate total points scored across subjects
  const totalScore = Object.values(progress).reduce((acc, curr) => acc + (curr.highScore || 0), 0);
  const maxPossibleTotal = SUBJECTS.length * 150; // 600 points
  const totalCompleted = Object.values(progress).filter((p) => p.timesCompleted > 0).length;

  const handleSubjectClick = (id: SubjectId) => {
    soundEffects.playClick();
    onSelectSubject(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                EduQuiz <span className="text-indigo-400">Arena</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                4 Subjects • 15 Questions Each • 150 Pts Max
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Overall Score Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Total Score:</span>
              <span className="font-bold text-amber-300">{totalScore}</span>
              <span className="text-slate-500">/ {maxPossibleTotal}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Intro Replay Button */}
            <button
              onClick={onShowSplash}
              title="View Welcome Splash Screen"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 mb-8"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Choose a Subject to Begin</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Ready to test your knowledge?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Select one of the 4 subject cards below. Each subject delivers{' '}
              <strong className="text-white">15 targeted multiple-choice questions</strong>. Earn{' '}
              <span className="text-emerald-400 font-semibold">+10 points</span> for every correct answer (150 total points possible).
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Vibrant Green Glow for Correct
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                Vibrant Red Glow for Wrong
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                Completed: {totalCompleted}/4 Subjects
              </span>
            </div>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 right-48 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        </motion.div>

        {/* 4 Distinct Subject Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Available Subjects</span>
            </h3>
            <span className="text-xs text-slate-400">Click any card to start</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SUBJECTS.map((subject, index) => {
              const subProgress = progress[subject.id] || {
                highScore: 0,
                timesCompleted: 0,
                bestStreak: 0,
              };
              const percentage = Math.round((subProgress.highScore / subject.maxScore) * 100);

              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => handleSubjectClick(subject.id)}
                  className={`group relative rounded-2xl bg-slate-900/90 border ${subject.accentBorder} p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 overflow-hidden flex flex-col justify-between`}
                >
                  {/* Subtle Background Glow on Hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${subject.glowColor}, transparent 60%)`,
                    }}
                  />

                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.themeColor} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                      >
                        <SubjectIcon name={subject.iconName} className="w-7 h-7" />
                      </div>

                      {/* Subject Code & Status */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${subject.badgeBg}`}
                        >
                          {subject.shortCode}
                        </span>
                        {subProgress.timesCompleted > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed {subProgress.timesCompleted}x
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject Title & Tagline */}
                    <h4 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors mb-1">
                      {subject.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mb-2">
                      {subject.tagline}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-5">
                      {subject.description}
                    </p>
                  </div>

                  {/* Card Footer: Score Tracker & Action */}
                  <div className="pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-400">
                        {subProgress.highScore > 0 ? 'Your Best Score:' : 'Target Score:'}
                      </span>
                      <span className="font-bold text-white">
                        {subProgress.highScore} / {subject.maxScore} pts ({percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${subject.themeColor} transition-all duration-500`}
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        15 Questions • 10 pts each
                      </span>
                      <div
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 ${subject.buttonClass} group-hover:gap-3 transition-all`}
                      >
                        <span>{subProgress.timesCompleted > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scoring & Rules Summary Footer Card */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 text-xs text-slate-400">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">+10 Points Correct</p>
                <p>Instant vibrant green glow confirmation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">20s Question Timer</p>
                <p>-5 pts deducted if timer expires without an answer</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">150 Pts Maximum</p>
                <p>Full score summary & question review</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
