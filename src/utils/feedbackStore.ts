import { DashboardStats, FeedbackEntry, FeedbackRating, QuestionSummary } from '../types';
import { EVALUATION_QUESTIONS, INITIAL_DEMO_FEEDBACKS, getRatingInterpretation } from './constants';

const STORAGE_KEY = 'training_feedback_entries_v1';
const SUBMISSION_FLAG_KEY = 'training_feedback_submitted_device_v1';
const FIREBASE_CONFIG_KEY = 'training_feedback_firebase_config_v1';

// BroadcastChannel for instantaneous real-time sync across browser tabs/windows
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('training_feedback_channel');
  }
} catch {
  syncChannel = null;
}

export function getStoredEntries(): FeedbackEntry[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_FEEDBACKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial realistic demo data so the dashboard displays immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_FEEDBACKS));
      return INITIAL_DEMO_FEEDBACKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_FEEDBACKS;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return INITIAL_DEMO_FEEDBACKS;
  }
}

export function saveEntries(entries: FeedbackEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    // Broadcast to other tabs immediately
    if (syncChannel) {
      syncChannel.postMessage({ type: 'ENTRIES_UPDATED', timestamp: Date.now() });
    }
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
}

export function addFeedbackEntry(
  ratings: FeedbackRating,
  comment?: string,
  deviceFingerprint?: string
): FeedbackEntry {
  const current = getStoredEntries();
  const overall = Number(
    ((ratings.q1 + ratings.q2 + ratings.q3 + ratings.q4 + ratings.q5) / 5).toFixed(2)
  );

  const now = new Date();
  const formattedTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  const newEntry: FeedbackEntry = {
    id: 'fb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now(),
    submittedAt: formattedTime,
    ratings,
    overallScore: overall,
    comment: comment ? comment.trim() : undefined,
    deviceFingerprint,
  };

  const updated = [newEntry, ...current];
  saveEntries(updated);

  // Mark this device as submitted in localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SUBMISSION_FLAG_KEY, JSON.stringify({
        submitted: true,
        submittedAt: now.toISOString(),
        ratings,
        overallScore: overall,
        comment: comment || '',
      }));
    } catch {
      // ignore
    }
  }

  // Play subtle celebratory chime if enabled
  playSuccessSound();

  return newEntry;
}

export function getDeviceSubmissionStatus(): {
  hasSubmitted: boolean;
  data?: {
    submittedAt: string;
    ratings: FeedbackRating;
    overallScore: number;
    comment: string;
  };
} {
  if (typeof window === 'undefined') return { hasSubmitted: false };
  try {
    const raw = localStorage.getItem(SUBMISSION_FLAG_KEY);
    if (!raw) return { hasSubmitted: false };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.submitted) {
      return { hasSubmitted: true, data: parsed };
    }
  } catch {
    // fallback
  }
  return { hasSubmitted: false };
}

export function clearDeviceSubmissionStatus(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SUBMISSION_FLAG_KEY);
  } catch {
    // ignore
  }
}

export function resetAllEntriesToDemo(): void {
  saveEntries(INITIAL_DEMO_FEEDBACKS);
}

export function clearAllEntries(): void {
  saveEntries([]);
}

/**
 * Web Audio API gentle notification chime (no external asset needed)
 */
export function playSuccessSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Smooth chime chord
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playTone(523.25, 0, 0.35);    // C5
    playTone(659.25, 0.08, 0.4);  // E5
    playTone(783.99, 0.16, 0.5);  // G5
    playTone(1046.50, 0.24, 0.6); // C6
  } catch {
    // AudioContext might be blocked until user gesture, safely ignore
  }
}

/**
 * Compute real-time dashboard analytics
 */
export function calculateDashboardStats(entries: FeedbackEntry[]): DashboardStats {
  const totalCount = entries.length;

  if (totalCount === 0) {
    const emptySummaries: QuestionSummary[] = EVALUATION_QUESTIONS.map(q => ({
      id: q.id,
      title: q.title,
      shortLabel: q.shortLabel,
      average: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      interpretation: 'ยังไม่มีข้อมูล',
    }));

    return {
      totalCount: 0,
      overallAverage: 0,
      overallInterpretation: {
        level: 'รอข้อมูลตอบกลับ',
        description: 'ยังไม่มีผู้เข้าร่วมตอบแบบประเมิน',
        color: 'text-slate-400',
        bgBadge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      },
      highestQuestion: null,
      lowestQuestion: null,
      questionSummaries: emptySummaries,
      recentComments: [],
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  // Calculate overall average
  const totalScoreSum = entries.reduce((acc, curr) => acc + curr.overallScore, 0);
  const overallAverage = Number((totalScoreSum / totalCount).toFixed(2));
  const overallInterpretation = getRatingInterpretation(overallAverage);

  // Overall rating distribution
  const globalDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Calculate per-question summary
  const questionSummaries: QuestionSummary[] = EVALUATION_QUESTIONS.map(q => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let qSum = 0;

    entries.forEach(entry => {
      const val = entry.ratings[q.id] || 3;
      if (val >= 1 && val <= 5) {
        dist[val as 1 | 2 | 3 | 4 | 5]++;
        globalDist[val as 1 | 2 | 3 | 4 | 5]++;
      }
      qSum += val;
    });

    const avg = Number((qSum / totalCount).toFixed(2));
    const interp = getRatingInterpretation(avg).level;

    return {
      id: q.id,
      title: q.title,
      shortLabel: q.shortLabel,
      average: avg,
      distribution: dist,
      interpretation: interp,
    };
  });

  // Highest and lowest rated questions
  const sortedByAvg = [...questionSummaries].sort((a, b) => b.average - a.average);
  const highestQuestion = sortedByAvg[0] || null;
  const lowestQuestion = sortedByAvg[sortedByAvg.length - 1] || null;

  // Comments feed (newest first)
  const recentComments = entries
    .filter(e => e.comment && e.comment.trim().length > 0)
    .map(e => ({
      id: e.id,
      comment: e.comment || '',
      timestamp: e.timestamp,
      submittedAt: e.submittedAt,
      averageScore: e.overallScore,
    }))
    .slice(0, 15);

  return {
    totalCount,
    overallAverage,
    overallInterpretation,
    highestQuestion,
    lowestQuestion,
    questionSummaries,
    recentComments,
    ratingDistribution: globalDist,
  };
}

/**
 * Export all entries to UTF-8 BOM CSV formatted specifically for Thai Excel/Google Sheets
 */
export function exportFeedbackToCSV(entries: FeedbackEntry[]): void {
  if (entries.length === 0) {
    alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
    return;
  }

  const headers = [
    'ลำดับ',
    'รหัสการตอบ',
    'วันเวลาที่ส่ง',
    'ข้อ 1 (เนื้อหา)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (สื่อและกิจกรรม)',
    'ข้อ 4 (สถานที่และเวลา)',
    'ข้อ 5 (การนำไปใช้)',
    'คะแนนเฉลี่ยรวม',
    'ระดับการประเมิน',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = entries.map((entry, index) => {
    const interp = getRatingInterpretation(entry.overallScore).level;
    const dateStr = new Date(entry.timestamp).toLocaleString('th-TH');
    return [
      escapeCSV(index + 1),
      escapeCSV(entry.id),
      escapeCSV(dateStr),
      escapeCSV(entry.ratings.q1),
      escapeCSV(entry.ratings.q2),
      escapeCSV(entry.ratings.q3),
      escapeCSV(entry.ratings.q4),
      escapeCSV(entry.ratings.q5),
      escapeCSV(entry.overallScore.toFixed(2)),
      escapeCSV(interp),
      escapeCSV(entry.comment || ''),
    ].join(',');
  });

  // UTF-8 BOM character: \uFEFF ensures Thai characters render properly in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const dateTag = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `training_feedback_results_${dateTag}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Subscribe to cross-tab updates
 */
export function subscribeToFeedbackUpdates(callback: () => void): () => void {
  if (!syncChannel) {
    const storageListener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    };
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }

  const handler = (e: MessageEvent) => {
    if (e.data && e.data.type === 'ENTRIES_UPDATED') {
      callback();
    }
  };

  syncChannel.addEventListener('message', handler);
  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handler);
    }
  };
}

export function getCustomFirebaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(FIREBASE_CONFIG_KEY) || '';
}

export function setCustomFirebaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FIREBASE_CONFIG_KEY, url.trim());
}
