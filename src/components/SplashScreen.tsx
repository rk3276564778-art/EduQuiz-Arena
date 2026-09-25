import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Globe, Atom, Scroll, Sparkles, Award, ArrowRight, Zap, Target } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [autoTimer, setAutoTimer] = useState<number>(6);

  useEffect(() => {
    if (autoTimer <= 0) {
      onEnter();
      return;
    }

    const timer = setTimeout(() => {
      setAutoTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoTimer, onEnter]);

  const handleStart = () => {
    soundEffects.playClick();
    onEnter();
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.22, 0.12],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl"
        />
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main Content Box */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Animated Central Emblem */}
        <div className="relative mx-auto mb-8 w-28 h-28 flex items-center justify-center">
          {/* Outer Rotating Glow Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-3xl border border-indigo-500/30 bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-amber-500/20 blur-xs"
          />

          {/* Core Crest */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-400/40 shadow-2xl shadow-indigo-500/25 flex items-center justify-center"
          >
            <Award className="w-12 h-12 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
          </motion.div>

          {/* Orbiting Subject Badges */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 -right-3 w-9 h-9 rounded-xl bg-blue-600/90 border border-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/40"
            title="Mathematics"
          >
            <Calculator className="w-4 h-4" />
          </motion.div>

          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-3 -right-3 w-9 h-9 rounded-xl bg-amber-500/90 border border-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40"
            title="General Knowledge"
          >
            <Globe className="w-4 h-4" />
          </motion.div>

          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-3 -left-3 w-9 h-9 rounded-xl bg-emerald-600/90 border border-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40"
            title="Science"
          >
            <Atom className="w-4 h-4" />
          </motion.div>

          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute -top-3 -left-3 w-9 h-9 rounded-xl bg-rose-600/90 border border-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/40"
            title="World History"
          >
            <Scroll className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Welcome Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Learning Challenge</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4"
        >
          EduQuiz{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent">
            Arena
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Test your intellect across 4 foundational disciplines. Each subject features exactly{' '}
          <span className="text-white font-semibold underline decoration-indigo-400/60 decoration-2">
            15 curated questions
          </span>{' '}
          and a maximum score of{' '}
          <span className="text-amber-300 font-semibold">150 points</span> with instant glow feedback!
        </motion.p>

        {/* 4 Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-left"
        >
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/60 transition-colors">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Math</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">15 Questions • 150 Pts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-sm hover:border-amber-400/60 transition-colors">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">GK</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">15 Questions • 150 Pts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-sm hover:border-emerald-400/60 transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Atom className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Science</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">15 Questions • 150 Pts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-rose-500/30 backdrop-blur-sm hover:border-rose-400/60 transition-colors">
            <div className="flex items-center gap-2 text-rose-400 mb-1">
              <Scroll className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">History</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">15 Questions • 150 Pts</p>
          </div>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mb-8"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>Green glow for correct answers (+10 pts)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span>Red glow for wrong answers (no penalty)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Full explanations included</span>
          </div>
        </motion.div>

        {/* Launch Button CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleStart}
            className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Enter Quiz Arena</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 pointer-events-none" />
          </button>

          <span className="text-xs text-slate-500">
            Auto-starting in {autoTimer}s...
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
