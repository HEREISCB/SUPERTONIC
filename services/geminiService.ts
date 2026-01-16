
import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";
import { APP_CONFIG } from "../constants";
import { decodeBase64, decodePCMToAudioBuffer, audioBufferToWav } from "./audioUtils";

const MODEL_ID = "gemini-2.5-flash-preview-tts";

export interface MultiSpeakerInput {
  speaker1Name: string;
  speaker1Voice: VoiceName;
  speaker2Name: string;
  speaker2Voice: VoiceName;
  conversation: string;
}

export const synthesizeSpeech = async (
  text: string,
  voice: VoiceName,
  isCheerfully: boolean = false
): Promise<{ blobUrl: string; duration: number }> => {
  // Access process.env.API_KEY directly at runtime
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = isCheerfully ? `Say cheerfully: ${text}` : text;

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data received from Gemini API");

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: APP_CONFIG.SAMPLE_RATE
  });
  
  const rawBytes = decodeBase64(base64Audio);
  const audioBuffer = await decodePCMToAudioBuffer(
    rawBytes,
    audioContext,
    APP_CONFIG.SAMPLE_RATE,
    APP_CONFIG.CHANNELS
  );

  const wavBlob = audioBufferToWav(audioBuffer);
  const blobUrl = URL.createObjectURL(wavBlob);
  
  return { blobUrl, duration: audioBuffer.duration };
};

export const synthesizeMultiSpeaker = async (
  input: MultiSpeakerInput
): Promise<{ blobUrl: string; duration: number }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `TTS the following conversation between ${input.speaker1Name} and ${input.speaker2Name}:
${input.conversation}`;

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: input.speaker1Name,
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: input.speaker1Voice }
              }
            },
            {
              speaker: input.speaker2Name,
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: input.speaker2Voice }
              }
            }
          ]
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No multi-speaker audio data received");

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: APP_CONFIG.SAMPLE_RATE
  });
  
  const rawBytes = decodeBase64(base64Audio);
  const audioBuffer = await decodePCMToAudioBuffer(
    rawBytes,
    audioContext,
    APP_CONFIG.SAMPLE_RATE,
    APP_CONFIG.CHANNELS
  );

  const wavBlob = audioBufferToWav(audioBuffer);
  const blobUrl = URL.createObjectURL(wavBlob);
  
  return { blobUrl, duration: audioBuffer.duration };
};
