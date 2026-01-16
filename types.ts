
export type EngineType = 'gemini' | 'pocket';

export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
  previewUrl?: string;
  color: string;
  engine: EngineType;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  voice: string;
  blobUrl: string;
  timestamp: number;
  isMultiSpeaker: boolean;
  engine: EngineType;
}

export interface SpeakerConfig {
  name: string;
  voice: string;
}
