
import React from 'react';
import { VoiceProfile } from '../types';

interface VoiceCardProps {
  voice: VoiceProfile;
  isSelected: boolean;
  onSelect: (id: VoiceProfile['id']) => void;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({ voice, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(voice.id)}
      className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left w-full group ${
        isSelected
          ? 'bg-zinc-800 border-white/40 shadow-lg shadow-white/5'
          : 'bg-zinc-900 border-transparent hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3 mb-2 w-full">
        <div className={`w-3 h-3 rounded-full ${voice.color} group-hover:scale-125 transition-transform`} />
        <span className="font-bold text-zinc-100">{voice.name}</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-zinc-500 font-medium px-1.5 py-0.5 border border-zinc-800 rounded">
          {voice.gender}
        </span>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">
        {voice.description}
      </p>
      
      {isSelected && (
        <div className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
