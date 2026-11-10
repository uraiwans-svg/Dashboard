import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, DashboardStats, FeedbackEntry } from './types';
import { 
  calculateDashboardStats, 
  exportFeedbackToCSV, 
  getStoredEntries, 
  subscribeToFeedbackUpdates 
} from './utils/feedbackStore';
import { Navbar } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { ProjectorQRCodeView } from './components/ProjectorQRCodeView';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>(() => calculateDashboardStats([]));
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDarkMode]);

  // Load and calculate entries
  const reloadData = useCallback(() => {
    const list = getStoredEntries();
    setEntries(list);
    const calculated = calculateDashboardStats(list);
    setStats(calculated);
  }, []);

  // Listen to hash changes (e.g. #survey when someone scans QR code)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#survey' || hash === '#/survey') {
        setActiveTab('survey');
      } else if (hash === '#qrcode' || hash === '#/qrcode') {
        setActiveTab('qrcode');
      } else if (hash === '#guide' || hash === '#/guide') {
        setActiveTab('guide');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Setup data sync and initial load
  useEffect(() => {
    reloadData();
    const unsubscribe = subscribeToFeedbackUpdates(() => {
      reloadData();
    });
    return () => unsubscribe();
  }, [reloadData]);

  const handleExportCSV = () => {
    exportFeedbackToCSV(entries);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab === 'dashboard' ? '' : `#${tab}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* Top Bar following contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onExportCSV={handleExportCSV}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        respondentCount={stats.totalCount}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {activeTab === 'survey' && (
          <SurveyView
            onSubmittedSuccess={() => {
              reloadData();
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            entries={entries}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            onExportCSV={handleExportCSV}
            onNavigateToSurvey={() => handleTabChange('survey')}
          />
        )}

        {activeTab === 'qrcode' && (
          <ProjectorQRCodeView
            onBackToDashboard={() => handleTabChange('dashboard')}
          />
        )}

        {activeTab === 'guide' && (
          <FirebaseGuideView />
        )}
      </main>

      {/* Quick QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onNavigateToProjectorQR={() => handleTabChange('qrcode')}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sm:px-6 transition-colors text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Training Feedback System</span>
            <span aria-hidden="true">·</span>
            <span>Realtime Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>UTF-8 BOM CSV Export</span>
          </div>
          <div>
            <span>สเกล 1-5 ตามมาตรฐานประเมินผลไทย · ซิงค์อัตโนมัติไม่ต้องรีเฟรช</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
