import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, X, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProjectorQR: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  onNavigateToProjectorQR,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const getSurveyUrl = () => {
    if (typeof window === 'undefined') return 'https://example.com/survey.html';
    const loc = window.location;
    return `${loc.origin}${loc.pathname}#survey`;
  };

  const surveyUrl = getSurveyUrl();

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        surveyUrl,
        {
          width: 240,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        err => {
          if (err) console.error(err);
        }
      );
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center relative shadow-2xl animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          สแกนตอบแบบประเมิน
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
          เปิดกล้องบนมือถือสแกนเพื่อเริ่มทำแบบประเมิน
        </p>

        {/* QR Canvas */}
        <div className="bg-white p-3 rounded-2xl inline-block mx-auto mb-4 border border-slate-100 shadow-xs">
          <canvas ref={canvasRef} className="w-52 h-52 mx-auto" />
        </div>

        {/* Link and Copy */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs gap-2 mb-4">
          <span className="truncate text-slate-600 dark:text-slate-300 font-mono text-[11px]">
            {surveyUrl}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shrink-0 cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'คัดลอก' : 'คัดลอก'}</span>
          </button>
        </div>

        {/* Fullscreen Stage Link */}
        <button
          onClick={() => {
            onClose();
            onNavigateToProjectorQR();
          }}
          className="w-full py-2.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition cursor-pointer"
        >
          เปิดโหมด QR Code เต็มจอโปรเจกเตอร์ ➔
        </button>

      </div>
    </div>
  );
};
