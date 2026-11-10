import React, { useState, useEffect } from 'react';
import { FeedbackRating } from '../types';
import { EVALUATION_QUESTIONS, RATING_OPTIONS } from '../utils/constants';
import { addFeedbackEntry, clearDeviceSubmissionStatus, getDeviceSubmissionStatus } from '../utils/feedbackStore';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, Send, Star, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

interface SurveyViewProps {
  onSubmittedSuccess?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmittedSuccess }) => {
  const [ratings, setRatings] = useState<FeedbackRating>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
  });
  const [comment, setComment] = useState('');
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<{
    hasSubmitted: boolean;
    data?: {
      submittedAt: string;
      overallScore: number;
      comment: string;
    };
  }>({ hasSubmitted: false });

  useEffect(() => {
    const status = getDeviceSubmissionStatus();
    setSubmissionState(status);
  }, []);

  const handleRatingSelect = (questionId: keyof FeedbackRating, score: number) => {
    setRatings(prev => ({
      ...prev,
      [questionId]: score,
    }));
    setShowValidationWarning(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check all questions answered
    if (!ratings.q1 || !ratings.q2 || !ratings.q3 || !ratings.q4 || !ratings.q5) {
      setShowValidationWarning(true);
      // scroll to warning
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      addFeedbackEntry(ratings, comment);

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Update local state
      const status = getDeviceSubmissionStatus();
      setSubmissionState(status);

      if (onSubmittedSuccess) {
        onSubmittedSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    clearDeviceSubmissionStatus();
    setRatings({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setComment('');
    setSubmissionState({ hasSubmitted: false });
  };

  // If already submitted on this device
  if (submissionState.hasSubmitted) {
    const score = submissionState.data?.overallScore || 5.0;
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            บันทึกแบบประเมินเรียบร้อยแล้ว
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            ขอขอบพระคุณที่สละเวลาให้ความคิดเห็นเพื่อนำไปปรับปรุงและพัฒนาหลักสูตรการอบรมในรุ่นถัดไปครับ
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 text-left border border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span>สถานะ:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ส่งขึ้นจอ Dashboard แล้ว
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span>คะแนนเฉลี่ยที่ท่านให้:</span>
              <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                {score.toFixed(2)} / 5.00
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetForTesting}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>[โหมดทดสอบ] ล้างสถานะเพื่อทดลองส่งใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-8">
      
      {/* Header Banner */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>แบบประเมินผู้เข้าร่วมการอบรม</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          แบบประเมินความพึงพอใจการอบรม
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          กรุณาให้คะแนนความพึงพอใจในแต่ละด้าน (สเกล 1-5 ดาว) ข้อมูลของท่านจะถูกส่งไปประมวลผลทันทีโดยไม่บันทึกชื่อ
        </p>
      </div>

      {/* Validation Banner */}
      {showValidationWarning && (
        <div className="mb-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-shake">
          <span>กรุณาให้คะแนนให้ครบทั้ง 5 ข้อก่อนกดส่งแบบประเมินครับ</span>
          <button
            onClick={() => setShowValidationWarning(false)}
            className="text-rose-500 hover:text-rose-700 ml-2 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Survey Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {EVALUATION_QUESTIONS.map(q => {
          const currentScore = ratings[q.id];
          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-slate-800/90 border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                currentScore > 0
                  ? 'border-indigo-200 dark:border-indigo-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Label */}
              <div className="flex items-start gap-3 mb-3.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {q.number}
                </span>
                <div className="flex-1">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {q.desc}
                  </p>
                </div>
              </div>

              {/* 5-Level Button Grid (Thumb-friendly mobile touch size: 48px min) */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {RATING_OPTIONS.map(opt => {
                  const isSelected = currentScore === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleRatingSelect(q.id, opt.value)}
                      className={`h-12 sm:h-14 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs font-bold scale-[1.02]'
                          : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-base sm:text-lg leading-none font-bold">
                        {opt.value}
                      </span>
                      <span className="text-[10px] mt-0.5 opacity-90 truncate max-w-full px-0.5">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Range Helper Text */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 mt-2 px-1">
                <span>1 = น้อยที่สุด</span>
                {currentScore > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    เลือก: {RATING_OPTIONS.find(o => o.value === currentScore)?.label} ({currentScore} ดาว)
                  </span>
                )}
                <span>5 = มากที่สุด</span>
              </div>
            </div>
          );
        })}

        {/* Constructive Comments Box */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <label
            htmlFor="comment"
            className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-1"
          >
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>ข้อเสนอแนะเพิ่มเติม</span>
            <span className="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            สิ่งที่ท่านประทับใจ หรือข้อคิดเห็นเพื่อการพัฒนาหลักสูตรในอนาคต
          </p>
          <textarea
            id="comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="พิมพ์ความคิดเห็นของท่านที่นี่ (จะแสดงบนหน้าจอ Dashboard สรุปผล)..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none transition"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 pb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>ส่งแบบประเมินความพึงพอใจ</span>
          </button>
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
            ระบบจะอัปเดตผลขึ้นจอ Dashboard ของผู้จัดอบรมทันทีแบบเรียลไทม์
          </p>
        </div>
      </form>

    </div>
  );
};
