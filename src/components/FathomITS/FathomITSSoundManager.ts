// ============================================================================
// FATHOM ITS 1 — SOUND & SPEECH SYNTHESIS/RECOGNITION MANAGER
// High-Speed ElevenLabs Integration and Real-time Voice I/O Engine
// ============================================================================

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export class FathomITSSoundManager {
  private static activeAudio: HTMLAudioElement | null = null;
  private static audioCache = new Map<string, string>(); // text+voiceId -> blobUrl
  private static activeRecognition: any = null;

  /**
   * Speaks text using ElevenLabs TTS via server proxy
   */
  public static async speakText(
    text: string,
    voiceId: string,
    options?: {
      playbackRate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<HTMLAudioElement | null> {
    try {
      this.stopCurrentAudio();

      const cleanText = text.replace(/[*_#`]/g, '').trim();
      if (!cleanText) return null;

      const cacheKey = `${voiceId}:${cleanText}`;
      let blobUrl = this.audioCache.get(cacheKey);

      if (!blobUrl) {
        const response = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voiceId: voiceId,
            modelId: 'eleven_turbo_v2_5'
          })
        });

        if (!response.ok) {
          throw new Error(`TTS synthesis returned status ${response.status}`);
        }

        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);
        this.audioCache.set(cacheKey, blobUrl);
      }

      const audio = new Audio(blobUrl);
      audio.playbackRate = options?.playbackRate || 1.0;
      this.activeAudio = audio;

      audio.onplay = () => {
        options?.onStart?.();
      };

      audio.onended = () => {
        options?.onEnd?.();
      };

      audio.onerror = (e) => {
        console.error('[FathomITS Sound Error]:', e);
        options?.onError?.(e);
      };

      await audio.play();
      return audio;
    } catch (err) {
      console.error('[FathomITS Sound Exception]:', err);
      options?.onError?.(err);
      return null;
    }
  }

  /**
   * Stops currently playing speech
   */
  public static stopCurrentAudio(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
  }

  /**
   * Check if speech recognition is supported in current browser
   */
  public static isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Starts listening to user microphone with real-time transcript streaming
   */
  public static startListening(
    onResult: (result: SpeechRecognitionResultPayload) => void,
    onEnd: () => void,
    onError: (err: any) => void
  ): boolean {
    if (!this.isSTTSupported()) {
      onError(new Error('Speech recognition is not supported in this browser.'));
      return false;
    }

    try {
      this.stopListening();

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combined = (finalTranscript + ' ' + interimTranscript).trim();
        onResult({
          transcript: combined,
          isFinal: Boolean(finalTranscript)
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('[FathomITS STT Notice]:', event.error);
        onError(event);
      };

      recognition.onend = () => {
        this.activeRecognition = null;
        onEnd();
      };

      this.activeRecognition = recognition;
      recognition.start();
      return true;
    } catch (e) {
      console.error('[FathomITS STT Exception]:', e);
      onError(e);
      return false;
    }
  }

  /**
   * Stops active microphone recording
   */
  public static stopListening(): void {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch {}
      this.activeRecognition = null;
    }
  }
}
