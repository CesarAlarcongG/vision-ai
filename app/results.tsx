import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
} from "@/components/AccessibleUI";
import { spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak } from "@/services/speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function ResultsScreen() {
  const router = useRouter();
  const { description } = useLocalSearchParams<{
    description?: string;
  }>();
  const { voiceEnabled, voiceRateValue, simplifiedMode } = useAccessibility();
  const aiDescription =
    typeof description === "string"
      ? description
      : "No se pudo analizar la imagen.";

  const visibleDescription = aiDescription;

  const handleRepeatResult = () => {
    if (!voiceEnabled) {
      Alert.alert(
        "Narración desactivada",
        "Activa la narración por voz en configuración para escuchar el resultado."
      );
      return;
    }

    speak(`${visibleDescription}`, voiceRateValue);
  };

  useEffect(() => {
    if (!voiceEnabled) return;

    speak(aiDescription, voiceRateValue);
  }, [aiDescription, voiceEnabled, voiceRateValue]);

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      {simplifiedMode && (
        <Card style={styles.simplifiedNotice}>
          <AccessibleText variant="body" bold centered>
            Modo simplificado activo
          </AccessibleText>
          <AccessibleText variant="small" muted centered>
            Se muestran solo las acciones más importantes.
          </AccessibleText>
        </Card>
      )}

      <Card style={styles.resultCard}>
        {!simplifiedMode && (
          <AccessibleText variant="caption" muted bold style={styles.label}>
            RESULTADO INTELIGENTE
          </AccessibleText>
        )}

        <AccessibleText variant="subtitle" bold centered={simplifiedMode}>
          Resultado del análisis
        </AccessibleText>

        <AccessibleText variant="body" centered={simplifiedMode}>
          {visibleDescription}
        </AccessibleText>
      </Card>

      {simplifiedMode ? (
        <View style={styles.simpleActions}>
          <AccessibleButton
            label="Repetir"
            hint="Lee nuevamente el resultado usando voz"
            variant="primary"
            onPress={handleRepeatResult}
            style={styles.fullButton}
          />

          <AccessibleButton
            label="Nueva Captura"
            hint="Abre la cámara para escanear otro objeto o texto"
            variant="secondary"
            onPress={() => router.replace("/camera")}
            style={styles.fullButton}
          />

          <AccessibleButton
            label="Inicio"
            hint="Regresa a la pantalla principal"
            variant="secondary"
            onPress={() => router.replace("/home")}
            style={styles.fullButton}
          />
        </View>
      ) : (
        <View style={styles.simpleActions}>
          <AccessibleButton
            label="Repetir"
            hint="Lee nuevamente el resultado"
            variant="primary"
            onPress={handleRepeatResult}
            style={styles.fullButton}
          />

          <AccessibleButton
            label="Nueva Captura"
            hint="Abre la cámara para analizar otra imagen"
            variant="secondary"
            onPress={() => router.replace("/camera")}
            style={styles.fullButton}
          />
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  simplifiedNotice: {
    gap: spacing.xs,
  },
  resultCard: {
    gap: spacing.md,
  },
  label: {
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  gridButton: {
    width: "47%",
  },
  bottomNav: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  navButton: {
    flex: 1,
  },
  simpleActions: {
    gap: spacing.md,
  },
  fullButton: {
    width: "100%",
  },
});
