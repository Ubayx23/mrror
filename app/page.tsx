'use client';

import { useState } from 'react';
import BootScreen from '@/app/components/BootScreen';
import TerminalLayout from '@/app/components/TerminalLayout';
import DailyDiagnostic from '@/app/components/DailyDiagnostic';
import MissionDebrief from '@/app/components/MissionDebrief';
import TomorrowDirective from '@/app/components/TomorrowDirective';
import Dashboard from '@/app/components/Dashboard';
import { saveRecord, hasRecordToday, DailyRecord, getLatestRecord } from '@/app/utils/storage';

type FlowStep = 'boot' | 'diagnostic' | 'debrief' | 'directive' | 'dashboard';

interface DailyFormData {
  // From diagnostic
  impulseControl: number;
  focusConsistency: number;
  emotionalStability: number;
  timeWasted: number;
  systemIntegrity: number;
  rotIndex: number;
  // From debrief
  missionDebrief: string;
  // From directive
  tomorrowObjective: string;
  executionWindow: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FlowStep>(() => {
    // Initialize state on mount - check if user has today's record
    if (typeof window === 'undefined') return 'boot';
    
    const today = hasRecordToday();
    return today ? 'dashboard' : 'boot';
  });
  const [formData, setFormData] = useState<Partial<DailyFormData>>({});
  const [latestRecord, setLatestRecord] = useState<DailyRecord | null>(() => {
    // Initialize with today's record if it exists
    if (typeof window === 'undefined') return null;
    
    if (hasRecordToday()) {
      return getLatestRecord();
    }
    return null;
  });

  const handleBootComplete = () => {
    setCurrentStep('diagnostic');
  };

  const handleDiagnosticComplete = (data: {
    impulseControl: number;
    focusConsistency: number;
    emotionalStability: number;
    timeWasted: number;
    systemIntegrity: number;
    rotIndex: number;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep('debrief');
  };

  const handleDebriefComplete = (debrief: string) => {
    setFormData((prev) => ({ ...prev, missionDebrief: debrief }));
    setCurrentStep('directive');
  };

  const handleDirectiveComplete = (objective: string, executionWindow: string) => {
    const completeData: DailyFormData = {
      impulseControl: formData.impulseControl || 0,
      focusConsistency: formData.focusConsistency || 0,
      emotionalStability: formData.emotionalStability || 0,
      timeWasted: formData.timeWasted || 0,
      systemIntegrity: formData.systemIntegrity || 0,
      rotIndex: formData.rotIndex || 0,
      missionDebrief: formData.missionDebrief || '',
      tomorrowObjective: objective,
      executionWindow: executionWindow,
    };

    // Create and save the complete daily record
    const record: DailyRecord = {
      timestamp: new Date().toISOString(),
      ...completeData,
    };

    saveRecord(record);
    setLatestRecord(record);
    setCurrentStep('dashboard');
  };

  // Render boot screen
  if (currentStep === 'boot') {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  // Wrap all other steps in TerminalLayout
  return (
    <TerminalLayout>
      {currentStep === 'diagnostic' && (
        <DailyDiagnostic onComplete={handleDiagnosticComplete} />
      )}
      {currentStep === 'debrief' && (
        <MissionDebrief onComplete={handleDebriefComplete} />
      )}
      {currentStep === 'directive' && (
        <TomorrowDirective onComplete={handleDirectiveComplete} />
      )}
      {currentStep === 'dashboard' && latestRecord && (
        <Dashboard latestRecord={latestRecord} />
      )}
    </TerminalLayout>
  );
}
