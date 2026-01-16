
import { VoiceName, VoiceProfile } from './types';

export const VOICES: VoiceProfile[] = [
  {
    id: VoiceName.Kore,
    name: 'Kore',
    description: 'A clear, energetic female voice suitable for narration.',
    gender: 'Female',
    color: 'bg-emerald-500'
  },
  {
    id: VoiceName.Puck,
    name: 'Puck',
    description: 'Youthful and bright, perfect for characters and stories.',
    gender: 'Neutral',
    color: 'bg-amber-500'
  },
  {
    id: VoiceName.Charon,
    name: 'Charon',
    description: 'Deep, resonant, and authoritative male presence.',
    gender: 'Male',
    color: 'bg-indigo-500'
  },
  {
    id: VoiceName.Fenrir,
    name: 'Fenrir',
    description: 'Gritty and textured with a unique personality.',
    gender: 'Male',
    color: 'bg-rose-500'
  },
  {
    id: VoiceName.Zephyr,
    name: 'Zephyr',
    description: 'Calm, soothing, and professional airy tone.',
    gender: 'Female',
    color: 'bg-cyan-500'
  }
];

export const APP_CONFIG = {
  SAMPLE_RATE: 24000,
  CHANNELS: 1,
  MODALITY: 'AUDIO' as const,
};
