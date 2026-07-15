/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Trophy, Music, Gamepad2, CheckCircle2, XCircle, Headphones, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// אנימציות המותאמות למשמעות ולצורה של כל טעם (עדינות יותר)
const animations = {
  zarka: { x: [0, -5, 0], y: [0, -5, 0], rotate: [0, -10, 0], transition: { duration: 0.8 } },
  segol: { scale: [1, 1.05, 1], y: [0, -2, 0], transition: { duration: 0.8 } },
  munach: { y: [0, 1, 0], transition: { duration: 1.5, repeat: Infinity } },
  revi_i: { rotate: [0, 15, 0], scale: [1, 1.05, 1], transition: { duration: 0.8 } },
  mahpach: { rotateY: [0, 45, 0], transition: { duration: 0.8 } },
  pashta: { x: [0, -5, 0], scaleX: [1, 1.05, 1], transition: { duration: 0.6 } },
  zaqef: { scaleY: [1, 1.1, 1], originY: 1, transition: { duration: 0.6 } },
  mercha: { scaleX: [1, 1.1, 1], originX: 0.5, transition: { duration: 0.6 } },
  tipcha: { y: [0, 5, 0], scaleY: [1, 0.95, 1], transition: { duration: 0.6 } },
  etnachta: { scale: [1, 1.02, 1], y: [0, 2, 0], transition: { duration: 1.5, repeat: Infinity } },
  pazer: { x: [0, 2, -2, 2, -2, 0], y: [0, -2, 2, -2, 2, 0], transition: { duration: 0.8 } },
  telisha: { x: [0, -5, 0], y: [0, -3, 0], rotate: [0, -5, 0], transition: { duration: 0.6 } },
  kadma: { x: [0, 5, 0], transition: { duration: 0.6 } },
  azla: { x: [0, 8, 0], y: [0, -2, 0], transition: { duration: 0.8 } },
  gershayim: { y: [0, -3, 0, -3, 0], transition: { duration: 0.8 } },
  darga: { y: [0, 2, 4, 6, 0], x: [0, 2, 4, 6, 0], transition: { duration: 1 } },
  tevir: { rotate: [0, 5, -5, 0], y: [0, 3, 0], transition: { duration: 0.6 } },
  yetiv: { scaleY: [1, 0.9, 1], originY: 1, transition: { duration: 0.6 } },
  pesiq: { opacity: [1, 0.5, 1], transition: { duration: 0.6 } },
  sof_pasuq: { scale: [1, 1.05, 1], transition: { duration: 0.8 } },
  shalshelet: { y: [0, -3, 0, -3, 0, -3, 0], transition: { duration: 1.5 } },
  karney_farah: { scale: [1, 1.05, 1], rotate: [0, -3, 3, 0], transition: { duration: 0.8 } },
  mercha_kefula: { scaleX: [1, 1.1, 1], transition: { duration: 0.8 } },
  yareach: { rotate: [0, 15, -15, 0], transition: { duration: 1 } }
};

// רשימת טעמי המקרא המעודכנת לפי הסדר המבוקש, עם הטעמים על המילים עצמן
const taamim = [
  { id: 1, name: 'קַדְמָ֨א', cleanName: 'קַדְמָא', questionText: 'מִלָּ֨ה', anim: 'kadma', time: 0.0 },
  { id: 2, name: 'פַּשְׁטָא֙', cleanName: 'פַּשְׁטָא', questionText: 'מִלָּה֙', anim: 'pashta', time: 1.033 },
  { id: 3, name: 'פַּ֙שְׁטָא֙', cleanName: 'פַּשְׁטָא', questionText: 'מִלָּה֙', anim: 'pashta', time: 1.916 },
  { id: 4, name: 'מֻנַּ֣ח זַרְקָא֘', cleanName: 'מֻנַּח זַרְקָא', questionText: 'מִלָּ֣ה מִלָּ֘ה', anim: 'zarka', time: 5.833 },
  { id: 5, name: 'מֻנַּ֣ח סֶגּוֹל֒', cleanName: 'מֻנַּח סֶגּוֹל', questionText: 'מִלָּ֣ה מִלָּה֒', anim: 'segol', time: 9.5 },
  { id: 6, name: 'מֻנַּ֣ח ׀ מֻנַּ֣ח רְבִיעִי֗', cleanName: 'מֻנַּח ׀ מֻנַּח רְבִיעִי', questionText: 'מִלָּ֣ה ׀ מִלָּ֣ה מִלָּה֗', anim: 'revi_i', time: 11.916 },
  { id: 7, name: 'מַהְפַּ֤ךְ פַּשְׁטָא֙, מֻנַּ֣ח זָקֵף־קָטֹ֔ן', cleanName: 'מַהְפַּךְ פַּשְׁטָא, מֻנַּח זָקֵף־קָטֹן', questionText: 'מִלָּ֤ה מִלָּה֙, מִלָּ֣ה מִלָּה֔', anim: 'zaqef', time: 17.083 },
  { id: 8, name: 'פַּשְׁטָא֙ זָקֵף־קָטֹ֔ן', cleanName: 'פַּשְׁטָא זָקֵף־קָטֹן', questionText: 'מִלָּה֙ מִלָּה֔', anim: 'zaqef', time: 22.833 },
  { id: 9, name: 'זָקֵף־גָּד֕וֹל', cleanName: 'זָקֵף־גָּדוֹל', questionText: 'מִלָּה֕', anim: 'zaqef', time: 27.666 },
  { id: 10, name: 'מֶרְכָ֥א טִפְּחָ֖א מֻנַּ֣ח אֶתְנַחְתָּ֑א', cleanName: 'מֶרְכָא טִפְּחָא מֻנַּח אֶתְנַחְתָּא', questionText: 'מִלָּ֥ה מִלָּ֖ה מִלָּ֣ה מִלָּה֑', anim: 'etnachta', time: 30.833 },
  { id: 11, name: 'פָּזֵ֡ר', cleanName: 'פָּזֵר', questionText: 'מִלָּה֡', anim: 'pazer', time: 35.333 },
  { id: 12, name: 'תְּלִישָׁא־קְטַנָּה֩', cleanName: 'תְּלִישָׁא־קְטַנָּה', questionText: 'מִלָּה֩', anim: 'telisha', time: 40.0 },
  { id: 13, name: 'תְּלִישָׁא־גְּ֠דוֹלָה', cleanName: 'תְּלִישָׁא־גְּדוֹלָה', questionText: 'מִלָּ֠ה', anim: 'telisha', time: 43.583 },
  { id: 14, name: 'קַדְמָא֨ וְאַזְלָא֜', cleanName: 'קַדְמָא וְאַזְלָא', questionText: 'מִלָּה֨ מִלָּה֜', anim: 'azla', time: 47.666 },
  { id: 15, name: 'אַזְלָא־גֶּרֶשׁ֜', cleanName: 'אַזְלָא־גֶּרֶשׁ', questionText: 'מִלָּה֜', anim: 'gershayim', time: 50.416 },
  { id: 16, name: 'גֵּרְשַׁ֞יִם', cleanName: 'גֵּרְשַׁיִם', questionText: 'מִלָּה֞', anim: 'gershayim', time: 53.5 },
  { id: 17, name: 'דַּרְגָּ֧א תְּבִ֛יר', cleanName: 'דַּרְגָּא תְּבִיר', questionText: 'מִלָּה֧ מִלָּה֛', anim: 'tevir', time: 56.583 },
  { id: 18, name: 'מֶרְכָ֥א תְּבִ֛יר', cleanName: 'מֶרְכָא תְּבִיר', questionText: 'מִלָּ֥ה מִלָּה֛', anim: 'tevir', time: 59.0 },
  { id: 19, name: '֚יְתִיב', cleanName: 'יְתִיב', questionText: '֚מִלָּה', anim: 'yetiv', time: 61.833 },
  { id: 20, name: 'מֻנַּ֣ח', cleanName: 'מֻנַּח', questionText: 'מִלָּ֣ה', anim: 'munach', time: 65.25 },
  { id: 21, name: 'שַׁלְשֶׁ֓לֶת', cleanName: 'שַׁלְשֶׁלֶת', questionText: 'מִלָּה֓', anim: 'shalshelet', time: 67.75 },
  { id: 22, name: 'קַרְנֵי־פָ֟רָה', cleanName: 'קַרְנֵי־פָרָה', questionText: 'מִלָּה֟', anim: 'karney_farah', time: 69.833 },
  { id: 23, name: 'מֶרְכָא֦־כְּפוּלָה', cleanName: 'מֶרְכָא־כְּפוּלָה', questionText: 'מִלָּה֦', anim: 'mercha_kefula', time: 80.583 },
  { id: 24, name: 'יֶרַח־בֶּן־יוֹמ֪וֹ', cleanName: 'יֶרַח־בֶּן־יוֹמוֹ', questionText: 'מִלָּה֪', anim: 'yareach', time: 86.916 },
  { id: 25, name: 'מֶרְכָ֥א טִפְּחָ֖א', cleanName: 'מֶרְכָא טִפְּחָא', questionText: 'מִלָּ֥ה מִלָּ֖ה', anim: 'tipcha', time: 93.666 },
  { id: 26, name: 'מֶרְכָ֥א סוֹף פָּסֽוּק׃', cleanName: 'מֶרְכָא סוֹף פָּסוּק', questionText: 'מִלָּ֥ה מִלָּֽה׃', anim: 'sof_pasuq', time: 98.833 }
];

const colors = [
  'bg-red-100 text-red-700 border-red-300',
  'bg-orange-100 text-orange-700 border-orange-300',
  'bg-yellow-100 text-yellow-700 border-yellow-300',
  'bg-green-100 text-green-700 border-green-300',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-pink-100 text-pink-700 border-pink-300',
];

const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

// פונקציה להשמעת צלילי הצלחה/טעות (במקום דיבור)
const playSound = (type: 'correct' | 'incorrect') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'game'>('learn');

  return (
    <div className="min-h-screen bg-sky-50 font-sans pb-12" dir="rtl">
      {/* Header & Navigation */}
      <header className="bg-white shadow-sm pt-6 pb-4 mb-8 rounded-b-3xl border-b-4 border-sky-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-sky-600 mb-6">
            טַעֲמֵי הַמִּקְרָא לִילָדִים 🎶
          </h1>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${
                activeTab === 'learn' 
                  ? 'bg-sky-500 text-white shadow-md scale-105' 
                  : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
              }`}
            >
              <Music size={20} />
              שיר הטעמים
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${
                activeTab === 'game' 
                  ? 'bg-amber-500 text-white shadow-md scale-105' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <Gamepad2 size={20} />
              משחק מצא את הטעם
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {activeTab === 'learn' ? <LearnMode /> : <LearningGameMode />}
      </main>
    </div>
  );
}

// ==========================================
// מצב למידה (שיר הטעמים)
// ==========================================
function LearnMode() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playModeRef = React.useRef<'single' | 'full' | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = React.useRef(0);

  // Sync state to ref so event listeners have the latest index
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    // Initialize audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      if (playModeRef.current === 'full') {
        if (currentIndexRef.current < taamim.length - 1) {
          const nextIndex = currentIndexRef.current + 1;
          setCurrentIndex(nextIndex);
          audio.src = assetUrl(`${taamim[nextIndex].id}.mp3`);
          audio.play().catch(e => console.error("Audio play failed", e));
        } else {
          // Finished the whole song
          setIsPlaying(false);
          playModeRef.current = null;
          setCurrentIndex(0);
        }
      } else if (playModeRef.current === 'single') {
        setIsPlaying(false);
        playModeRef.current = null;
      }
    };

    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying && playModeRef.current === 'full') {
      audioRef.current.pause();
      setIsPlaying(false);
      playModeRef.current = null;
    } else {
      playModeRef.current = 'full';
      setIsPlaying(true);
      
      let startIndex = currentIndexRef.current;
      // If we were at the end, start from the beginning
      if (startIndex >= taamim.length - 1 && !isPlaying) {
        startIndex = 0;
      }
      
      setCurrentIndex(startIndex);
      audioRef.current.src = assetUrl(`${taamim[startIndex].id}.mp3`);
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    playModeRef.current = null;
    setCurrentIndex(0);
  };

  const playSingle = (index: number) => {
    if (!audioRef.current) return;
    
    setCurrentIndex(index);
    playModeRef.current = 'single';
    setIsPlaying(true);
    
    audioRef.current.pause();
    audioRef.current.src = assetUrl(`${taamim[index].id}.mp3`);
    audioRef.current.play().catch(e => console.error("Audio play failed", e));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Large Display Area */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 text-center border-4 border-sky-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-sky-100">
          <motion.div 
            className="h-full bg-sky-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / taamim.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="py-8 min-h-[250px] flex flex-col items-center justify-center">
          <motion.div
            key={currentIndex}
            animate={animations[taamim[currentIndex].anim as keyof typeof animations]}
            className={`font-serif text-gray-800 mb-6 inline-block ${taamim[currentIndex].name.length > 15 ? 'text-5xl md:text-6xl' : 'text-7xl md:text-8xl'}`}
          >
            {taamim[currentIndex].name}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={reset}
            className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="התחל מחדש"
          >
            <RotateCcw size={28} />
          </button>
          <button
            onClick={togglePlay}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-2xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
              isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={32} />
                <span>עצור</span>
              </>
            ) : (
              <>
                <Play size={32} className="fill-current" />
                <span>נגן את השיר</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of all Taamim */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {taamim.map((taam, index) => {
          const isActive = index === currentIndex;
          const colorClass = colors[index % colors.length];
          const isLong = taam.name.length > 15;
          
          return (
            <motion.button
              key={`${taam.id}-${index}`}
              onClick={() => playSingle(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-h-[140px] ${colorClass} ${
                isActive 
                  ? 'ring-4 ring-sky-400 ring-offset-2 scale-105 shadow-xl z-10' 
                  : 'hover:shadow-md opacity-80 hover:opacity-100'
              }`}
            >
              <motion.span 
                className={`font-bold font-serif text-center leading-tight ${isLong ? 'text-3xl' : 'text-4xl'}`}
                animate={isActive ? animations[taam.anim as keyof typeof animations] : {}}
              >
                {taam.name}
              </motion.span>
              
              {isActive && isPlaying && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-sky-500 text-white p-1.5 rounded-full shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Volume2 size={16} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ==========================================
// מצב משחק (מצא את הטעם)
// ==========================================
const uniquePracticeTaamim = Array.from(new Map(taamim.map(item => [item.cleanName, item])).values());
const lessonSize = 5;
const lessonCount = Math.ceil(uniquePracticeTaamim.length / lessonSize);
const sessionLength = 10;

type PracticeQuestion = {
  correct: typeof taamim[0];
  options: typeof taamim;
};

function getLessonPool(lessonIndex: number) {
  const start = lessonIndex * lessonSize;
  const pool = uniquePracticeTaamim.slice(start, start + lessonSize);
  return pool.length >= 4 ? pool : uniquePracticeTaamim.slice(-lessonSize);
}

function LearningGameMode() {
  const [gameType, setGameType] = useState<'visual' | 'audio'>('visual');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [unlockedLessons, setUnlockedLessons] = useState(() => {
    const saved = Number(window.localStorage.getItem('taamim-unlocked-lessons') || 1);
    return Math.min(Math.max(saved, 1), lessonCount);
  });
  const [questionNumber, setQuestionNumber] = useState(1);
  const [sessionScore, setSessionScore] = useState(0);
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hadMistake, setHadMistake] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const generateQuestion = React.useCallback(() => {
    const pool = getLessonPool(lessonIndex);
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const options = [correct];

    while (options.length < Math.min(4, pool.length)) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      if (!options.some(option => option.cleanName === candidate.cleanName)) {
        options.push(candidate);
      }
    }

    setQuestion({ correct, options: options.sort(() => Math.random() - 0.5) });
    setFeedback(null);
    setHadMistake(false);
  }, [lessonIndex]);

  useEffect(() => {
    generateQuestion();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      questionAudioRef.current?.pause();
    };
  }, [generateQuestion]);

  const playQuestionAudio = () => {
    if (!question) return;
    questionAudioRef.current?.pause();
    const audio = new Audio(assetUrl(`${question.correct.id}.mp3`));
    questionAudioRef.current = audio;
    audio.play().catch(error => console.error('Audio play failed', error));
  };

  const resetSession = (nextLesson = lessonIndex) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLessonIndex(nextLesson);
    setQuestionNumber(1);
    setSessionScore(0);
    setSessionComplete(false);
    setFeedback(null);
    setHadMistake(false);
    if (nextLesson === lessonIndex) generateQuestion();
  };

  const finishSession = (finalScore: number) => {
    setSessionComplete(true);
    if (finalScore >= 8 && lessonIndex + 1 < lessonCount) {
      setUnlockedLessons(previous => {
        const next = Math.max(previous, lessonIndex + 2);
        window.localStorage.setItem('taamim-unlocked-lessons', String(next));
        return next;
      });
    }
  };

  const handleAnswer = (selected: typeof taamim[0]) => {
    if (!question || feedback === 'correct') return;

    if (selected.cleanName === question.correct.cleanName) {
      const nextScore = sessionScore + (hadMistake ? 0 : 1);
      setSessionScore(nextScore);
      setFeedback('correct');
      playSound('correct');
      timeoutRef.current = setTimeout(() => {
        if (questionNumber >= sessionLength) {
          finishSession(nextScore);
        } else {
          setQuestionNumber(number => number + 1);
          generateQuestion();
        }
      }, 1100);
    } else {
      setHadMistake(true);
      setFeedback('incorrect');
      playSound('incorrect');
      timeoutRef.current = setTimeout(() => setFeedback(null), 800);
    }
  };

  if (!question) return null;

  if (sessionComplete) {
    const passed = sessionScore >= 8;
    const hasNextLesson = lessonIndex + 1 < lessonCount;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white rounded-3xl border-4 border-amber-200 shadow-xl p-8 text-center">
        <Trophy size={80} className="mx-auto text-amber-500 mb-4" />
        <h2 className="text-4xl font-black text-sky-700 mb-3">סיימת את האימון!</h2>
        <p className="text-2xl font-bold text-gray-700 mb-2">{sessionScore} מתוך {sessionLength} בניסיון הראשון</p>
        <p className="text-lg text-gray-600 mb-8">
          {passed ? (hasNextLesson ? 'מצוין! השיעור הבא נפתח עבורך.' : 'מצוין! השלמת את כל שיעורי הטעמים.') : 'כמעט! כדאי לנסות שוב ולכוון ל־8 הצלחות.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => resetSession()} className="px-7 py-4 rounded-full bg-sky-500 text-white text-xl font-bold hover:bg-sky-600">אימון נוסף</button>
          {passed && hasNextLesson && (
            <button onClick={() => resetSession(lessonIndex + 1)} className="px-7 py-4 rounded-full bg-amber-500 text-white text-xl font-bold hover:bg-amber-600">לשיעור הבא</button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5 border-2 border-amber-100">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {Array.from({ length: lessonCount }, (_, index) => {
            const unlocked = index < unlockedLessons;
            return (
              <button
                key={index}
                disabled={!unlocked}
                onClick={() => resetSession(index)}
                className={`px-4 py-2 rounded-full font-bold transition-colors ${lessonIndex === index ? 'bg-amber-500 text-white' : unlocked ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                שיעור {index + 1}{!unlocked ? ' 🔒' : ''}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-lg">
            <Trophy size={24} />
            <span>שאלה {questionNumber}/{sessionLength} · הצלחות {sessionScore}</span>
          </div>
          <div className="flex bg-sky-50 p-1 rounded-full">
            <button onClick={() => setGameType('visual')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${gameType === 'visual' ? 'bg-sky-500 text-white' : 'text-sky-700'}`}><Eye size={18} /> לפי סימן</button>
            <button onClick={() => setGameType('audio')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${gameType === 'audio' ? 'bg-sky-500 text-white' : 'text-sky-700'}`}><Headphones size={18} /> לפי שמיעה</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-7 md:p-10 mb-7 text-center border-4 border-amber-200 relative overflow-hidden">
        <h2 className="text-2xl text-gray-600 font-bold mb-7">
          {gameType === 'visual' ? 'איזה טעם מופיע על המילה?' : 'איזה טעם שמעת?'}
        </h2>
        <div className="min-h-[160px] flex items-center justify-center">
          {gameType === 'visual' ? (
            <motion.div key={question.correct.id} animate={animations[question.correct.anim as keyof typeof animations]} className="font-serif text-gray-800 text-6xl md:text-8xl leading-relaxed">
              {question.correct.questionText}
            </motion.div>
          ) : (
            <button onClick={playQuestionAudio} className="flex flex-col items-center gap-3 text-sky-700 hover:text-sky-800" aria-label="השמע שוב את הטעם">
              <span className="w-28 h-28 rounded-full bg-sky-100 flex items-center justify-center shadow-inner"><Volume2 size={58} /></span>
              <span className="text-xl font-bold">לחץ כדי לשמוע</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} aria-live="polite" className={`absolute inset-0 flex flex-col items-center justify-center bg-white/95 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
              {feedback === 'correct' ? <CheckCircle2 size={90} /> : <XCircle size={90} />}
              <h3 className="text-4xl font-black mt-3">{feedback === 'correct' ? 'כל הכבוד!' : 'נסה שוב!'}</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map(option => (
          <motion.button key={`${question.correct.id}-${option.id}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(option)} disabled={feedback === 'correct'} className="bg-white border-4 border-sky-100 hover:border-sky-300 hover:bg-sky-50 text-sky-800 text-xl md:text-2xl font-bold py-6 px-4 rounded-2xl shadow-sm">
            {option.cleanName}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

type Question = {
  correct: typeof taamim[0];
  options: typeof taamim;
};

function GameMode() {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // יצירת שאלה חדשה
  const generateQuestion = React.useCallback(() => {
    // סינון טעמים כפולים (כמו פשטא שמופיע פעמיים) כדי למנוע בלבול באפשרויות
    const uniqueTaamim = Array.from(new Map(taamim.map(item => [item.cleanName, item])).values());
    
    const correctTaam = uniqueTaamim[Math.floor(Math.random() * uniqueTaamim.length)];
    const options = [correctTaam];
    
    while (options.length < 4) {
      const randomTaam = uniqueTaamim[Math.floor(Math.random() * uniqueTaamim.length)];
      if (!options.find(o => o.cleanName === randomTaam.cleanName)) {
        options.push(randomTaam);
      }
    }
    
    // ערבוב האפשרויות
    options.sort(() => Math.random() - 0.5);
    
    setQuestion({ correct: correctTaam, options });
    setFeedback(null);
    setIsAnimating(true);
    
    // הפעלת האנימציה של הטעם שוב ושוב כדי לעזור לילד
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 50);
    }, 2000);
  }, []);

  useEffect(() => {
    generateQuestion();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [generateQuestion]);

  const handleAnswer = (selected: typeof taamim[0]) => {
    if (feedback !== null) return; // מניעת לחיצות כפולות
    
    if (selected.cleanName === question?.correct.cleanName) {
      setFeedback('correct');
      setScore(s => s + 1);
      playSound('correct');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        generateQuestion();
      }, 2000);
    } else {
      setFeedback('incorrect');
      playSound('incorrect');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      {/* Score Board */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm mb-6 border-2 border-amber-100">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xl">
          <Trophy size={28} className="text-amber-500" />
          <span>נקודות: {score}</span>
        </div>
        <button 
          onClick={() => { 
            setScore(0); 
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            generateQuestion(); 
          }}
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          התחל מחדש
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8 text-center border-4 border-amber-200 relative">
        <h2 className="text-2xl text-gray-600 font-bold mb-8">איזה טעם מופיע על המילה?</h2>
        
        <div className="min-h-[150px] flex flex-col items-center justify-center gap-6">
          <motion.div
            key={question.correct.id + (isAnimating ? '-anim' : '')}
            animate={isAnimating ? animations[question.correct.anim as keyof typeof animations] : {}}
            className="font-serif text-gray-800 inline-block text-7xl md:text-8xl mb-4"
          >
            {question.correct.questionText}
          </motion.div>
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`absolute inset-0 flex flex-col items-center justify-center rounded-3xl z-10 bg-white/90 backdrop-blur-sm ${
                feedback === 'correct' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 size={100} className="mb-4" />
                  <h3 className="text-4xl font-black">כל הכבוד!</h3>
                </>
              ) : (
                <>
                  <XCircle size={100} className="mb-4" />
                  <h3 className="text-4xl font-black">נסה שוב!</h3>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={`${question.correct.id}-${option.id}-${index}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className="bg-white border-4 border-sky-100 hover:border-sky-300 hover:bg-sky-50 text-sky-800 text-xl md:text-2xl font-bold py-6 px-4 rounded-2xl shadow-sm transition-colors"
          >
            {option.cleanName}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
