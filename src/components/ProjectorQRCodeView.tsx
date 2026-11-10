import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ExternalLink, Download, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProjectorQRCodeViewProps {
  onBackToDashboard?: () => void;
}

export const ProjectorQRCodeView: React.FC<ProjectorQRCodeViewProps> = () => {
  const [copied, setCopied] = useState(false);
  const [trainingTitle, setTrainingTitle] = useState('การอบรมเชิงปฏิบัติการ Upskilling Workshop');
  const [speakerName, setSpeakerName] = useState('วิทยากรผู้เชี่ยวชาญ');
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine current survey URL
  const getSurveyUrl = () => {
    if (typeof window === 'undefined') return 'https://example.com/survey.html';
    const loc = window.location;
    // URL pointing directly to survey view
    return `${loc.origin}${loc.pathname}#survey`;
  };

  const surveyUrl = getSurveyUrl();

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        surveyUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        error => {
          if (error) console.error('QR code error', error);
        }
      );
    }
  }, [surveyUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'training_survey_qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Settings Toggle Bar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showSettings ? 'ซ่อนการตั้งค่าหัวข้อ' : 'ปรับเปลี่ยนชื่อหัวข้ออบรม / วิทยากร'}</span>
        </button>
      </div>

      {/* Optional In-Place Settings */}
      {showSettings && (
        <div className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ชื่อหลักสูตรการอบรม:
            </label>
            <input
              type="text"
              value={trainingTitle}
              onChange={e => setTrainingTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ชื่อวิทยากร / หน่วยงาน:
            </label>
            <input
              type="text"
              value={speakerName}
              onChange={e => setSpeakerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Main Projector Stage Card */}
      <div className="bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 sm:p-12 text-center shadow-lg relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ขอความร่วมมือประเมินผลการอบรม</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-tight">
          {trainingTitle}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
          {speakerName} · สแกน QR Code ด้านล่างนี้เพื่อตอบแบบประเมิน
        </p>

        {/* Big Crisp QR Code */}
        <div className="mt-8 mb-6 inline-block bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <canvas ref={canvasRef} className="w-56 h-56 sm:w-72 sm:h-72 mx-auto" />
          <p className="text-xs text-slate-400 font-medium mt-3">
            สแกนด้วยกล้องมือถือ หรือแอป LINE
          </p>
        </div>

        {/* Link and Action Row */}
        <div className="max-w-lg mx-auto bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2 text-xs">
          <div className="truncate text-left text-slate-600 dark:text-slate-300 font-mono select-all">
            {surveyUrl}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>

            <button
              onClick={handleDownloadQR}
              title="ดาวน์โหลดรูปภาพ QR Code"
              className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Helper Note */}
        <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          ตอบง่าย ใช้เวลาเพียง 1 นาที · ระบบไม่เก็บชื่อผู้ตอบ · ผลจะแสดงบนจอทันที
        </div>

      </div>

    </div>
  );
};
