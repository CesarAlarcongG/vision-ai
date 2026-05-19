import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak } from "@/services/speech";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

const RESULT_SUMMARY =
  "Es una botella de agua sobre una mesa. Hay texto en la etiqueta.";

const RESULT_SUMMARY_SIMPLE =
  "Resultado listo. Detecté una botella de agua.";

const RESULT_TITLE = "Botella de agua sobre una mesa";

const RESULT_DESCRIPTION =
  "Detecté una botella transparente con etiqueta clara. También hay texto legible: Agua natural. El objeto está a una distancia segura y bien iluminado.";

const RESULT_DESCRIPTION_SIMPLE =
  "Detecté una botella de agua sobre una mesa. Hay texto en la etiqueta.";

export default function ResultsScreen() {
  const router = useRouter();
  const { voiceEnabled, voiceRateValue, simplifiedMode } = useAccessibility();

  const visibleSummary = simplifiedMode ? RESULT_SUMMARY_SIMPLE : RESULT_SUMMARY;
  const visibleDescription = simplifiedMode
    ? RESULT_DESCRIPTION_SIMPLE
    : RESULT_DESCRIPTION;

  const handleRepeatResult = () => {
    if (!voiceEnabled) {
      Alert.alert(
        "Narración desactivada",
        "Activa la narración por voz en configuración para escuchar el resultado."
      );
      return;
    }

    speak(`${RESULT_TITLE}. ${visibleDescription}`, voiceRateValue);
  };

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text={visibleSummary} />

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
          {RESULT_TITLE}
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
        <>
          <View style={styles.grid}>
            <AccessibleButton
              label="Más Detalles"
              variant="secondary"
              onPress={() =>
                Alert.alert("Más detalles", "Resultado ampliado simulado.")
              }
              style={styles.gridButton}
            />

            <AccessibleButton
              label="Repetir"
              hint="Lee nuevamente el resultado detectado usando voz"
              variant="secondary"
              onPress={handleRepeatResult}
              style={styles.gridButton}
            />

            <AccessibleButton
              label="Traducir"
              variant="secondary"
              onPress={() => Alert.alert("Traducir", "Traducción simulada.")}
              style={styles.gridButton}
            />

            <AccessibleButton
              label="Guardar"
              variant="secondary"
              onPress={() =>
                Alert.alert("Guardado", "Resultado guardado en historial.")
              }
              style={styles.gridButton}
            />
          </View>

          <View style={styles.bottomNav}>
            <AccessibleButton
              label="Nueva Captura"
              variant="secondary"
              onPress={() => router.replace("/camera")}
              style={styles.navButton}
            />

            <AccessibleButton
              label="Historial"
              variant="secondary"
              onPress={() => router.push("/history")}
              style={styles.navButton}
            />

            <AccessibleButton
              label="Inicio"
              variant="secondary"
              onPress={() => router.replace("/home")}
              style={styles.navButton}
            />
          </View>
        </>
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
