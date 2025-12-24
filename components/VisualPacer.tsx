import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Play, Pause, ScanEye, Settings2, Edit3, ArrowRight } from 'lucide-react';
import { READING_MATERIALS } from '../constants';
import { ReadingText } from '../types';

interface Props {
  onBack: () => void;
}

const VisualPacer: React.FC<Props> = ({ onBack }) => {
  const [selectedTextId, setSelectedTextId] = useState('chameleon');
  const [customContent, setCustomContent] = useState('');
  const [isCustomConfiguring, setIsCustomConfiguring] = useState(false);

  const [speed, setSpeed] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const textData = useMemo((): ReadingText => {
    if (selectedTextId === 'custom') {
        return {
            id: 'custom',
            title: '自定义文本',
            category: 'Drill',
            content: customContent,
            wordCount: customContent.length
        };
    }
    return READING_MATERIALS.find(t => t.id === selectedTextId)!;
  }, [selectedTextId, customContent]);

  // Group materials
  const groupedMaterials = useMemo(() => {
    const groups: Record<string, typeof READING_MATERIALS> = {};
    READING_MATERIALS.forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let lastTime: number;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setProgress(prev => {
        if (containerRef.current && prev >= containerRef.current.scrollHeight) {
          setIsPlaying(false);
          return 0;
        }
        return prev + (speed * delta * 5);
      });

      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    } else {
        lastTime = 0;
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, speed]);

  const togglePlay = () => {
    if (!isPlaying && progress >= (containerRef.current?.scrollHeight || 1000)) {
        setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') {
        setSelectedTextId('custom');
        setIsCustomConfiguring(true);
        setIsPlaying(false);
        setProgress(0);
    } else {
        setSelectedTextId(e.target.value);
        setIsCustomConfiguring(false);
        setProgress(0);
        setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium">
          <ArrowLeft size={20} className="mr-2" /> 返回
        </button>
        <div className="flex items-center gap-4">
            {!isCustomConfiguring && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <Settings2 size={16} className="text-slate-400" />
                    <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={speed} 
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-24 accent-emerald-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-mono font-medium text-slate-600 w-16 text-right">速度: {speed}</span>
                </div>
            )}
            <select 
                value={selectedTextId}
                onChange={handleTextChange}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[160px]"
            >
                <option value="custom">➕ 自定义文本输入</option>
                {Object.entries(groupedMaterials).map(([category, items]) => (
                    <optgroup key={category} label={category}>
                        {(items as typeof READING_MATERIALS).map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
      </div>

      {isCustomConfiguring && selectedTextId === 'custom' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Edit3 size={24} className="text-indigo-600"/> 输入自定义阅读内容
            </h3>
            <textarea
                className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-lg leading-relaxed mb-4"
                placeholder="在此处粘贴您想要练习阅读的文章内容..."
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
            ></textarea>
            <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm"></span>
                <button 
                disabled={!customContent.trim()}
                onClick={() => setIsCustomConfiguring(false)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                    开始引导阅读 <ArrowRight size={20} />
                </button>
            </div>
        </div>
      ) : (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden relative">
                <div className="bg-emerald-50/80 backdrop-blur-sm p-4 border-b border-emerald-100 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <ScanEye size={20} />
                        <span className="font-semibold">视觉引导 (Pacing Guide)</span>
                    </div>
                    <div className="flex gap-2">
                        {selectedTextId === 'custom' && (
                            <button onClick={() => setIsCustomConfiguring(true)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg">
                                <Edit3 size={16}/>
                            </button>
                        )}
                        <button 
                            onClick={togglePlay}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm font-medium text-sm
                                ${isPlaying ? 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                            `}
                        >
                            {isPlaying ? <><Pause size={16} /> 暂停</> : <><Play size={16} /> 开始引导</>}
                        </button>
                    </div>
                </div>

                <div className="relative p-8 md:p-16 min-h-[500px]" ref={containerRef}>
                    {/* Enhanced Guide Line with Glassmorphism */}
                    {isPlaying && (
                        <div 
                        className="absolute left-0 right-0 h-16 pointer-events-none z-10 transition-transform duration-75 ease-linear"
                        style={{ transform: `translateY(${progress}px)`, top: -20 }}
                        >
                            {/* The line itself */}
                            <div className="absolute bottom-0 w-full h-1 bg-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.4)]"></div>
                            {/* The glass effect above the line to slightly blur read text */}
                            <div className="absolute top-0 w-full h-full bg-gradient-to-t from-emerald-100/20 to-transparent backdrop-blur-[1px]"></div>
                            
                            <div className="absolute right-0 -bottom-6 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-l shadow-sm opacity-80">Pacer</div>
                        </div>
                    )}
                
                    <div className="font-serif text-xl leading-[2.5] text-slate-800 max-w-2xl mx-auto text-justify whitespace-pre-wrap">
                        {textData.content}
                    </div>
                </div>
            </div>
            
            <p className="mt-4 text-center text-slate-500 text-sm">
                目标: 保持视线始终处于绿线<span className="font-bold text-slate-700">下方一点点</span>。让线推着你往下读，坚决不回头看。
            </p>
        </>
      )}
    </div>
  );
};

export default VisualPacer;