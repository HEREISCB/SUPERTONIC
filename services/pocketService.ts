
export const synthesizePocketSpeech = async (
  text: string,
  voice: string,
  endpoint: string
): Promise<{ blobUrl: string; duration: number }> => {
  // Security Check: Mixed Content
  if (window.location.protocol === 'https:' && endpoint.startsWith('http://localhost')) {
    throw new Error("Mixed Content Error: Browser blocks HTTPS sites from calling HTTP localhost. Use an HTTPS tunnel for your backend or use HTTP for this frontend.");
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: voice,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Pocket TTS Server Error: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    return { blobUrl, duration: audioBuffer.duration };
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error("Could not connect to Pocket TTS backend. Is your server running and allowing CORS?");
    }
    throw error;
  }
};
