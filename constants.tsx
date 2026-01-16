
import { VoiceName, VoiceProfile } from './types';

export const VOICES: VoiceProfile[] = [
  // Gemini (Supertonic) Voices
  {
    id: VoiceName.Kore,
    name: 'Kore',
    description: 'A clear, energetic female voice suitable for narration.',
    gender: 'Female',
    color: 'bg-emerald-500',
    engine: 'gemini'
  },
  {
    id: VoiceName.Puck,
    name: 'Puck',
    description: 'Youthful and bright, perfect for characters and stories.',
    gender: 'Neutral',
    color: 'bg-amber-500',
    engine: 'gemini'
  },
  {
    id: VoiceName.Charon,
    name: 'Charon',
    description: 'Deep, resonant, and authoritative male presence.',
    gender: 'Male',
    color: 'bg-indigo-500',
    engine: 'gemini'
  },
  {
    id: VoiceName.Fenrir,
    name: 'Fenrir',
    description: 'Gritty and textured with a unique personality.',
    gender: 'Male',
    color: 'bg-rose-500',
    engine: 'gemini'
  },
  {
    id: VoiceName.Zephyr,
    name: 'Zephyr',
    description: 'Calm, soothing, and professional airy tone.',
    gender: 'Female',
    color: 'bg-cyan-500',
    engine: 'gemini'
  },
  // Pocket TTS Voices (Simulated IDs for external backend)
  {
    id: 'pocket-base',
    name: 'Pocket Base',
    description: 'Standard lightweight synthesis model.',
    gender: 'Neutral',
    color: 'bg-orange-500',
    engine: 'pocket'
  },
  {
    id: 'pocket-instruct',
    name: 'Pocket Instruct',
    description: 'Optimized for following reading instructions.',
    gender: 'Female',
    color: 'bg-orange-600',
    engine: 'pocket'
  }
];

export const APP_CONFIG = {
  SAMPLE_RATE: 24000,
  CHANNELS: 1,
  MODALITY: 'AUDIO' as const,
  DEFAULT_POCKET_ENDPOINT: 'http://localhost:8000/generate'
};
