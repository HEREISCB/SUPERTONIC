
export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface VoiceProfile {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
  previewUrl?: string;
  color: string;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  voice: VoiceName;
  blobUrl: string;
  timestamp: number;
  isMultiSpeaker: boolean;
}

export interface SpeakerConfig {
  name: string;
  voice: VoiceName;
}
