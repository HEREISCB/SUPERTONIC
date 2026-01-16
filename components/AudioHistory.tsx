
import React from 'react';
import { GeneratedAudio } from '../types';

interface AudioHistoryProps {
  history: GeneratedAudio[];
}

export const AudioHistory: React.FC<AudioHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
        <svg className="w-12 h-12 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <p className="text-zinc-500 font-medium">No voices rendered yet</p>
        <p className="text-zinc-600 text-sm">Synthesize some text to see your history</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div 
          key={item.id} 
          className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 group hover:bg-zinc-900 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 px-1.5 py-0.5 bg-zinc-800 rounded">
                {item.voice}
              </span>
              <span className="text-[10px] text-zinc-600">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-zinc-300 truncate italic">"{item.text}"</p>
          </div>
          
          <div className="flex items-center gap-3">
            <audio 
              src={item.blobUrl} 
              controls 
              className="h-8 max-w-[200px] brightness-75 contrast-125 rounded-lg overflow-hidden" 
            />
            <a 
              href={item.blobUrl} 
              download={`supertonic-voice-${item.id}.wav`}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
              title="Download WAV"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
