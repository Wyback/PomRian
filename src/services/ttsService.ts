import { useState, useEffect, useRef } from 'react';

const GOOGLE_CLOUD_TTS_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_TTS_API_KEY; // Read from environment variables

export const useThaiSpeech = (text: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported] = useState(true); // Always true as we are using a third-party API
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);
    audioRef.current.onerror = (e) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };
  }, []);

  const speak = async () => {
    if (isPlaying) return; // Prevent multiple simultaneous playback

    setIsPlaying(true);

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_TTS_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text: text },
            voice: {
              languageCode: 'th-TH',
              name: 'th-TH-Chirp3-HD-Algenib', // Updated Thai voice
              ssmlGender: 'FEMALE', // Or 'MALE', 'NEUTRAL'
            },
            audioConfig: { audioEncoding: 'MP3' },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Failed to synthesize speech');
      }

      const data = await response.json();
      const audioContent = data.audioContent;

      if (audioRef.current) {
        audioRef.current.src = `data:audio/mp3;base64,${audioContent}`;
        audioRef.current.play();
      }

    } catch (error) {
      console.error('Google Cloud TTS error:', error);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset playback to start
      setIsPlaying(false);
    }
  };

  return { speak, stop, isPlaying, isSupported };
};
