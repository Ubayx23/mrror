'use client';

import { useState } from 'react';
import BootScreen from '@/app/components/BootScreen';
import TerminalLayout from '@/app/components/TerminalLayout';
import Q1_MissionHonor from '@/app/components/Q1_MissionHonor';
import Q2_TimeWasted from '@/app/components/Q2_TimeWasted';
import Q3_ExcuseLog from '@/app/components/Q3_ExcuseLog';
import Q4_FocusControl from '@/app/components/Q4_FocusControl';
import Q5_PrimeObjective from '@/app/components/Q5_PrimeObjective';
import Dashboard from '@/app/components/Dashboard';
import { saveRecord, hasRecordToday, DailyRecord, getLatestRecord } from '@/app/utils/storage';
import { calculateSystemIntegrity, calculateRotIndex } from '@/app/utils/SystemMetrics';

type FlowStep = 'boot' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'dashboard';

interface InterrogationData {
  missionSuccess?: boolean;
  timeWasted?: number;
  excuseLog?: string;
  impulseControl?: number;
  focusConsistency?: number;
  emotionalStability?: number;
  tomorrowObjective?: string;
  executionWindow?: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FlowStep>(() => {
    if (typeof window === 'undefined') return 'boot';
    const today = hasRecordToday();
    return today ? 'dashboard' : 'boot';
  });
  
  const [formData, setFormData] = useState<InterrogationData>({});
  const [latestRecord, setLatestRecord] = useState<DailyRecord | null>(() => {
    if (typeof window === 'undefined') return null;
    if (hasRecordToday()) {
      return getLatestRecord();
    }
    return null;
  });

  const handleBootComplete = () => {
    setCurrentStep('q1');
  };

  const handleQ1Complete = (missionSuccess: boolean) => {
    setFormData((prev) => ({ ...prev, missionSuccess }));
    setCurrentStep('q2');
  };

  const handleQ2Complete = (timeWasted: number) => {
    setFormData((prev) => ({ ...prev, timeWasted }));
    setCurrentStep('q3');
  };

  const handleQ3Complete = (excuseLog: string) => {
    setFormData((prev) => ({ ...prev, excuseLog }));
    setCurrentStep('q4');
  };

  const handleQ4Complete = (data: {
    impulseControl: number;
    focusConsistency: number;
    emotionalStability: number;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep('q5');
  };

  const handleQ5Complete = (objective: string, executionWindow: string) => {
    const completeData = {
      missionSuccess: formData.missionSuccess ?? false,
      timeWasted: formData.timeWasted ?? 0,
      excuseLog: formData.excuseLog ?? '',
      impulseControl: formData.impulseControl ?? 0,
      focusConsistency: formData.focusConsistency ?? 0,
      emotionalStability: formData.emotionalStability ?? 0,
      tomorrowObjective: objective,
      executionWindow: executionWindow,
    };

    const systemIntegrity = calculateSystemIntegrity(
      completeData.impulseControl,
      completeData.focusConsistency,
      completeData.emotionalStability
    );
    
    const rotIndex = calculateRotIndex(completeData.timeWasted);

    const record: DailyRecord = {
      timestamp: new Date().toISOString(),
      ...completeData,
      systemIntegrity,
      rotIndex,
    };

    saveRecord(record);
    setLatestRecord(record);
    setCurrentStep('dashboard');
  };

  if (currentStep === 'boot') {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  if (currentStep === 'q1') {
    return <Q1_MissionHonor onComplete={handleQ1Complete} />;
  }

  if (currentStep === 'q2') {
    return <Q2_TimeWasted onComplete={handleQ2Complete} />;
  }

  if (currentStep === 'q3') {
    return <Q3_ExcuseLog onComplete={handleQ3Complete} />;
  }

  if (currentStep === 'q4') {
    return <Q4_FocusControl onComplete={handleQ4Complete} />;
  }

  if (currentStep === 'q5') {
    return <Q5_PrimeObjective onComplete={handleQ5Complete} />;
  }

  return (
    <TerminalLayout>
      {latestRecord && <Dashboard latestRecord={latestRecord} />}
    </TerminalLayout>
  );
}
