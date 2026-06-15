// services/voiceCommandService.ts

export type VoiceCommand =
  | "activate"
  | "deactivate"
  | "camera"
  | "settings"
  | "history"
  | "home"
  | "back"
  | "help"
  | "unknown";

type CommandAliases = Record<
  Exclude<VoiceCommand, "unknown">,
  readonly string[]
>;

const COMMAND_ALIASES: CommandAliases = {
  deactivate: [
    "desactivar voz",
    "apagar voz",
    "desactivar asistente",
    "apagar asistente",
    "detener asistente",
    "cerrar asistente",
    "deja de escuchar",
    "dejar de escuchar",
    "silencio",
  ],

  activate: [
    "activar voz",
    "encender voz",
    "activar asistente",
    "encender asistente",
    "iniciar asistente",
  ],

  camera: [
    "camara",
    "camera",
    "abrir camara",
    "abre la camara",
    "ir a camara",
    "ir a la camara",
    "ve a la camara",
    "mostrar camara",
    "escanear",
    "iniciar escaneo",
  ],

  settings: [
    "configuracion",
    "configurar",
    "ajustes",
    "settings",
    "abrir configuracion",
    "abre configuracion",
    "ir a configuracion",
    "ir a ajustes",
  ],

  history: [
    "historial",
    "abrir historial",
    "abre el historial",
    "ir al historial",
    "resultados anteriores",
    "ver historial",
  ],

  home: [
    "inicio",
    "home",
    "ir al inicio",
    "volver al inicio",
    "pantalla principal",
    "menu principal",
  ],

  back: [
    "atras",
    "volver",
    "regresar",
    "volver atras",
    "regresa",
    "pantalla anterior",
  ],

  help: [
    "ayuda",
    "comandos",
    "que puedes hacer",
    "que puedo decir",
    "mostrar comandos",
    "dime los comandos",
    "opciones",
  ],
};

const COMMAND_ORDER: Exclude<VoiceCommand, "unknown">[] = [
  // Los comandos específicos deben evaluarse primero.
  "deactivate",
  "activate",
  "settings",
  "history",
  "camera",
  "home",
  "back",
  "help",
];

export function normalizeVoiceText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:_\-"'()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAlias(text: string, alias: string): boolean {
  const paddedText = ` ${text} `;
  const paddedAlias = ` ${alias} `;

  return paddedText.includes(paddedAlias);
}

export function parseCommand(text: string): VoiceCommand {
  const normalizedText = normalizeVoiceText(text);

  // Mantiene la característica solicitada para las pruebas.
  console.log("TRANSCRIBED:", normalizedText);

  for (const command of COMMAND_ORDER) {
    const aliases = COMMAND_ALIASES[command];

    if (aliases.some((alias) => containsAlias(normalizedText, alias))) {
      console.log("COMMAND DETECTED:", command);
      return command;
    }
  }

  console.log("COMMAND DETECTED: unknown");
  return "unknown";
}
