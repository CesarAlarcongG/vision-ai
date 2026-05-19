import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak } from "@/services/speech";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { voiceEnabled, voiceRateValue } = useAccessibility();

  const handleStart = () => {
    if (voiceEnabled) {
      speak("Abriendo pantalla principal", voiceRateValue);
    }

    router.replace("/home");
  };

  return (
    <AppScreen scroll={false}>
      <VoiceBanner text="Bienvenido. Toque la pantalla para iniciar." />

      <TouchableOpacity
        style={styles.fullScreen}
        onPress={handleStart}
        activeOpacity={1}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Iniciar aplicación"
        accessibilityHint="Toca para abrir la pantalla principal"
      >
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Logo de Visión IA Accesible"
          style={styles.logo}
        >
          <Text style={styles.logoText}>👁</Text>
        </View>

        <AccessibleText variant="title" bold centered>
          Visión IA Accesible
        </AccessibleText>

        <AccessibleText variant="body" muted centered>
          Reconocimiento de objetos y lectura de texto guiado por voz
        </AccessibleText>

        <AccessibleButton
          label="Toca para Iniciar"
          hint="Abre la pantalla principal de la aplicación"
          onPress={handleStart}
          style={styles.button}
        />
      </TouchableOpacity>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    gap: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  logo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 58,
    lineHeight: 70,
  },
  button: {
    width: "100%",
  },
});
