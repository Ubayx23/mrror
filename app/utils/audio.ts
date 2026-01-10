'use client';

let audioContext: AudioContext | null = null;
const audioElementCache = new Map<string, HTMLAudioElement>();

function getAudioElement(url: string): HTMLAudioElement {
  const existing = audioElementCache.get(url);
  if (existing) return existing;
  const el = new Audio(url);
  el.preload = 'auto';
  audioElementCache.set(url, el);
  return el;
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Play an audio file from /public. Returns true on success, false on failure.
 */
export async function playAudioFile(url: string, volume = 1): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const audio = getAudioElement(url);
    audio.currentTime = 0;
    audio.volume = volume;
    await audio.play();
    return true;
  } catch {
    audioElementCache.delete(url);
    return false;
  }
}

/**
 * Pleasant notification chime (two-tone bell-like sound)
 * Good for start/stop events
 */
export function playNotificationChime() {
  if (typeof window === 'undefined') return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // First tone (higher) - 0.3s
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);
    
    // Second tone (lower) - starts at 0.15s, lasts 0.25s
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, now + 0.15);
    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.4);
  } catch {
    // Silently fail if audio context can't be created
  }
}

/**
 * Success chime (ascending tones, very pleasant)
 * Good for task completion, marking done
 */
export function playSuccessChime() {
  if (typeof window === 'undefined') return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Three ascending tones
    const frequencies = [523, 659, 784]; // C5, E5, G5
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      
      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.25);
    });
  } catch (e) {
    // Silently fail if audio context can't be created
  }
}

/**
 * Alert chime (urgent, for break reminders)
 * Good for alerts and time warnings
 */
export function playAlertChime() {
  if (typeof window === 'undefined') return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Double beep pattern
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now + i * 0.15);
      
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.15);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.15);
    }
  } catch {
    // Silently fail if audio context can't be created
  }
}

export function createBackgroundTone(): [OscillatorNode, GainNode] {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(174, ctx.currentTime); // Low F (Solfeggio frequency)
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  
  return [osc, gain];
}

/**
 * Stop a background tone smoothly
 */
export function stopBackgroundTone(osc: OscillatorNode, gain: GainNode) {
  const ctx = gain.context;
  const now = ctx.currentTime;
  
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  osc.stop(now + 0.35);
}

/**
 * Close audio context and cleanup
 */
export function closeAudioContext() {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}
