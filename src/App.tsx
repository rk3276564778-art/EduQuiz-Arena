import React, { useState, useEffect } from 'react';
import { SubjectId, ProgressMap, UserAnswer } from './types';
import { SUBJECTS, QUIZ_QUESTIONS } from './data/quizQuestions';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './components/Dashboard';
import { QuizView } from './components/QuizView';
import { QuizSummary } from './components/QuizSummary';
import { soundEffects } from './utils/soundEffects';

type ScreenState = 'splash' | 'dashboard' | 'quiz' | 'summary';

const STORAGE_KEY = 'eduquiz_progress_v1';

const DEFAULT_PROGRESS: ProgressMap = {
  math: { highScore: 0, timesCompleted: 0, bestStreak: 0 },
  gk: { highScore: 0, timesCompleted: 0, bestStreak: 0 },
  science: { highScore: 0, timesCompleted: 0, bestStreak: 0 },
  history: { highScore: 0, timesCompleted: 0, bestStreak: 0 },
};

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('math');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.isEnabled());
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  const [lastQuizResult, setLastQuizResult] = useState<{
    finalScore: number;
    userAnswers: UserAnswer[];
    maxStreak: number;
  } | null>(null);

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  const handleToggleSound = () => {
    const newState = soundEffects.toggle();
    setSoundEnabled(newState);
  };

  const handleEnterDashboard = () => {
    setScreen('dashboard');
  };

  const handleSelectSubject = (subjectId: SubjectId) => {
    setSelectedSubjectId(subjectId);
    setScreen('quiz');
  };

  const handleFinishQuiz = (finalScore: number, answers: UserAnswer[], maxStreak: number) => {
    setLastQuizResult({
      finalScore,
      userAnswers: answers,
      maxStreak,
    });

    // Update subject progress
    setProgress((prev) => {
      const current = prev[selectedSubjectId] || { highScore: 0, timesCompleted: 0, bestStreak: 0 };
      return {
        ...prev,
        [selectedSubjectId]: {
          highScore: Math.max(current.highScore, finalScore),
          timesCompleted: current.timesCompleted + 1,
          bestStreak: Math.max(current.bestStreak, maxStreak),
          lastPlayedAt: new Date().toISOString(),
        },
      };
    });

    setScreen('summary');
  };

  const currentSubjectConfig = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];
  const currentSubjectQuestions = QUIZ_QUESTIONS[selectedSubjectId] || QUIZ_QUESTIONS.math;

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white">
      {screen === 'splash' && (
        <SplashScreen onEnter={handleEnterDashboard} />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          progress={progress}
          onSelectSubject={handleSelectSubject}
          onShowSplash={() => setScreen('splash')}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {screen === 'quiz' && (
        <QuizView
          key={selectedSubjectId}
          subject={currentSubjectConfig}
          questions={currentSubjectQuestions}
          onFinishQuiz={handleFinishQuiz}
          onExitToDashboard={() => setScreen('dashboard')}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {screen === 'summary' && lastQuizResult && (
        <QuizSummary
          subject={currentSubjectConfig}
          finalScore={lastQuizResult.finalScore}
          userAnswers={lastQuizResult.userAnswers}
          maxStreak={lastQuizResult.maxStreak}
          onRetake={() => setScreen('quiz')}
          onGoHome={() => setScreen('dashboard')}
          onSelectNextSubject={(nextId) => {
            setSelectedSubjectId(nextId);
            setScreen('quiz');
          }}
        />
      )}
    </div>
  );
}
