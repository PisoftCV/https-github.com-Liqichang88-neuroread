import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Eye } from 'lucide-react';
import { SCHULTE_LEVELS } from '../constants';

interface Props {
  onBack: () => void;
}

const SchulteTable: React.FC<Props> = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0); // Default to 3x3
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'FINISHED'>('IDLE');

  const config = SCHULTE_LEVELS[levelIndex];
  const gridSize = config.size;

  const generateGrid = useCallback(() => {
    const total = gridSize * gridSize;
    const nums = Array.from({ length: total }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setNumbers(nums);
    setNextExpected(1);
    setFinished(false);
    setElapsed(0);
    setStartTime(null);
    setStatus('IDLE');
  }, [gridSize]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  useEffect(() => {
    let interval: number;
    if (status === 'RUNNING' && startTime) {
      interval = window.setInterval(() => {
        setElapsed((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  const handleCellClick = (num: number) => {
    if (status === 'FINISHED') return;

    if (status === 'IDLE') {
      if (num === 1) {
        setStatus('RUNNING');
        setStartTime(Date.now());
        setNextExpected(2);
      }
      return;
    }

    if (num === nextExpected) {
      if (num === gridSize * gridSize) {
        setStatus('FINISHED');
        setFinished(true);
      } else {
        setNextExpected(prev => prev + 1);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium">
          <ArrowLeft size={20} className="mr-2" /> 返回
        </button>
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-lg">
          {SCHULTE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.size}
              onClick={() => setLevelIndex(idx)}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all shadow-sm ${
                levelIndex === idx 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'bg-transparent text-slate-500 hover:text-slate-700 shadow-none'
              }`}
            >
              {lvl.size}x{lvl.size}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">舒尔特方格专注力训练</h2>
          <p className="text-slate-600 max-w-lg mx-auto mb-6 text-sm">
            请注视 <span className="font-bold text-indigo-600">中间的红点</span>。
            仅利用<span className="font-bold">余光</span>按顺序点击数字 1 到 {gridSize * gridSize}。
          </p>
          
          <div className="inline-flex justify-center items-center gap-8 text-xl font-mono font-bold text-slate-700 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <div className={`flex items-center gap-2 ${finished && elapsed <= config.targetTime ? 'text-emerald-600' : ''}`}>
              <TimerIcon finished={finished} />
              {elapsed.toFixed(1)}s
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-sans text-slate-400 font-medium">寻找</span>
                <span className="text-indigo-600 text-2xl">{nextExpected}</span>
            </div>
          </div>
        </div>

        <div 
          className="grid gap-3 mx-auto aspect-square max-w-[480px] relative p-4 bg-slate-50 rounded-2xl border border-slate-100"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {/* Fixed Central Eye Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             {/* Transparent visual anchor to avoid blocking numbers */}
             <div className="relative flex items-center justify-center">
                <Eye size={64} className="text-red-500/10 absolute animate-pulse" />
                <div className="w-1.5 h-1.5 bg-red-500/60 rounded-full shadow-sm"></div>
             </div>
          </div>

          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleCellClick(num)}
              className={`
                rounded-xl text-xl md:text-3xl font-bold flex items-center justify-center
                transition-all duration-150 select-none relative shadow-sm border-b-4 active:border-b-0 active:translate-y-1
                ${num < nextExpected 
                  ? 'bg-slate-100 text-slate-300 border-slate-200 shadow-none' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer'}
                ${status === 'IDLE' && num !== 1 ? 'opacity-50 cursor-not-allowed' : ''}
                ${status === 'IDLE' && num === 1 ? 'ring-4 ring-indigo-500/20 border-indigo-300 text-indigo-600 animate-pulse' : ''}
              `}
            >
              <span className="relative z-10">{num}</span>
            </button>
          ))}
        </div>

        {finished && (
          <div className="mt-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className={`text-xl font-bold mb-4 ${elapsed <= config.targetTime ? 'text-emerald-600' : 'text-amber-600'}`}>
              {elapsed <= config.targetTime ? "太棒了！达成目标 🎯" : "继续练习，提升搜索速度 💪"}
            </div>
            <button
              onClick={generateGrid}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 font-bold transition-all transform hover:-translate-y-0.5"
            >
              <RefreshCw size={20} /> 再来一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TimerIcon = ({ finished }: { finished: boolean }) => {
  return finished ? <span>🏁</span> : <span>⏱️</span>;
};

export default SchulteTable;