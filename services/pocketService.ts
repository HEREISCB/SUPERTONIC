
export const synthesizePocketSpeech = async (
  text: string,
  voice: string,
  endpoint: string
): Promise<{ blobUrl: string; duration: number }> => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: voice,
        stream: false // Assume we want full file for now
      }),
    });

    if (!response.ok) {
      throw new Error(`Pocket TTS Server Error: ${response.status} ${response.statusText}`);
    }

    // Assume the backend returns a WAV file directly
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Estimate duration or get from header if available (simplified for now)
    // For a real app, we would parse the WAV header or use AudioContext to get exact duration
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    return { blobUrl, duration: audioBuffer.duration };
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error("Could not connect to Pocket TTS backend. Is your server running?");
    }
    throw error;
  }
};
