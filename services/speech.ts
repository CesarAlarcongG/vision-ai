// services/speech.ts

import * as Speech from "expo-speech";

let pendingTimer: ReturnType<typeof setTimeout> | null = null;

type SpeakCallbacks = {
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
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
    console.log("SPEECH: cancelling pending timer");

    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  void Speech.stop();

  console.log("SPEECH: scheduled:", text);

  pendingTimer = setTimeout(() => {
    pendingTimer = null;

    console.log("SPEECH: calling Speech.speak");

    Speech.speak(text, {
      language: "es-PE",
      rate,
      pitch: 1,

      onStart: () => {
        console.log("SPEECH EVENT: start");
        callbacks.onStart?.();
      },

      onDone: () => {
        console.log("SPEECH EVENT: done");
        callbacks.onDone?.();
      },

      onStopped: () => {
        console.log("SPEECH EVENT: stopped");
        callbacks.onStopped?.();
      },

      onError: (error) => {
        console.log("SPEECH EVENT: error", error);
        callbacks.onError?.(error);
      },
    });
  }, 100);
}

export function stopSpeaking() {
  if (pendingTimer) {
    console.log("SPEECH: clearing pending timer");

    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  void Speech.stop();
}
