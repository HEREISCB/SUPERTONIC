
import React, { useState, useCallback, useRef } from 'react';
import { VOICES, APP_CONFIG } from './constants';
import { VoiceName, GeneratedAudio, SpeakerConfig, EngineType } from './types';
import { VoiceCard } from './components/VoiceCard';
import { AudioHistory } from './components/AudioHistory';
import { synthesizeSpeech, synthesizeMultiSpeaker } from './services/geminiService';
import { synthesizePocketSpeech } from './services/pocketService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [engine, setEngine] = useState<EngineType>('gemini');
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].id);
  const [pocketEndpoint, setPocketEndpoint] = useState(APP_CONFIG.DEFAULT_POCKET_ENDPOINT);
  
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [isCheerfully, setIsCheerfully] = useState(false);

  // Multi-speaker state
  const [multiConfig, setMultiConfig] = useState<{
    speaker1: SpeakerConfig;
    speaker2: SpeakerConfig;
    conversation: string;
  }>({
    speaker1: { name: 'Joe', voice: VoiceName.Kore },
    speaker2: { name: 'Jane', voice: VoiceName.Puck },
    conversation: "Joe: Hey Jane, how's it going?\nJane: It's going great, how about you?"
  });

  const availableVoices = VOICES.filter(v => v.engine === engine);

  const handleEngineChange = (newEngine: EngineType) => {
    setEngine(newEngine);
    // Reset selection to first available voice for that engine
    const firstVoice = VOICES.find(v => v.engine === newEngine);
    if (firstVoice) setSelectedVoice(firstVoice.id);
    
    // Force single mode if Pocket TTS (assuming multi-speaker not implemented in mock backend)
    if (newEngine === 'pocket') setMode('single');
  };

  const handleSynthesize = async () => {
    if (mode === 'single' && !inputText.trim()) return;
    if (mode === 'multi' && !multiConfig.conversation.trim()) return;

    setIsSynthesizing(true);
    setError(null);

    try {
      let result;
      if (engine === 'gemini') {
        if (mode === 'single') {
          result = await synthesizeSpeech(inputText, selectedVoice as VoiceName, isCheerfully);
        } else {
          result = await synthesizeMultiSpeaker({
            speaker1Name: multiConfig.speaker1.name,
            speaker1Voice: multiConfig.speaker1.voice as VoiceName,
            speaker2Name: multiConfig.speaker2.name,
            speaker2Voice: multiConfig.speaker2.voice as VoiceName,
            conversation: multiConfig.conversation,
          });
        }
      } else {
        // Pocket TTS Logic
        if (mode === 'single') {
            result = await synthesizePocketSpeech(inputText, selectedVoice, pocketEndpoint);
        } else {
            throw new Error("Conversation mode not supported for Pocket TTS yet.");
        }
      }

      const newAudio: GeneratedAudio = {
        id: Math.random().toString(36).substring(7),
        text: mode === 'single' ? (inputText.substring(0, 50) + (inputText.length > 50 ? '...' : '')) : "Multi-speaker Conversation",
        voice: mode === 'single' ? selectedVoice : 'Conversation',
        blobUrl: result.blobUrl,
        timestamp: Date.now(),
        isMultiSpeaker: mode === 'multi',
        engine: engine
      };
      setHistory(prev => [newAudio, ...prev]);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to synthesize speech.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors ${engine === 'gemini' ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-emerald-500/20' : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/20'}`}>
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-none">SUPERTONIC</h1>
              <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">
                {engine === 'gemini' ? 'Gemini Engine' : 'Pocket Engine'}
              </span>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'single' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Single Voice
            </button>
            <button
              onClick={() => setMode('multi')}
              disabled={engine === 'pocket'}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                engine === 'pocket' ? 'opacity-50 cursor-not-allowed text-zinc-600' : 
                mode === 'multi' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Conversation
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar / Configuration */}
        <div className="lg:w-80 flex flex-col gap-6">
          
          {/* Engine Selector */}
          <section className="bg-zinc-900/40 p-1 rounded-xl border border-zinc-800 flex">
            <button 
              onClick={() => handleEngineChange('gemini')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${engine === 'gemini' ? 'bg-zinc-800 text-emerald-400 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Supertonic
            </button>
            <button 
              onClick={() => handleEngineChange('pocket')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${engine === 'pocket' ? 'bg-zinc-800 text-orange-400 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Pocket TTS
            </button>
          </section>

          <section>
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className={`w-1 h-3 rounded-full ${engine === 'gemini' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              Select Voice
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {availableVoices.map((v) => (
                <VoiceCard 
                  key={v.id} 
                  voice={v} 
                  isSelected={mode === 'single' ? selectedVoice === v.id : false} 
                  onSelect={(id) => {
                    if (mode === 'single') setSelectedVoice(id);
                  }}
                />
              ))}
            </div>
          </section>

          <section className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Properties</h2>
            <div className="space-y-4">
              {engine === 'gemini' && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Expressive Tone</span>
                  <button 
                    onClick={() => setIsCheerfully(!isCheerfully)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      isCheerfully ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      isCheerfully ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              )}
              
              {engine === 'pocket' && (
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Backend URL</label>
                  <input 
                    type="text" 
                    value={pocketEndpoint}
                    onChange={(e) => setPocketEndpoint(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 font-mono focus:border-orange-500 outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Format</span>
                <span className={`text-xs font-mono ${engine === 'gemini' ? 'text-emerald-400' : 'text-orange-400'}`}>WAV</span>
              </div>
            </div>
          </section>
        </div>

        {/* Main Console */}
        <div className="flex-1 flex flex-col gap-8">
          <section className="bg-zinc-900/60 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="p-1 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between px-6 h-12">
              <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                Studio Console / {mode === 'single' ? 'Script' : 'Dialogue'}
              </span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>

            <div className="p-6">
              {mode === 'single' ? (
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={engine === 'gemini' 
                    ? "Enter text to synthesize... Try something like 'Hello! Welcome to the Supertonic Voice Studio.'"
                    : "Enter text for Pocket TTS... Ensure your backend is running."
                  }
                  className="w-full h-48 bg-transparent text-zinc-100 placeholder-zinc-700 resize-none focus:outline-none text-lg leading-relaxed font-light"
                />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Speaker 1</label>
                      <input 
                        type="text" 
                        value={multiConfig.speaker1.name}
                        onChange={(e) => setMultiConfig(prev => ({ ...prev, speaker1: { ...prev.speaker1, name: e.target.value } }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
                      />
                      <select 
                        value={multiConfig.speaker1.voice}
                        onChange={(e) => setMultiConfig(prev => ({ ...prev, speaker1: { ...prev.speaker1, voice: e.target.value as VoiceName } }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
                      >
                        {availableVoices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Speaker 2</label>
                      <input 
                        type="text" 
                        value={multiConfig.speaker2.name}
                        onChange={(e) => setMultiConfig(prev => ({ ...prev, speaker2: { ...prev.speaker2, name: e.target.value } }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
                      />
                      <select 
                        value={multiConfig.speaker2.voice}
                        onChange={(e) => setMultiConfig(prev => ({ ...prev, speaker2: { ...prev.speaker2, voice: e.target.value as VoiceName } }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 focus:border-zinc-700 outline-none"
                      >
                        {availableVoices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Dialogue (Format: Name: Text)</label>
                    <textarea
                      value={multiConfig.conversation}
                      onChange={(e) => setMultiConfig(prev => ({ ...prev, conversation: e.target.value }))}
                      className="w-full h-40 bg-transparent text-zinc-100 placeholder-zinc-700 resize-none focus:outline-none text-base border-t border-zinc-800 pt-4"
                      placeholder="Joe: Hi! How are you?&#10;Jane: I'm great! This studio is amazing."
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-zinc-800 pt-6">
                <div className="flex-1">
                  {error && (
                    <p className="text-rose-500 text-xs font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleSynthesize}
                  disabled={isSynthesizing}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-xl ${
                    isSynthesizing 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-white/10'
                  }`}
                >
                  {isSynthesizing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      Synthesize
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1 h-3 bg-zinc-700 rounded-full" />
              Rendering History
            </h2>
            <AudioHistory history={history} />
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs">
            © 2025 Supertonic Voice Studio. 
          </p>
          <div className="flex gap-6 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400">Documentation</a>
            <a href="#" className="hover:text-zinc-400">API Access</a>
            <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
