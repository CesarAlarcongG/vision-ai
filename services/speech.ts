// services/speech.ts

import * as Speech from "expo-speech";

let pendingTimer: ReturnType<typeof setTimeout> | null = null;

type SpeakCallbacks = {
  onDone?: () => void;
  onError?: (error: Error) => void;
};

export function speak(
  text: string,
  rate: number = 0.9,
  callbacks: SpeakCallbacks = {}
) {
  if (!text.trim()) {
    callbacks.onDone?.();
    return;
  }

  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  void Speech.stop();

  pendingTimer = setTimeout(() => {
    pendingTimer = null;

    Speech.speak(text, {
      language: "es-PE",
      rate,
      pitch: 1,
      onDone: callbacks.onDone,
      onError: callbacks.onError,
    });
  }, 100);
}

export function stopSpeaking() {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  void Speech.stop();
}
