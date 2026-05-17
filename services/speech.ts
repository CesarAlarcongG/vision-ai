import * as Speech from "expo-speech";

export async function speak(text: string) {
  if (!text) return;

  Speech.stop();

  Speech.speak(text, {
    language: "es-ES",
    rate: 0.9,
    pitch: 1,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
