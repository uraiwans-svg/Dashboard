import React, { useState } from 'react';
import { DashboardStats, FeedbackEntry } from '../types';
import { EVALUATION_QUESTIONS } from '../utils/constants';
import { addFeedbackEntry, clearAllEntries, resetAllEntriesToDemo } from '../utils/feedbackStore';
import { 
  Users, 
  Award, 
  TrendingUp, 
  QrCode, 
  Download, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  RefreshCw, 
  Plus, 
  Trash2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats;
  entries: FeedbackEntry[];
  onOpenQRModal: () => void;
  onExportCSV: () => void;
  onNavigateToSurvey: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  entries,
  onOpenQRModal,
  onExportCSV,
  onNavigateToSurvey,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedQuestionTab, setSelectedQuestionTab] = useState<'all' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5'>('all');
  const [chartViewMode, setChartViewMode] = useState<'circular' | 'donut' | 'bar'>('circular');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleSimulateOne = () => {
    const randomChoices = [
      {
        r: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
        c: 'วิทยากรให้ตัวอย่างเข้าใจง่ายมาก สามารถเอาไปปรับใช้กับโปรเจกต์งานได้เลยครับ',
      },
      {
        r: { q1: 5, q2: 4, q3: 4, q4: 5, q5: 5 },
        c: 'บรรยากาศและเวลาการอบรมกระชับดีมาก มีประโยชน์ต่อสายงานสุดๆ',
      },
      {
        r: { q1: 4, q2: 5, q3: 5, q4: 4, q5: 4 },
        c: 'เอกสารและสื่อสไลด์ทำออกมาละเอียด ชัดเจนมาก ประทับใจค่ะ',
      },
      {
        r: { q1: 5, q2: 5, q3: 4, q4: 4, q5: 5 },
        c: 'อยากให้จัดคอร์สระดับ Advanced ต่อเนื่องอีกรุ่นเลยครับ',
      },
    ];

    const pick = randomChoices[Math.floor(Math.random() * randomChoices.length)];
    addFeedbackEntry(pick.r, pick.c);
  };

  const handleClearAll = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมดเพื่อเริ่มรอบการอบรมใหม่ใช่หรือไม่?')) {
      clearAllEntries();
    }
  };

  const handleResetToDemo = () => {
    resetAllEntriesToDemo();
  };

  // Color mapping for bars
  const barColors = [
    'from-indigo-500 to-indigo-600',
    'from-blue-500 to-blue-600',
    'from-sky-500 to-sky-600',
    'from-teal-500 to-teal-600',
    'from-emerald-500 to-emerald-600',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Top Banner & Projector Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>แดชบอร์ดแสดงผลสด</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              อัปเดตอัตโนมัติ Real-time
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            ผลการประเมินความพึงพอใจการอบรม
          </h1>
        </div>

        {/* Action Controls for Workshop Presenter */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleSimulateOne}
            title="จำลองคนตอบเพิ่ม 1 คนเพื่อทดสอบการอัปเดตสดบนจอ"
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-500" />
            <span>+ จำลองคนตอบ 1 คน</span>
          </button>

          <button
            onClick={onOpenQRModal}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-500" />
            <span>QR Code ขึ้นจอ</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>เต็มจอโปรเจกเตอร์</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Overall Average Rating */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            คะแนนเฉลี่ยรวม (Overall Score)
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.overallAverage > 0 ? stats.overallAverage.toFixed(2) : '0.00'}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">/ 5.00</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${stats.overallInterpretation.bgBadge}`}>
              {stats.overallInterpretation.level}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {stats.overallInterpretation.description}
            </span>
          </div>
        </div>

        {/* KPI 2: Total Respondents */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>จำนวนผู้ตอบแบบประเมิน</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.totalCount}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">คน</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>สถานะเซิร์ฟเวอร์:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">พร้อมรับข้อมูลสด</span>
          </div>
        </div>

        {/* KPI 3: Highest Rated Aspect */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>ด้านที่คะแนนสูงสุด</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {stats.highestQuestion ? stats.highestQuestion.shortLabel : 'รอข้อมูล'}
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {stats.highestQuestion ? stats.highestQuestion.average.toFixed(2) : '-'}
              </span>
              <span className="text-xs text-slate-400">/ 5.00</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {stats.highestQuestion ? stats.highestQuestion.interpretation : ''}
          </div>
        </div>

        {/* KPI 4: High Satisfaction Rate (4-5 stars) */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>อัตราความพึงพอใจระดับดี-ดีเยี่ยม</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            {(() => {
              const highStarsCount = (stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0);
              const totalRatingVotes = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);
              const pct = totalRatingVotes > 0 ? Math.round((highStarsCount / totalRatingVotes) * 100) : 0;
              return (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">
                    {pct}%
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">คะแนน 4-5 ดาว</span>
                </div>
              );
            })()}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            เทียบจากคะแนนคำตอบทุกข้อย่อย
          </div>
        </div>

      </div>

      {/* Main Grid: Bar Chart Breakdown & Live Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Circular Charts & Distribution (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    คะแนนเฉลี่ยรายข้อ (สเกล 1 - 5)
                  </h2>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                    กราฟวงกลม
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  เกณฑ์การประเมิน: 4.51–5.00 มากที่สุด · 3.51–4.50 มาก · 2.51–3.50 ปานกลาง
                </p>
              </div>

              {/* View Mode & Question Filter */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Chart Style Switcher */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                  <button
                    onClick={() => setChartViewMode('circular')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      chartViewMode === 'circular'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ◎ วงกลมรายข้อ
                  </button>
                  <button
                    onClick={() => setChartViewMode('donut')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      chartViewMode === 'donut'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ◉ โดนัทภาพรวม
                  </button>
                  <button
                    onClick={() => setChartViewMode('bar')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      chartViewMode === 'bar'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ▤ แท่งเดิม
                  </button>
                </div>

                {/* Filter Question Tab */}
                <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                  <button
                    onClick={() => setSelectedQuestionTab('all')}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedQuestionTab === 'all'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  {EVALUATION_QUESTIONS.map(q => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionTab(q.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        selectedQuestionTab === q.id
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      ข้อ {q.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Defs for Gradients */}
            <svg width="0" height="0" className="hidden">
              <defs>
                <linearGradient id="circleGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="circleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="circleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="circleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="circleGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>

            {/* VIEW 1: Circular Progress Gauges (Default) */}
            {chartViewMode === 'circular' && (
              <div className="space-y-3.5">
                {stats.questionSummaries
                  .filter(q => selectedQuestionTab === 'all' || q.id === selectedQuestionTab)
                  .map((q, idx) => {
                    const percentage = Math.min(100, Math.max(0, (q.average / 5) * 100));
                    // Circle math
                    const size = 80;
                    const strokeWidth = 7;
                    const radius = (size - strokeWidth) / 2;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (percentage / 100) * circumference;

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 transition-all hover:border-indigo-300 dark:hover:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Left Info */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                                {q.title}
                              </h3>
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {q.interpretation}
                              </span>
                            </div>

                            {/* Stars distribution pills */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                              <span className="text-slate-400 font-sans">ผลโหวต:</span>
                              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">1★: {q.distribution[1]}</span>
                              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">2★: {q.distribution[2]}</span>
                              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">3★: {q.distribution[3]}</span>
                              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold">4★: {q.distribution[4]}</span>
                              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-semibold">5★: {q.distribution[5]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Circular Gauge */}
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
                            <svg width={size} height={size} className="-rotate-90">
                              {/* Background track */}
                              <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                className="stroke-slate-200 dark:stroke-slate-800"
                                strokeWidth={strokeWidth}
                                fill="none"
                              />
                              {/* Animated progress ring */}
                              <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={`url(#circleGrad${idx % 5})`}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="none"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            {/* Center Score Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <span className="text-base font-extrabold font-mono tabular-nums leading-tight text-slate-900 dark:text-white">
                                {q.average.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">
                                / 5.00
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                              {percentage.toFixed(0)}%
                            </div>
                            <div className="text-[10px] text-slate-400">
                              คะแนนเต็ม 100
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>
            )}

            {/* VIEW 2: Donut Overview Chart */}
            {chartViewMode === 'donut' && (
              <div className="bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
                <div className="text-center mb-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    กราฟวงกลมโดนัท: สัดส่วนการให้คะแนนดาวทั้งหมด
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    จำแนกตามจำนวนดาว 1 ถึง 5 ดาว จากผู้ตอบทั้งหมด {stats.totalCount} คน
                  </p>
                </div>

                {(() => {
                  const dist = stats.ratingDistribution;
                  const totalVotes = Object.values(dist).reduce((a, b) => a + b, 0);

                  if (totalVotes === 0) {
                    return (
                      <div className="py-12 text-center text-xs text-slate-400">
                        ยังไม่มีข้อมูลการตอบแบบสอบถาม
                      </div>
                    );
                  }

                  const slices = [
                    { label: '5 ดาว (มากที่สุด)', count: dist[5], color: '#10b981', textColor: 'text-emerald-500' },
                    { label: '4 ดาว (มาก)', count: dist[4], color: '#3b82f6', textColor: 'text-blue-500' },
                    { label: '3 ดาว (ปานกลาง)', count: dist[3], color: '#f59e0b', textColor: 'text-amber-500' },
                    { label: '2 ดาว (น้อย)', count: dist[2], color: '#f97316', textColor: 'text-orange-500' },
                    { label: '1 ดาว (น้อยที่สุด)', count: dist[1], color: '#ef4444', textColor: 'text-rose-500' },
                  ];

                  // SVG Donut calculation
                  const donutRadius = 58;
                  const donutCircumference = 2 * Math.PI * donutRadius;
                  let cumulativePct = 0;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                      {/* SVG Donut */}
                      <div className="flex justify-center">
                        <div className="relative" style={{ width: 170, height: 170 }}>
                          <svg width={170} height={170} viewBox="0 0 170 170" className="-rotate-90">
                            {slices.map((slice, i) => {
                              const pct = (slice.count / totalVotes) * 100;
                              const strokeLength = (pct / 100) * donutCircumference;
                              const offset = -(cumulativePct / 100) * donutCircumference;
                              cumulativePct += pct;

                              if (slice.count === 0) return null;

                              return (
                                <circle
                                  key={i}
                                  cx={85}
                                  cy={85}
                                  r={donutRadius}
                                  fill="none"
                                  stroke={slice.color}
                                  strokeWidth={20}
                                  strokeDasharray={`${strokeLength} ${donutCircumference}`}
                                  strokeDashoffset={offset}
                                  className="transition-all duration-700"
                                />
                              );
                            })}
                          </svg>
                          {/* Donut Center */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums leading-tight">
                              {stats.overallAverage.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              คะแนนรวม
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Legend List */}
                      <div className="space-y-2 text-xs">
                        {slices.map((s, i) => {
                          const pct = totalVotes > 0 ? ((s.count / totalVotes) * 100).toFixed(1) : '0';
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                <span className="font-medium text-slate-800 dark:text-slate-200">{s.label}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-slate-500">{s.count} โหวต</span>
                                <span className={`font-bold ${s.textColor}`}>({pct}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* VIEW 3: Horizontal Bars (Fallback option) */}
            {chartViewMode === 'bar' && (
              <div className="space-y-3.5">
                {stats.questionSummaries
                  .filter(q => selectedQuestionTab === 'all' || q.id === selectedQuestionTab)
                  .map((q, idx) => {
                    const percentage = (q.average / 5) * 100;
                    return (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 transition hover:border-slate-300 dark:hover:border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {q.title}
                            </span>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-2">
                            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                              {q.average.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400">/ 5.00</span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {q.interpretation}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full bg-gradient-to-r ${barColors[idx % barColors.length]} transition-all duration-700 ease-out`}
                            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

          </div>

          {/* Quick Explanation Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <span>คำนวณตามเกณฑ์แบบสอบถามความพึงพอใจของ สกอ. / มาตรฐานการประเมิน 5 ระดับ</span>
            <button
              onClick={onNavigateToSurvey}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>เปิดหน้าตอบเพื่อทดสอบ</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Comments Stream Feed */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>ข้อเสนอแนะล่าสุด</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ความคิดเห็นสดจากผู้เข้าอบรม
              </p>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {stats.recentComments.length} ความเห็น
            </span>
          </div>

          {/* Scrollable Comments List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {stats.recentComments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageSquare className="w-8 h-8 stroke-1 mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">ยังไม่มีผู้พิมพ์ข้อเสนอแนะ</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  เมื่อผู้ตอบพิมพ์ช่องข้อเสนอแนะ จะปรากฏบนฟีดนี้ทันที
                </p>
              </div>
            ) : (
              stats.recentComments.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>เวลา {item.submittedAt || 'ล่าสุด'}</span>
                    <span className="font-mono text-amber-500 dark:text-amber-400 font-semibold">
                      ★ {item.averageScore.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                    {item.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Feed Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-3 text-center">
            <button
              onClick={onExportCSV}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              ดาวน์โหลดความคิดเห็นทั้งหมดเป็นไฟล์ CSV ➔
            </button>
          </div>
        </div>

      </div>

      {/* Workshop Presenter Maintenance Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-800 dark:text-slate-200">เครื่องมือผู้จัดอบรม:</span>
          <span>ซิงค์อัตโนมัติผ่าน BroadcastChannel ในเบราว์เซอร์ และรองรับ Realtime Database</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDemo}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>โหลดชุดข้อมูลตัวอย่าง (Demo Data)</span>
          </button>
          <span>·</span>
          <button
            onClick={handleClearAll}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 underline cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างข้อมูลทั้งหมดเพื่อเริ่มรอบใหม่</span>
          </button>
        </div>
      </div>

    </div>
  );
};
