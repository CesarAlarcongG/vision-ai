// contexts/VoiceAssistantContext.tsx

import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak, stopSpeaking } from "@/services/speech";
import {
    parseCommand,
    VoiceCommand,
} from "@/services/voiceCommandService";

import { router, usePathname } from "expo-router";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

type VoiceAssistantContextType = {
  isVoiceAssistantActive: boolean;
  isListening: boolean;
  lastTranscript: string;
  activateVoiceAssistant: () => void;
  deactivateVoiceAssistant: (announce?: boolean) => void;
  toggleVoiceAssistant: () => void;
};

const VoiceAssistantContext =
  createContext<VoiceAssistantContextType | undefined>(undefined);

const RECOGNITION_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
</head>

<body>
<script>
  const sendMessage = (payload) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    sendMessage({
      type: "no-support"
    });
  } else {
    const recognition = new SpeechRecognition();

    recognition.lang = "es-PE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      sendMessage({
        type: "status",
        status: "listening"
      });
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript ?? "";

      sendMessage({
        type: "result",
        text: transcript
      });
    };

    recognition.onerror = (event) => {
      sendMessage({
        type: "error",
        error: event.error || "unknown"
      });
    };

    try {
      recognition.start();
    } catch (error) {
      sendMessage({
        type: "error",
        error: String(error)
      });
    }
  }
</script>
</body>
</html>
`;

type WebViewMessage =
  | {
      type: "status";
      status: string;
    }
  | {
      type: "result";
      text: string;
    }
  | {
      type: "error";
      error: string;
    }
  | {
      type: "no-support";
    };

export function VoiceAssistantProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const { voiceRateValue } = useAccessibility();

  const [isVoiceAssistantActive, setIsVoiceAssistantActive] =
    useState(false);

  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [recognitionKey, setRecognitionKey] = useState(0);

  // El ref permite consultar inmediatamente el estado actualizado
  // dentro de callbacks de Speech y WebView.
  const activeRef = useRef(false);

  const startListening = useCallback(() => {
    if (!activeRef.current) return;

    console.log("VOICE STATUS: listening");

    setIsListening(false);
    setRecognitionKey((previous) => previous + 1);

    // Da tiempo a desmontar el WebView anterior antes de crear otro.
    setTimeout(() => {
      if (activeRef.current) {
        setIsListening(true);
      }
    }, 150);
  }, []);

  const respondAndContinue = useCallback(
    (message: string) => {
      if (!activeRef.current) return;

      setIsListening(false);

      console.log("ASSISTANT RESPONSE:", message);

      speak(message, voiceRateValue, {
        onDone: () => {
          setTimeout(() => {
            if (activeRef.current) {
              startListening();
            }
          }, 300);
        },

        onError: (error) => {
          console.log("ASSISTANT SPEECH ERROR:", error);

          setTimeout(() => {
            if (activeRef.current) {
              startListening();
            }
          }, 300);
        },
      });
    },
    [startListening, voiceRateValue]
  );

  const deactivateVoiceAssistant = useCallback(
    (announce: boolean = true) => {
      console.log("VOICE STATUS: disabled");

      activeRef.current = false;

      setIsVoiceAssistantActive(false);
      setIsListening(false);
      setLastTranscript("");

      stopSpeaking();

      if (announce) {
        speak(
          "Asistente de voz desactivado.",
          voiceRateValue
        );
      }
    },
    [voiceRateValue]
  );

  const activateVoiceAssistant = useCallback(() => {
    if (activeRef.current) {
      respondAndContinue(
        "El asistente ya se encuentra activo."
      );
      return;
    }

    console.log("VOICE STATUS: enabled");

    activeRef.current = true;

    setIsVoiceAssistantActive(true);
    setIsListening(false);
    setLastTranscript("");

    stopSpeaking();

    speak(
      "Asistente de voz activado. ¿En qué te puedo ayudar?",
      voiceRateValue,
      {
        onDone: () => {
          setTimeout(startListening, 300);
        },

        onError: (error) => {
          console.log("ASSISTANT SPEECH ERROR:", error);
          setTimeout(startListening, 300);
        },
      }
    );
  }, [
    respondAndContinue,
    startListening,
    voiceRateValue,
  ]);

  const toggleVoiceAssistant = useCallback(() => {
    if (activeRef.current) {
      deactivateVoiceAssistant();
    } else {
      activateVoiceAssistant();
    }
  }, [
    activateVoiceAssistant,
    deactivateVoiceAssistant,
  ]);

  const executeCommand = useCallback(
    (command: VoiceCommand) => {
      switch (command) {
        case "deactivate":
          deactivateVoiceAssistant();
          return;

        case "activate":
          respondAndContinue(
            "El asistente ya está activo. Puedes decir cámara, historial, configuración, inicio, volver o ayuda."
          );
          return;

        case "camera":
          router.replace("/camera");
          respondAndContinue("Abriendo la cámara.");
          return;

        case "settings":
          router.replace("/settings");
          respondAndContinue(
            "Abriendo la configuración."
          );
          return;

        case "history":
          router.replace("/history");
          respondAndContinue("Abriendo el historial.");
          return;

        case "home":
          router.replace("/home");
          respondAndContinue("Volviendo al inicio.");
          return;

        case "back":
          if (pathname === "/home" || pathname === "/") {
            respondAndContinue(
              "Ya te encuentras en la pantalla principal."
            );
          } else {
            router.back();
            respondAndContinue(
              "Regresando a la pantalla anterior."
            );
          }
          return;

        case "help":
          respondAndContinue(
            "Puedes decir: abrir cámara, historial, configuración, ir al inicio, volver o desactivar voz."
          );
          return;

        default:
          respondAndContinue(
            "No entendí el comando. Puedes decir cámara, historial, configuración, inicio, volver, ayuda o desactivar voz."
          );
      }
    },
    [
      deactivateVoiceAssistant,
      pathname,
      respondAndContinue,
    ]
  );

  const processTranscript = useCallback(
    (voiceText: string) => {
      const safeText = voiceText.trim();

      // Mantiene el log solicitado para las pruebas.
      console.log("RAW TEXT:", safeText);

      setLastTranscript(safeText);
      setIsListening(false);

      const command = parseCommand(safeText);

      console.log("FINAL COMMAND:", command);

      executeCommand(command);
    },
    [executeCommand]
  );

  const handleWebViewMessage = useCallback(
    (rawMessage: string) => {
      let message: WebViewMessage;

      try {
        message = JSON.parse(rawMessage) as WebViewMessage;
      } catch (error) {
        console.log(
          "VOICE MESSAGE PARSE ERROR:",
          error
        );
        return;
      }

      if (message.type === "status") {
        console.log(
          "WEBVIEW VOICE STATUS:",
          message.status
        );
        return;
      }

      if (message.type === "result") {
        processTranscript(message.text);
        return;
      }

      if (message.type === "no-support") {
        console.log(
          "VOICE ERROR: SpeechRecognition no disponible"
        );

        deactivateVoiceAssistant(false);

        speak(
          "El reconocimiento de voz no está disponible en este dispositivo.",
          voiceRateValue
        );

        return;
      }

      if (message.type === "error") {
        console.log(
          "VOICE RECOGNITION ERROR:",
          message.error
        );

        setIsListening(false);

        if (
          message.error === "no-speech" ||
          message.error === "aborted"
        ) {
          respondAndContinue(
            "No pude escucharte. Intenta nuevamente."
          );
          return;
        }

        respondAndContinue(
          "Ocurrió un problema con el reconocimiento de voz. Intenta nuevamente."
        );
      }
    },
    [
      deactivateVoiceAssistant,
      processTranscript,
      respondAndContinue,
      voiceRateValue,
    ]
  );

  const contextValue = useMemo(
    () => ({
      isVoiceAssistantActive,
      isListening,
      lastTranscript,
      activateVoiceAssistant,
      deactivateVoiceAssistant,
      toggleVoiceAssistant,
    }),
    [
      activateVoiceAssistant,
      deactivateVoiceAssistant,
      isListening,
      isVoiceAssistantActive,
      lastTranscript,
      toggleVoiceAssistant,
    ]
  );

  return (
    <VoiceAssistantContext.Provider value={contextValue}>
      {children}

      <Modal
        visible={isListening}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() =>
          deactivateVoiceAssistant()
        }
      >
        <View style={styles.overlay}>
          <View style={styles.assistantCard}>
            <Text
              style={styles.title}
              accessibilityRole="header"
              accessibilityLiveRegion="polite"
            >
              🎤 Escuchando...
            </Text>

            <Text style={styles.description}>
              Di un comando como cámara, historial,
              configuración, inicio o desactivar voz.
            </Text>

            {lastTranscript ? (
              <Text style={styles.transcript}>
                Último comando: {lastTranscript}
              </Text>
            ) : null}

            <WebView
              key={recognitionKey}
              originWhitelist={["*"]}
              source={{ html: RECOGNITION_HTML }}
              javaScriptEnabled
              onMessage={(event) => {
                handleWebViewMessage(
                  event.nativeEvent.data
                );
              }}
              style={styles.hiddenWebView}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Desactivar asistente de voz"
              accessibilityHint="Detiene el reconocimiento de comandos"
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                deactivateVoiceAssistant()
              }
            >
              <Text style={styles.cancelText}>
                Desactivar voz
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(VoiceAssistantContext);

  if (!context) {
    throw new Error(
      "useVoiceAssistant debe utilizarse dentro de VoiceAssistantProvider"
    );
  }

  return context;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.82)",
    justifyContent: "center",
    padding: 24,
  },

  assistantCard: {
    backgroundColor: "#111111",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
  },

  transcript: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  hiddenWebView: {
    width: 2,
    height: 2,
    opacity: 0.01,
  },

  cancelButton: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  cancelText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
  },
});