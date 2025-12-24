import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Settings, Edit3, ArrowRight } from 'lucide-react';
import { READING_MATERIALS } from '../constants';
import { ReadingText } from '../types';

interface Props {
  onBack: () => void;
}

const RSVPReader: React.FC<Props> = ({ onBack }) => {
  const [selectedTextId, setSelectedTextId] = useState(READING_MATERIALS[0].id);
  const [customContent, setCustomContent] = useState('');
  const [isCustomConfiguring, setIsCustomConfiguring] = useState(false);
  
  const [wpm, setWpm] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);

  // Construct the active text object
  const textData = useMemo((): ReadingText => {
    if (selectedTextId === 'custom') {
        return {
            id: 'custom',
            title: '自定义文本',
            category: 'Drill', // Generic category
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
    let w: string[] = [];
    
    // Only process if we are not configuring custom text
    if (selectedTextId === 'custom' && isCustomConfiguring) {
        return;
    }

    if (textData.chunks) {
        w = textData.chunks.map(c => c.replace(/\//g, ''));
    } else {
        const rawContent = textData.content || "";
        if (!rawContent.trim()) {
            setWords(["请先输入", "文本内容"]);
            return;
        }

        const IntlAny = Intl as any;
        
        if (IntlAny.Segmenter) {
            const segmenter = new IntlAny.Segmenter('zh-CN', { granularity: 'word' });
            const segments = Array.from(segmenter.segment(rawContent));
            let tempGroup = "";
            segments.forEach((seg: any) => {
                if ((tempGroup.length + seg.segment.length) <= 4 || tempGroup.length === 0) {
                     tempGroup += seg.segment;
                } else {
                    w.push(tempGroup);
                    tempGroup = seg.segment;
                }
            });
            if (tempGroup) w.push(tempGroup);
        }
        if (w.length === 0) {
            w = rawContent.match(/.{1,4}/g) || [];
        }
    }
    setWords(w);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [selectedTextId, textData, isCustomConfiguring]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && currentIndex < words.length) {
      const msPerChunk = 60000 / (wpm / 2.5); 
      interval = window.setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, msPerChunk);
    }
    return () => clearInterval(interval);
  }, [isPlaying, wpm, words.length, currentIndex]);

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;

  const handleTextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === 'custom') {
          setSelectedTextId('custom');
          setIsCustomConfiguring(true);
      } else {
          setSelectedTextId(e.target.value);
          setIsCustomConfiguring(false);
      }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium">
          <ArrowLeft size={20} className="mr-2" /> 返回
        </button>
        <select 
          value={selectedTextId}
          onChange={handleTextChange}
          className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[200px]"
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
                  <span className="text-slate-500 text-sm">当前字数: {customContent.length}</span>
                  <button 
                    disabled={!customContent.trim()}
                    onClick={() => setIsCustomConfiguring(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                      开始训练 <ArrowRight size={20} />
                  </button>
              </div>
          </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-stone-100 p-8 md:p-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-8 text-amber-600 font-bold bg-amber-50 border border-amber-100 inline-block px-4 py-1.5 rounded-full mx-auto shadow-sm">
                <Zap size={16} fill="currentColor" />
                <span>超频阅读模式 (Overclocking)</span>
            </div>

            <div className="relative h-72 flex items-center justify-center mb-8 bg-stone-50 rounded-2xl border-2 border-stone-100 overflow-hidden group">
            {/* Enhanced Focal Point Guide */}
            <div className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity">
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-400"></div>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-red-400"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-red-400 rounded-full"></div>
            </div>

            <div className="text-5xl md:text-7xl font-serif font-black text-slate-800 z-10 px-4 tracking-wide">
                {words.length > 0 && currentIndex < words.length ? words[currentIndex] : "结束"}
            </div>
            </div>

            <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-lg space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>进度</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-100 ease-linear" 
                    style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
                <button 
                    onClick={() => {
                    setCurrentIndex(0);
                    setIsPlaying(false);
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    title="重置"
                >
                <RotateCcw size={22} />
                </button>

                <button 
                    onClick={() => {
                        if (currentIndex >= words.length - 1) setCurrentIndex(0);
                        setIsPlaying(!isPlaying);
                    }}
                    className={`
                        w-16 h-16 flex items-center justify-center rounded-2xl text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95
                        ${isPlaying ? 'bg-slate-800 hover:bg-slate-900' : 'bg-indigo-600 hover:bg-indigo-700'}
                    `}
                >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                
                <div className="flex flex-col items-center px-4 border-l border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">速度 (CPM)</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setWpm(Math.max(100, wpm - 50))} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors">-</button>
                        <span className="text-xl font-mono font-bold w-12 text-center text-slate-800">{wpm}</span>
                        <button onClick={() => setWpm(wpm + 50)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors">+</button>
                    </div>
                </div>
                {selectedTextId === 'custom' && (
                    <button 
                        onClick={() => setIsCustomConfiguring(true)}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border-l border-slate-100"
                        title="编辑文本"
                    >
                        <Edit3 size={20} />
                    </button>
                )}
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RSVPReader;