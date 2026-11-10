import { QuestionDef } from '../types';

export const EVALUATION_QUESTIONS: QuestionDef[] = [
  {
    id: 'q1',
    number: 1,
    title: 'ความชัดเจนและประโยชน์ของเนื้อหา',
    shortLabel: 'เนื้อหาหลักสูตร',
    desc: 'เนื้อหาการอบรมมีความชัดเจน ตรงตามวัตถุประสงค์ และตอบโจทย์การนำไปพัฒนาทักษะ',
  },
  {
    id: 'q2',
    number: 2,
    title: 'ความเชี่ยวชาญและการถ่ายทอดของวิทยากร',
    shortLabel: 'วิทยากรและการบรรยาย',
    desc: 'วิทยากรมีความเชี่ยวชาญ ถ่ายทอดเข้าใจง่าย มีปฏิสัมพันธ์และตอบข้อซักถามได้ชัดเจน',
  },
  {
    id: 'q3',
    number: 3,
    title: 'สื่อ เอกสารประกอบ และกิจกรรม Workshop',
    shortLabel: 'สื่อและกิจกรรม Workshop',
    desc: 'สไลด์ เอกสาร ตัวอย่างโค้ด/กรณีศึกษา และกิจกรรมฝึกปฏิบัติมีความเหมาะสมและน่าสนใจ',
  },
  {
    id: 'q4',
    number: 4,
    title: 'ความเหมาะสมของสถานที่/ระบบ และเวลา',
    shortLabel: 'ระบบ/สถานที่และเวลา',
    desc: 'สถานที่หรือระบบการเรียนการสอนมีความเสถียร สะดวก และการบริหารเวลามีความเหมาะสม',
  },
  {
    id: 'q5',
    number: 5,
    title: 'การนำความรู้ไปประยุกต์ใช้ในการปฏิบัติงานจริง',
    shortLabel: 'การนำไปประยุกต์ใช้',
    desc: 'สามารถนำความรู้ เทคนิค และแนวทางปฏิบัติไปปรับใช้ในการทำงานหรือโปรเจกต์ได้จริง',
  },
];

export const RATING_OPTIONS = [
  { value: 1, label: 'น้อยที่สุด', emoji: '😞', desc: 'ต้องปรับปรุงอย่างยิ่ง' },
  { value: 2, label: 'น้อย', emoji: '🙁', desc: 'ควรพัฒนาเพิ่มเติม' },
  { value: 3, label: 'ปานกลาง', emoji: '😐', desc: 'พอใช้ตามเกณฑ์' },
  { value: 4, label: 'มาก', emoji: '🙂', desc: 'ดี น่าพึงพอใจ' },
  { value: 5, label: 'มากที่สุด', emoji: '🤩', desc: 'ยอดเยี่ยม ประทับใจมาก' },
];

/**
 * Standard 5-level Likert scale interpretation for Thai educational & corporate training:
 * 4.51 - 5.00: มากที่สุด (มากที่สุด / Excellent)
 * 3.51 - 4.50: มาก (ดี / Good)
 * 2.51 - 3.50: ปานกลาง (ปานกลาง / Moderate)
 * 1.51 - 2.50: น้อย (น้อย / Fair)
 * 1.00 - 1.50: น้อยที่สุด (น้อยที่สุด / Needs Improvement)
 */
export function getRatingInterpretation(score: number): {
  level: string;
  description: string;
  color: string;
  bgBadge: string;
} {
  if (score >= 4.51) {
    return {
      level: 'มากที่สุด',
      description: 'ระดับดีเยี่ยม (Excellent Performance)',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgBadge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    };
  } else if (score >= 3.51) {
    return {
      level: 'มาก',
      description: 'ระดับดี (Good Performance)',
      color: 'text-blue-600 dark:text-blue-400',
      bgBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    };
  } else if (score >= 2.51) {
    return {
      level: 'ปานกลาง',
      description: 'ระดับปานกลาง (Satisfactory)',
      color: 'text-amber-600 dark:text-amber-400',
      bgBadge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    };
  } else if (score >= 1.51) {
    return {
      level: 'น้อย',
      description: 'ระดับควรปรับปรุง (Fair / Needs Work)',
      color: 'text-orange-600 dark:text-orange-400',
      bgBadge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    };
  } else {
    return {
      level: 'น้อยที่สุด',
      description: 'ระดับควรปรับปรุงเร่งด่วน (Urgent Improvement Required)',
      color: 'text-rose-600 dark:text-rose-400',
      bgBadge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    };
  }
}

export const INITIAL_DEMO_FEEDBACKS = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 1000 * 60 * 42,
    submittedAt: new Date(Date.now() - 1000 * 60 * 42).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    overallScore: 4.8,
    comment: 'วิทยากรอธิบายเข้าใจง่ายมาก มีตัวอย่างจริงให้ลองทำตาม ได้ไอเดียนำไปปรับใช้กับงานทันทีครับ',
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 1000 * 60 * 35,
    submittedAt: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    overallScore: 4.8,
    comment: 'เวิร์กช็อปสนุกและกระชับดีมาก อยากให้จัดหลักสูตรระดับ Advance ต่อเนื่องอีกรุ่นค่ะ',
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 1000 * 60 * 28,
    submittedAt: new Date(Date.now() - 1000 * 60 * 28).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 4, q2: 5, q3: 5, q4: 4, q5: 4 },
    overallScore: 4.4,
    comment: 'เอกสารประกอบและสไลด์สวยงามเข้าใจง่าย ถ้ามีเวลาทำแล็บเพิ่มอีกนิดจะสมบูรณ์แบบมาก',
  },
  {
    id: 'demo-4',
    timestamp: Date.now() - 1000 * 60 * 19,
    submittedAt: new Date(Date.now() - 1000 * 60 * 19).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 4, q3: 4, q4: 5, q5: 5 },
    overallScore: 4.6,
    comment: 'บรรยากาศเป็นกันเอง สถานที่และอาหารว่างจัดเตรียมดีมาก ขอบคุณทีมงานและวิทยากรครับ',
  },
  {
    id: 'demo-5',
    timestamp: Date.now() - 1000 * 60 * 12,
    submittedAt: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 4 },
    overallScore: 4.6,
    comment: 'ได้เทคนิคที่ใช้งานได้จริง ตอบโจทย์การทำงานในยุคปัจจุบันมากครับ แนะนำเพื่อนร่วมงานแน่นอน',
  },
  {
    id: 'demo-6',
    timestamp: Date.now() - 1000 * 60 * 5,
    submittedAt: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 4, q2: 5, q3: 4, q4: 5, q5: 5 },
    overallScore: 4.6,
    comment: 'ตอบคำถามผู้เข้าอบรมได้เคลียร์ทุกประเด็นเลยค่ะ ประทับใจมาก',
  },
];
