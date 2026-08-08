// Utility for Web Speech API (SpeechRecognition for STT and SpeechSynthesis for TTS)

export interface SpeechRecognitionResultCallback {
  (text: string, isFinal: boolean): void;
}

export interface SpeechRecognitionErrorCallback {
  (error: string): void;
}

let activeRecognition: any = null;

export const startSpeechToText = (
  languageCode: string, // 'en', 'hi', 'kn'
  onResult: SpeechRecognitionResultCallback,
  onError?: SpeechRecognitionErrorCallback,
  onEnd?: () => void
) => {
  // Check browser support for SpeechRecognition
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) {
      onError('Speech recognition is not supported in this browser.');
    }
    return null;
  }

  // Stop any active recognition session
  stopSpeechToText();

  try {
    const recognition = new SpeechRecognition();
    activeRecognition = recognition;

    // Map language code to locale string
    let locale = 'en-IN';
    if (languageCode === 'hi') locale = 'hi-IN';
    if (languageCode === 'kn') locale = 'kn-IN';

    recognition.lang = locale;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        onResult(text, Boolean(finalTranscript));
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (onError && event.error !== 'no-speech') {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      activeRecognition = null;
      if (onEnd) onEnd();
    };

    recognition.start();
    return recognition;
  } catch (err: any) {
    console.error('Failed to start speech recognition:', err);
    if (onError) onError('Could not access microphone.');
    return null;
  }
};

export const stopSpeechToText = () => {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      // ignore
    }
    activeRecognition = null;
  }
};

export const speakText = (
  text: string,
  languageCode: string = 'en',
  onEnd?: () => void
) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);

  let locale = 'en-IN';
  if (languageCode === 'hi') locale = 'hi-IN';
  if (languageCode === 'kn') locale = 'kn-IN';

  utterance.lang = locale;
  utterance.rate = 0.95; // slightly natural pace

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
