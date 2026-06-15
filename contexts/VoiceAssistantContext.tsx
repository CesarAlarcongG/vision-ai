// contexts/VoiceAssistantContext.tsx

import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak, stopSpeaking } from "@/services/speech";
import {
    parseCommand,
    VoiceCommand,
} from "@/services/voiceCommandService";

import { router, usePathname } from "expo-router";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
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

    // El ref permite consultar inmediatamente el estado actualizado
    // dentro de callbacks de Speech y WebView.
    const activeRef = useRef(false);
    const pendingCommandRef = useRef<VoiceCommand | null>(null);
    const pendingErrorRef = useRef<string | null>(null);
    const processingFinalResultRef = useRef(false);
    const recognitionRunningRef = useRef(false);
    const startingRecognitionRef = useRef(false);

    const startListening = useCallback(async () => {
        console.log("START LISTENING CALLED");

        if (!activeRef.current) {
            console.log("VOICE START CANCELLED: assistant inactive");
            return;
        }

        if (
            startingRecognitionRef.current ||
            recognitionRunningRef.current
        ) {
            console.log(
                "VOICE START CANCELLED: recognition already active"
            );
            return;
        }

        startingRecognitionRef.current = true;

        try {
            const available =
                ExpoSpeechRecognitionModule.isRecognitionAvailable();

            console.log(
                "VOICE RECOGNITION AVAILABLE:",
                available
            );

            try {
                console.log(
                    "VOICE RECOGNITION SERVICES:",
                    ExpoSpeechRecognitionModule
                        .getSpeechRecognitionServices()
                );
            } catch (serviceError) {
                console.log(
                    "VOICE SERVICES CHECK ERROR:",
                    serviceError
                );
            }

            if (!available) {
                activeRef.current = false;
                setIsVoiceAssistantActive(false);
                setIsListening(false);

                speak(
                    "El reconocimiento de voz no está disponible en este dispositivo.",
                    voiceRateValue
                );

                return;
            }

            const permission =
                await ExpoSpeechRecognitionModule
                    .requestPermissionsAsync();

            console.log("VOICE PERMISSION:", permission);

            if (!permission.granted) {
                activeRef.current = false;
                setIsVoiceAssistantActive(false);
                setIsListening(false);

                speak(
                    "Necesito permiso para utilizar el micrófono.",
                    voiceRateValue
                );

                return;
            }

            pendingCommandRef.current = null;
            pendingErrorRef.current = null;
            processingFinalResultRef.current = false;

            console.log("VOICE START REQUESTED");

            ExpoSpeechRecognitionModule.start({
                lang: "es-PE",
                interimResults: true,
                continuous: false,
                maxAlternatives: 3,

                androidIntentOptions: {
                    EXTRA_LANGUAGE_MODEL: "web_search",
                },

                volumeChangeEventOptions: {
                    enabled: true,
                    intervalMillis: 500,
                },
            });
        } catch (error) {
            console.log("VOICE START ERROR:", error);

            setIsListening(false);
            activeRef.current = false;
            setIsVoiceAssistantActive(false);

            speak(
                "No pude iniciar el reconocimiento de voz.",
                voiceRateValue
            );
        } finally {
            startingRecognitionRef.current = false;
        }
    }, [voiceRateValue]);

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

            pendingCommandRef.current = null;
            pendingErrorRef.current = null;
            processingFinalResultRef.current = false;

            setIsVoiceAssistantActive(false);
            setIsListening(false);
            setLastTranscript("");

            if (recognitionRunningRef.current) {
                try {
                    console.log("VOICE: aborting active recognition");

                    ExpoSpeechRecognitionModule.abort();
                } catch (error) {
                    console.log("VOICE ABORT ERROR:", error);
                }
            } else {
                console.log(
                    "VOICE: recognition was not running; abort skipped"
                );
            }

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
            console.log("VOICE STATUS: already enabled");
            return;
        }

        console.log("VOICE STATUS: enabled");

        activeRef.current = true;

        setIsVoiceAssistantActive(true);
        setIsListening(false);
        setLastTranscript("");

        stopSpeaking();

        console.log("ASSISTANT: preparing activation message");

        speak(
            "Asistente de voz activado. ¿En qué te puedo ayudar?",
            voiceRateValue,
            {
                onStart: () => {
                    console.log("ASSISTANT ACTIVATION SPEECH: start");
                },

                onDone: () => {
                    console.log("ASSISTANT ACTIVATION SPEECH: done");

                    setTimeout(() => {
                        if (!activeRef.current) {
                            console.log(
                                "VOICE START CANCELLED: assistant was disabled"
                            );
                            return;
                        }

                        console.log(
                            "ASSISTANT: starting recognition after speech"
                        );

                        void startListening();
                    }, 300);
                },

                onStopped: () => {
                    console.log(
                        "ASSISTANT ACTIVATION SPEECH: stopped"
                    );
                },

                onError: (error) => {
                    console.log(
                        "ASSISTANT ACTIVATION SPEECH ERROR:",
                        error
                    );

                    setTimeout(() => {
                        if (activeRef.current) {
                            void startListening();
                        }
                    }, 300);
                },
            }
        );
    }, [startListening, voiceRateValue]);

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
                    respondAndContinue(
                        "El asistente se ha desactivado."
                    );
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

    useSpeechRecognitionEvent("start", () => {
        console.log("VOICE EVENT: start");

        recognitionRunningRef.current = true;
        setIsListening(true);
    });

    useSpeechRecognitionEvent("audiostart", () => {
        console.log("VOICE EVENT: audiostart");
    });

    useSpeechRecognitionEvent("speechstart", () => {
        console.log("VOICE EVENT: speechstart");
    });

    useSpeechRecognitionEvent("volumechange", (event) => {
        console.log("VOICE VOLUME:", event.value);
    });

    useSpeechRecognitionEvent("result", (event) => {
        const transcript =
            event.results?.[0]?.transcript?.trim() ?? "";

        console.log(
            event.isFinal ? "RAW TEXT:" : "RAW PARTIAL:",
            transcript
        );

        console.log(
            "VOICE ALTERNATIVES:",
            event.results
        );

        if (
            !event.isFinal ||
            !transcript ||
            processingFinalResultRef.current
        ) {
            return;
        }

        processingFinalResultRef.current = true;

        setLastTranscript(transcript);

        const command = parseCommand(transcript);

        console.log("FINAL COMMAND:", command);

        pendingCommandRef.current = command;
    });

    useSpeechRecognitionEvent("error", (event) => {
        console.log("VOICE EVENT ERROR:", {
            error: event.error,
            message: event.message,
            code: event.code,
        });

        setIsListening(false);

        if (!activeRef.current) {
            return;
        }

        if (
            event.error === "no-speech" ||
            event.error === "speech-timeout"
        ) {
            pendingErrorRef.current =
                "No pude escucharte. Intenta nuevamente.";

            return;
        }

        if (event.error === "aborted") {
            return;
        }

        if (event.error === "not-allowed") {
            pendingErrorRef.current =
                "No tengo permiso para utilizar el micrófono.";

            return;
        }

        if (event.error === "network") {
            pendingErrorRef.current =
                "No se pudo utilizar el reconocimiento de voz por un problema de conexión.";

            return;
        }

        pendingErrorRef.current =
            "Ocurrió un problema al reconocer la voz. Intenta nuevamente.";
    });

    useSpeechRecognitionEvent("end", () => {
        console.log("VOICE EVENT: end");

        recognitionRunningRef.current = false;
        setIsListening(false);

        const command = pendingCommandRef.current;
        const errorMessage = pendingErrorRef.current;

        pendingCommandRef.current = null;
        pendingErrorRef.current = null;
        processingFinalResultRef.current = false;

        if (!activeRef.current) {
            return;
        }

        if (command) {
            executeCommand(command);
            return;
        }

        if (errorMessage) {
            respondAndContinue(errorMessage);
            return;
        }

        respondAndContinue(
            "No pude identificar un comando. Intenta nuevamente."
        );
    });

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
