import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { WebView } from "react-native-webview";

import { parseCommand, setListening } from "@/services/voiceCommandService";

export default function VoiceScreen() {
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setListening(true);

    return () => {
      setListening(false);
    };
  }, []);

  const handleCancel = () => {
    setListening(false);
    router.back();
  };

  const handleResult = (voiceText: string) => {
    console.log("RAW TEXT:", voiceText);

    setProcessing(true);

    const command = parseCommand(voiceText);

    setProcessing(false);
    setListening(false);

    switch (command) {
      case "camera":
        router.replace("/camera");
        break;
      case "settings":
        router.replace("/settings");
        break;
      case "home":
        router.replace("/home");
        break;
      default:
        router.back();
    }
  };

  const SpeechWebView = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <script>
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

          if (!SpeechRecognition) {
            window.ReactNativeWebView.postMessage("NO_SUPPORT");
          } else {
            const recognition = new SpeechRecognition();
            recognition.lang = "es-ES";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
              const text = event.results[0][0].transcript;
              window.ReactNativeWebView.postMessage(text);
            };

            recognition.onerror = (e) => {
              window.ReactNativeWebView.postMessage("ERROR:" + e.error);
            };

            recognition.start();
          }
        </script>
      </body>
      </html>
    `;

    return (
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={(event) => {
          const msg = event.nativeEvent.data;

          if (msg === "NO_SUPPORT") {
            router.back();
            return;
          }

          handleResult(msg);
        }}
      />
    );
  };

  if (processing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Analizando voz...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 Di un comando...</Text>

      <View style={styles.wave}>
        <SpeechWebView />
      </View>

      <View style={styles.bottom}>
        <Pressable style={styles.cancel} onPress={handleCancel}>
          <Text style={styles.btnText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginTop: 60,
    fontWeight: "700",
  },

  wave: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 20,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },

  cancel: {
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
});
