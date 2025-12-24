import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Eye, LayoutTemplate, MousePointer2, Edit3, ArrowRight } from 'lucide-react';
import { READING_MATERIALS } from '../constants';
import { ReadingText } from '../types';

interface Props {
  onBack: () => void;
}

const ChunkingDrill: React.FC<Props> = ({ onBack }) => {
  const [selectedTextId, setSelectedTextId] = useState(READING_MATERIALS[0].id);
  const [customContent, setCustomContent] = useState('');
  const [isCustomConfiguring, setIsCustomConfiguring] = useState(false);

  const [showFocusDot, setShowFocusDot] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);

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

  // Group materials by category
  const groupedMaterials = useMemo(() => {
    const groups: Record<string, typeof READING_MATERIALS> = {};
    READING_MATERIALS.forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, []);

  // Logic to process text chunks
  const processedChunks = useMemo(() => {
    if (textData.chunks && textData.chunks.length > 0) {
      return textData.chunks;
    }

    // Auto-chunking fallback
    const content = textData.content || "";
    if (!content.trim()) return ["暂无内容"];

    const autoChunks: string[] = [];
    const sentences = content.split(/([，。；：、！？])/);
    
    let currentChunk = "";
    sentences.forEach(part => {
        if (!part) return;
        if (/^[，。；：、！？]$/.test(part)) {
            if (autoChunks.length > 0) {
                autoChunks[autoChunks.length - 1] += part;
            } else {
                currentChunk += part;
            }
        } else {
            if (part.length > 8) {
                for (let i = 0; i < part.length; i += 4) {
                    autoChunks.push(part.slice(i, i + 4));
                }
            } else {
                autoChunks.push(part);
            }
        }
    });
    return autoChunks;
  }, [textData]);

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
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium">
          <ArrowLeft size={20} className="mr-2" /> 返回
        </button>
        <div className="flex items-center gap-4">
            {!isCustomConfiguring && (
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button 
                        onClick={() => setShowFocusDot(!showFocusDot)}
                        className={`p-2 rounded flex items-center gap-2 text-xs font-medium transition-colors ${showFocusDot ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        title="显示注视点"
                    >
                        <MousePointer2 size={16} /> <span className="hidden sm:inline">注视点</span>
                    </button>
                    <div className="w-px bg-slate-200 mx-1"></div>
                    <button 
                        onClick={() => setShowBoundaries(!showBoundaries)}
                        className={`p-2 rounded flex items-center gap-2 text-xs font-medium transition-colors ${showBoundaries ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        title="显示边界"
                    >
                        <LayoutTemplate size={16} /> <span className="hidden sm:inline">意群框</span>
                    </button>
                </div>
            )}

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
      </div>

      {isCustomConfiguring && selectedTextId === 'custom' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 max-w-3xl mx-auto">
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
                <span className="text-slate-500 text-sm">系统将自动进行意群切分</span>
                <button 
                disabled={!customContent.trim()}
                onClick={() => setIsCustomConfiguring(false)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                    开始意群训练 <ArrowRight size={20} />
                </button>
            </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-blue-500" />
                        意群视读原理
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        意群视读通过“信息封装”减少眼跳次数。阅读高手的视线不是线性扫描，而是“点状跳跃”。
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 flex items-start gap-3">
                        <Eye className="shrink-0 mt-0.5" size={18} />
                        <div>
                            <strong>训练要点：</strong> 强迫眼睛只落在<span className="text-red-500 font-bold">红点</span>位置。利用余光读取整个方块内的文字，坚决不进行左右扫视。
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">原文对照</h3>
                        {selectedTextId === 'custom' && (
                            <button onClick={() => setIsCustomConfiguring(true)} className="text-xs text-indigo-600 font-bold hover:underline">编辑内容</button>
                        )}
                    </div>
                    <p className="font-serif text-base leading-loose text-slate-700">
                        {textData.content}
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl shadow-inner border border-slate-200 relative min-h-[500px]">
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-indigo-100">
                    训练视图
                </div>
                
                <div className="font-serif text-xl leading-[3rem] text-slate-800 flex flex-wrap content-start gap-3">
                    {processedChunks.map((chunk, idx) => {
                        const cleanChunk = chunk.replace(/\//g, '').trim();
                        if (!cleanChunk) return null;
                        return (
                            <span 
                                key={idx} 
                                className={`
                                    relative inline-flex items-center justify-center px-3 py-1.5 transition-all duration-200
                                    ${showBoundaries ? 'bg-white shadow-sm border border-indigo-100 rounded-lg hover:border-indigo-300 hover:shadow-md' : ''}
                                `}
                            >
                                {showFocusDot && (
                                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_4px_rgba(239,68,68,0.5)]"></span>
                                )}
                                <span className="relative z-10">{cleanChunk}</span>
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChunkingDrill;