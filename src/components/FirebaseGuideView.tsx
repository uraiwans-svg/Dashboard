import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Copy, 
  Download, 
  ExternalLink, 
  FileCode, 
  Flame, 
  Globe, 
  Layers, 
  ShieldAlert, 
  Check, 
  Sparkles 
} from 'lucide-react';

export const FirebaseGuideView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'survey' | 'dashboard' | 'rules'>('survey');
  const [copiedCode, setCopiedCode] = useState(false);
  const [userDbUrl, setUserDbUrl] = useState('');

  const surveyCodeTemplate = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
  <!-- Firebase App & Realtime Database SDK (Compat v10) -->
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen antialiased flex flex-col justify-between">
  <!-- Header -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">TF</div>
        <div>
          <h1 class="text-base font-bold text-slate-900 leading-tight">แบบประเมินความพึงพอใจ</h1>
          <p class="text-xs text-slate-500">การอบรมเชิงปฏิบัติการ (ไม่ต้องระบุชื่อ)</p>
        </div>
      </div>
      <div class="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">5 ข้อสเกล 1-5</div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-xl mx-auto w-full px-4 py-5 flex-1">
    <div id="alreadySubmittedView" class="hidden bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs my-6">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">ท่านได้ส่งแบบประเมินแล้ว</h2>
      <p class="text-sm text-slate-600 mb-6">ระบบบันทึกความคิดเห็นของท่านเรียบร้อยแล้ว ขอขอบพระคุณครับ</p>
      <button onclick="resetSubmissionForTesting()" class="text-xs text-slate-600 hover:text-indigo-600 underline">[โหมดทดสอบ] ส่งใหม่อีกครั้ง</button>
    </div>

    <form id="surveyForm" class="space-y-6">
      <!-- Question 1 ถึง 5 และช่องข้อเสนอแนะ -->
      <div class="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-950">
        กรุณาให้คะแนน 1 ถึง 5 ดาว โดย (1 = น้อยที่สุด, 5 = มากที่สุด) ข้อมูลจะส่งขึ้นจอทันที
      </div>
      <!-- กรุณาดูโค้ดตัวเต็มใน survey.html -->
    </form>
  </main>

  <script>
    // -----------------------------------------------------------------
    // วาง Firebase Realtime Database URL ของท่านที่นี่:
    // -----------------------------------------------------------------
    const firebaseConfig = {
      databaseURL: "${userDbUrl || 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com'}"
    };
    if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes("YOUR_PROJECT_ID")) {
      firebase.initializeApp(firebaseConfig);
    }
  </script>
</body>
</html>`;

  const dashboardCodeTemplate = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard ผลการประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode CDN -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <!-- Google Fonts Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Prompt:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <!-- Firebase App & Realtime Database SDK -->
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
  <!-- ดูโค้ดตัวเต็มใน dashboard.html พร้อมระบบ Realtime Listener และ Chart.js -->
  <script>
    const firebaseConfig = {
      databaseURL: "${userDbUrl || 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com'}"
    };
    if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes("YOUR_PROJECT_ID")) {
      firebase.initializeApp(firebaseConfig);
      const rtdb = firebase.database();
      rtdb.ref('feedback').on('value', (snap) => {
        // อัปเดตกราฟและคะแนนเฉลี่ยบนจอโปรเจกเตอร์ทันทีที่มีคนส่ง!
      });
    }
  </script>
</body>
</html>`;

  const securityRulesTemplate = `{
  "rules": {
    "feedback": {
      ".read": true,
      ".write": true,
      "$feedback_id": {
        ".validate": "newData.hasChildren(['ratings', 'overallScore', 'timestamp']) && newData.child('overallScore').isNumber()"
      }
    }
  }
}`;

  const currentDisplayCode =
    activeCodeTab === 'survey'
      ? surveyCodeTemplate
      : activeCodeTab === 'dashboard'
      ? dashboardCodeTemplate
      : securityRulesTemplate;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentDisplayCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Firebase Realtime Database & Deployment Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          คู่มือการตั้งค่า Firebase Realtime Database และการ Deploy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          แอปพลิเคชันนี้ออกแบบมาให้ใช้งานได้ทั้งแบบ <b>Stand-alone HTML + JS</b> และทำงานบนเว็บนี้ได้ทันที 
          โดยใช้แพ็กเกจฟรี (Spark Plan) ของ Firebase ไม่ต้องผูกบัตรเครดิต
        </p>
      </div>

      {/* Step by Step Setup Process */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Step 1 */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              สร้างโปรเจกต์บน Firebase Console
            </h2>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
            <li>เข้าไปที่ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium">console.firebase.google.com</a> ด้วยบัญชี Google</li>
            <li>คลิกปุ่ม <b>Add project</b> (หรือ "เพิ่มโปรเจกต์")</li>
            <li>ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">training-feedback-app</code></li>
            <li>ส่วน Google Analytics สามารถเลือกปิด (Disable) เพื่อความสะดวกรวดเร็วได้</li>
            <li>กด <b>Create project</b> รอประมาณ 10 วินาทีจนเสร็จสิ้น</li>
          </ol>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              เปิดใช้งาน Realtime Database
            </h2>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
            <li>ในเมนูแถบซ้าย เลือก <b>Build</b> ➔ <b>Realtime Database</b></li>
            <li>คลิกปุ่ม <b>Create Database</b></li>
            <li>เลือกที่ตั้งเซิร์ฟเวอร์ (เช่น <code className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Singapore (asia-southeast1)</code> เพื่อความเร็วสูงสุดในไทย)</li>
            <li>ในหน้า Security Rules ให้เลือก <b>Start in test mode</b> (โหมดทดสอบ)</li>
            <li>กด <b>Enable</b> ระบบจะสร้างฐานข้อมูลพร้อมแสดง URL ให้ทันที</li>
          </ol>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              คัดลอก Database URL มาเชื่อมต่อ
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            บนหน้า Realtime Database จะมี URL อยู่ด้านบน เช่น:
            <code className="block mt-1.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-indigo-600 dark:text-indigo-400 font-mono text-[11px] break-all">
              https://YOUR-APP-default-rtdb.asia-southeast1.firebasedatabase.app
            </code>
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300">
            นำ URL นี้ไปใส่ในตัวแปร <code className="font-semibold">databaseURL</code> ในไฟล์ <b>survey.html</b> และ <b>dashboard.html</b> หรือกรอกในช่องด้านล่างนี้ได้เลย
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              การ Deploy ขึ้นเว็บ (ฟรี 100%)
            </h2>
          </div>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">ทางเลือก A: GitHub Pages (แนะนำ)</span>
              <p className="mt-0.5 text-[11px]">อัปโหลดไฟล์ survey.html และ dashboard.html ขึ้น GitHub Repo แล้วเปิด Pages ใน Settings ➔ ใช้ได้ทันทีมี HTTPS ฟรี</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">ทางเลือก B: Firebase Hosting</span>
              <p className="mt-0.5 text-[11px]">รันคำสั่ง <code className="font-mono">firebase init hosting</code> แล้วสั่ง <code className="font-mono">firebase deploy</code> ได้โดเมนฟรี .web.app</p>
            </div>
          </div>
        </div>

      </div>

      {/* Database URL Inserter */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>เครื่องมือช่วยใส่ Firebase Database URL ลงในโค้ดให้อัตโนมัติ</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          นำ Firebase Realtime Database URL ของท่านมาวางที่นี่ โค้ดในแท็บด้านล่างจะถูกอัปเดตให้พร้อมดาวน์โหลดทันที:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={userDbUrl}
            onChange={e => setUserDbUrl(e.target.value)}
            placeholder="https://your-project-default-rtdb.firebaseio.com"
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          {userDbUrl && (
            <button
              onClick={() => setUserDbUrl('')}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline cursor-pointer"
            >
              ล้างค่า
            </button>
          )}
        </div>
      </div>

      {/* Code Inspector Tabs & Download Buttons */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Tab Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveCodeTab('survey')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeCodeTab === 'survey'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>survey.html (หน้าตอบมือถือ)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeCodeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>dashboard.html (หน้า Dashboard จอใหญ่)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('rules')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeCodeTab === 'rules'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Security Rules (JSON)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
            </button>

            {activeCodeTab !== 'rules' && (
              <button
                onClick={() =>
                  handleDownloadFile(
                    activeCodeTab === 'survey' ? 'survey.html' : 'dashboard.html',
                    currentDisplayCode
                  )
                }
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์ .{activeCodeTab === 'survey' ? 'survey.html' : 'dashboard.html'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Code Content Container */}
        <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto text-xs font-mono text-slate-300 max-h-96">
          <pre className="leading-relaxed">
            <code>{currentDisplayCode}</code>
          </pre>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>ไฟล์ standalone ทั้ง 2 ไฟล์ถูกสร้างไว้ในรูทของโปรเจกต์นี้เรียบร้อยแล้ว (/survey.html และ /dashboard.html)</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Client-Side Ready</span>
        </div>

      </div>

    </div>
  );
};
