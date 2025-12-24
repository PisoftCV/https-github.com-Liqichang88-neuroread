import React, { useState } from 'react';
import { 
  Grid3X3, 
  Zap, 
  AlignLeft, 
  ScanEye, 
  Timer,
  BookOpen,
  ArrowRight,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Trophy,
  BrainCircuit,
  Target,
  PlayCircle
} from 'lucide-react';
import { TrainingModule } from './types';
import { TRAINING_PLANS } from './constants';
import SchulteTable from './components/SchulteTable';
import RSVPReader from './components/RSVPReader';
import ChunkingDrill from './components/ChunkingDrill';
import VisualPacer from './components/VisualPacer';
import WCPMTest from './components/WCPMTest';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<TrainingModule>(TrainingModule.DASHBOARD);

  const renderModule = () => {
    switch (currentModule) {
      case TrainingModule.SCHULTE:
        return <SchulteTable onBack={() => setCurrentModule(TrainingModule.DASHBOARD)} />;
      case TrainingModule.RSVP:
        return <RSVPReader onBack={() => setCurrentModule(TrainingModule.DASHBOARD)} />;
      case TrainingModule.CHUNKING:
        return <ChunkingDrill onBack={() => setCurrentModule(TrainingModule.DASHBOARD)} />;
      case TrainingModule.PACING:
        return <VisualPacer onBack={() => setCurrentModule(TrainingModule.DASHBOARD)} />;
      case TrainingModule.WCPM:
        return <WCPMTest onBack={() => setCurrentModule(TrainingModule.DASHBOARD)} />;
      default:
        return <Dashboard onSelect={setCurrentModule} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentModule(TrainingModule.DASHBOARD)}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105">
              <BookOpen size={20} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">NeuroRead</h1>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Cognitive Training</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
            Beta v1.0
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8 pt-24 pb-20 animate-fade-in-up">
        {renderModule()}
      </main>

      <footer className="bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p className="flex items-center justify-center gap-2 mb-2">
            <BrainCircuit size={16} /> 基于认知心理学与神经科学构建
          </p>
          <p className="opacity-60">© 2024 NeuroRead Training System.</p>
        </div>
      </footer>
    </div>
  );
};

interface DashboardProps {
  onSelect: (module: TrainingModule) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);

  const modules = [
    {
      id: TrainingModule.SCHULTE,
      title: "视觉广度训练",
      subtitle: "Schulte Tables",
      desc: "拓展视幅范围，缩短眼球注视时间，提升周边视觉感知能力。",
      icon: <Grid3X3 className="text-white" size={28} />,
      bgGradient: "from-indigo-500 to-blue-500",
      stats: "3x3 - 7x7"
    },
    {
      id: TrainingModule.PACING,
      title: "视觉引导训练",
      subtitle: "Visual Pacer",
      desc: "利用物理引导线模拟手指指读，强迫眼球匀速移动，消除回读习惯。",
      icon: <ScanEye className="text-white" size={28} />,
      bgGradient: "from-emerald-500 to-teal-500",
      stats: "速度自适应"
    },
    {
      id: TrainingModule.RSVP,
      title: "消音读训练",
      subtitle: "RSVP Reading",
      desc: "极速呈现文本打破“语音回路”，强制进入纯视觉理解模式。",
      icon: <Zap className="text-white" size={28} />,
      bgGradient: "from-amber-500 to-orange-500",
      stats: "300-600 WPM"
    },
    {
      id: TrainingModule.CHUNKING,
      title: "意群视读",
      subtitle: "Chunking Drill",
      desc: "训练一次捕捉一个语义群（3-5个字），利用格式塔原理整体感知。",
      icon: <AlignLeft className="text-white" size={28} />,
      bgGradient: "from-blue-500 to-cyan-500",
      stats: "智能分词"
    },
    {
      id: TrainingModule.WCPM,
      title: "流畅度测评",
      subtitle: "Assessment",
      desc: "标准化阅读速度测试，记录WCPM数据并生成能力雷达图。",
      icon: <Timer className="text-white" size={28} />,
      bgGradient: "from-rose-500 to-pink-500",
      stats: "数据分析"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-3xl mx-auto py-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-200/30 blur-[100px] -z-10 rounded-full"></div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
          解锁大脑的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">阅读潜能</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          从“逐字解码”进化为“视觉捕获”。<br className="hidden sm:block"/>
          NeuroRead 是一套闭环的认知训练系统，专为提升信息处理带宽而生。
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => (
          <div 
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.bgGradient} opacity-10 rounded-bl-full transition-transform group-hover:scale-150`}></div>
            
            <div className="flex justify-between items-start mb-6 relative">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${m.bgGradient} shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300`}>
                {m.icon}
              </div>
              <div className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {m.stats}
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{m.title}</h3>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">{m.subtitle}</p>
              <p className="text-slate-600 text-sm leading-relaxed pt-2 h-[4.5em] overflow-hidden text-ellipsis">
                {m.desc}
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-bold text-indigo-600 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                进入训练 <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Training Plan Section */}
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-0 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <Calendar size={24} />
                    </div>
                    30天进阶训练计划
                </h3>
                <p className="text-slate-500 mt-2 ml-1">科学规划的认知负荷周期，循序渐进。</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {TRAINING_PLANS.map((plan, i) => (
            <div 
                key={i} 
                onClick={() => setSelectedPlanIndex(i)}
                className={`
                    relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1
                    ${i === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md'}
                `}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${i===0 ? 'bg-white/20 text-indigo-50' : 'bg-slate-200 text-slate-600'}`}>
                    {plan.week}
                </span>
                {i === 0 ? <Target size={18} className="text-indigo-200" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-indigo-400"></div>}
              </div>
              
              <h4 className={`text-lg font-bold mb-1 leading-tight ${i===0?'text-white':'text-slate-800'}`}>
                  {plan.title}
              </h4>
              <p className={`text-xs ${i===0?'text-indigo-100':'text-slate-500 group-hover:text-slate-600'}`}>
                  {plan.subtitle}
              </p>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className={i===0?'text-white':'text-indigo-600'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Plan Detail Modal */}
      {selectedPlanIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedPlanIndex(null)}></div>
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-violet-700 shrink-0 p-8 flex flex-col justify-end overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                    <button 
                        onClick={() => setSelectedPlanIndex(null)}
                        className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">
                            <Trophy size={16} /> {TRAINING_PLANS[selectedPlanIndex].week} 目标
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{TRAINING_PLANS[selectedPlanIndex].title}</h2>
                    </div>
                </div>
                
                {/* Modal Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="mb-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-slate-700 leading-relaxed text-sm md:text-base">
                        {TRAINING_PLANS[selectedPlanIndex].description}
                    </div>

                    <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
                        <CheckCircle2 size={22} className="text-emerald-500" />
                        每日训练组合清单
                    </h4>
                    
                    <div className="space-y-4">
                        {TRAINING_PLANS[selectedPlanIndex].tasks.map((task, idx) => (
                            <div key={idx} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-bold text-slate-800 text-lg">{task.name}</h5>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {task.duration}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-snug">{task.detail}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onSelect(task.moduleId)}
                                    className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                                >
                                    <PlayCircle size={18} /> 开始
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;