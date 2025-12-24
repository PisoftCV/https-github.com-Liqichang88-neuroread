import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Timer, Calculator, Edit3, ArrowRight } from 'lucide-react';
import { READING_MATERIALS, WCPM_NORMS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { ReadingText } from '../types';

interface Props {
  onBack: () => void;
}

const WCPMTest: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<'INTRO' | 'READING' | 'SCORING' | 'RESULT'>('INTRO');
  const [textId, setTextId] = useState('dinosaur');
  const [customContent, setCustomContent] = useState('');
  const [isCustomConfiguring, setIsCustomConfiguring] = useState(false);

  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errors, setErrors] = useState(0);
  const [score, setScore] = useState(0);

  const textData = useMemo((): ReadingText => {
    if (textId === 'custom') {
        return {
            id: 'custom',
            title: '自定义文本',
            category: 'Drill',
            content: customContent,
            wordCount: customContent.length
        };
    }
    return READING_MATERIALS.find(t => t.id === textId)!;
  }, [textId, customContent]);

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
    let interval: number;
    if (step === 'READING') {
      interval = window.setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [step, startTime]);

  const startTest = () => {
    setStep('READING');
    setStartTime(Date.now());
    setDuration(0);
  };

  const finishReading = () => {
    setStep('SCORING');
  };

  const calculateScore = () => {
    // Formula: (Total Characters - Errors) / Time(sec) * 60
    const timeInSeconds = duration / 1000;
    const wcpm = ((textData.wordCount - errors) / timeInSeconds) * 60;
    setScore(Math.round(wcpm));
    setStep('RESULT');
  };

  const getNormStatus = (wcpm: number) => {
    if (wcpm >= 300) return { label: "卓越 (Top 10%)", color: "text-emerald-600" }; // Adjusted for Chinese adult reading speed
    if (wcpm >= 200) return { label: "优秀 (Top 25%)", color: "text-blue-600" };
    if (wcpm >= 150) return { label: "平均水平", color: "text-amber-600" };
    return { label: "需要练习", color: "text-red-600" };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') {
        setTextId('custom');
        setIsCustomConfiguring(true);
    } else {
        setTextId(e.target.value);
        setIsCustomConfiguring(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 font-medium">
          <ArrowLeft size={20} className="mr-2" /> 返回
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            {step === 'INTRO' && (
                isCustomConfiguring && textId === 'custom' ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Edit3 size={24} className="text-indigo-600"/> 输入自定义测试文本
                        </h3>
                        <textarea
                            className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-lg leading-relaxed mb-4"
                            placeholder="在此处粘贴您想要测试的文章内容..."
                            value={customContent}
                            onChange={(e) => setCustomContent(e.target.value)}
                        ></textarea>
                         <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">字数: {customContent.length}</span>
                            <button 
                                disabled={!customContent.trim()}
                                onClick={() => setIsCustomConfiguring(false)}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                            >
                                确认文本 <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center space-y-6">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                            <Timer size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">阅读流畅度测评</h2>
                        <p className="text-slate-600">
                            该测试将计算您的 <strong>WCPM (每分钟正确阅读字数)</strong>。
                            请以自然的速度阅读文章。读完后点击结束，并预估您可能出现的错误（漏字、读错）。
                        </p>
                        <div className="p-4 bg-stone-50 rounded-xl text-left">
                            <label className="block text-sm font-medium text-slate-700 mb-2">选择文章</label>
                            <div className="flex gap-2">
                                <select 
                                    value={textId} 
                                    onChange={handleTextChange}
                                    className="w-full border-slate-300 rounded-lg"
                                >
                                    <option value="custom">➕ 自定义文本输入</option>
                                    {Object.entries(groupedMaterials).map(([category, items]) => (
                                        <optgroup key={category} label={category}>
                                            {(items as typeof READING_MATERIALS).map(t => (
                                                <option key={t.id} value={t.id}>{t.title} (约{t.wordCount}字)</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                {textId === 'custom' && (
                                     <button onClick={() => setIsCustomConfiguring(true)} className="px-3 bg-white border border-slate-300 rounded-lg text-indigo-600 hover:bg-indigo-50">
                                        <Edit3 size={18} />
                                     </button>
                                )}
                            </div>
                        </div>
                        <button onClick={startTest} className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors">
                            开始阅读
                        </button>
                    </div>
                )
            )}

            {step === 'READING' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <span className="font-bold text-slate-500">阅读模式</span>
                        <div className="text-xl font-mono font-bold text-rose-600">
                            {(duration / 1000).toFixed(1)}s
                        </div>
                    </div>
                    <p className="font-serif text-lg leading-loose text-slate-800 mb-8 select-none whitespace-pre-wrap">
                        {textData.content}
                    </p>
                    <button onClick={finishReading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                        我读完了
                    </button>
                </div>
            )}

            {step === 'SCORING' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md mx-auto">
                    <h3 className="text-xl font-bold mb-4">计算成绩</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-slate-600">
                            <span>阅读用时:</span>
                            <span className="font-mono font-bold">{(duration / 1000).toFixed(2)}s</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>文章总字数:</span>
                            <span className="font-mono font-bold">{textData.wordCount}</span>
                        </div>
                        <div className="pt-4 border-t">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                预估错误 (漏读/读错)
                            </label>
                            <input 
                                type="number" 
                                min="0" 
                                value={errors} 
                                onChange={(e) => setErrors(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-lg p-2 text-center text-xl font-bold"
                            />
                        </div>
                        <button onClick={calculateScore} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl mt-4 hover:bg-indigo-700">
                            查看结果
                        </button>
                    </div>
                </div>
            )}

            {step === 'RESULT' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
                    <h3 className="text-slate-500 font-medium uppercase tracking-wide text-sm mb-2">您的流畅度得分</h3>
                    <div className="text-6xl font-black text-slate-900 mb-2">{score}</div>
                    <div className="text-slate-400 font-medium mb-6">字/分钟 (CCPM)</div>
                    
                    <div className={`inline-block px-4 py-2 rounded-full bg-stone-100 font-bold ${getNormStatus(score).color}`}>
                        {getNormStatus(score).label}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                            <span className="block text-slate-400">计算公式</span>
                            <span className="font-mono text-slate-600">
                                (总字数 - 错误数) ÷ 时间 × 60
                            </span>
                        </div>
                        <div className="text-right">
                             <button onClick={() => {setStep('INTRO'); setErrors(0);}} className="text-indigo-600 font-bold hover:underline">
                                再测一次
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 h-fit">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calculator size={18} />
                常模参考 (WCPM)
            </h3>
            <p className="text-xs text-slate-500 mb-4">基于通用阅读速度统计</p>
            
            <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={WCPM_NORMS}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 200]} hide />
                        <YAxis dataKey="percentile" type="category" width={40} />
                        <Tooltip cursor={{fill: '#f5f5f4'}} />
                        <Bar dataKey="spring" fill="#e2e8f0" radius={[0, 4, 4, 0]}>
                           {
                            WCPM_NORMS.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'} />
                            ))
                           } 
                        </Bar>
                        {step === 'RESULT' && <ReferenceLine x={score} stroke="black" strokeDasharray="3 3" label="您" />}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span>前10% (极优):</span> <span className="font-bold">184+</span></div>
                <div className="flex justify-between"><span>前25% (优秀):</span> <span className="font-bold">160+</span></div>
                <div className="flex justify-between"><span>前50% (良好):</span> <span className="font-bold">133+</span></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WCPMTest;