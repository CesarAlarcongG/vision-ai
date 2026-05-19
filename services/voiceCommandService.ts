export type VoiceCommand = "camera" | "settings" | "home" | "unknown";

// ---------------- STATUS ----------------
let isListening = false;

export function getVoiceStatus() {
  return isListening;
}

export function setListening(value: boolean) {
  isListening = value;
}

// ---------------- PARSER ----------------
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parseCommand(text: string): VoiceCommand {
  const t = normalize(text);

  console.log("TRANSCRIBED:", t);

  if (t.includes("camara") || t.includes("abrir camara")) return "camera";
  if (t.includes("configuracion") || t.includes("ajustes")) return "settings";
  if (t.includes("inicio") || t.includes("home")) return "home";

  return "unknown";
}
