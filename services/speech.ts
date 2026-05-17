import * as Speech from "expo-speech";

let pendingTimer: ReturnType<typeof setTimeout> | null = null;

export function speak(text: string, rate: number = 0.9) {
  if (!text) return;

  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  Speech.stop();

  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    Speech.speak(text, {
      language: "es-ES",
      rate,
      pitch: 1,
    });
  }, 100);
}

export function stopSpeaking() {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  Speech.stop();
}
