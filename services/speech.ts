import * as Speech from "expo-speech";

let pendingTimer: ReturnType<typeof setTimeout> | null = null;

export async function speak(text: string) {
  if (!text) return;

  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }

  const speaking = await Speech.isSpeakingAsync();
  if (speaking) {
    Speech.stop();
  }

  pendingTimer = setTimeout(
    () => {
      pendingTimer = null;
      Speech.speak(text, {
        language: "es-ES",
        rate: 0.9,
        pitch: 1,
      });
    },
    speaking ? 150 : 0
  );
}

export function stopSpeaking() {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  Speech.stop();
}
