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
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { simplifiedMode } = useAccessibility();

  const voiceMessage = simplifiedMode
    ? "Modo simplificado activo. Toca escanear ahora para abrir la cámara."
    : "Listo para escanear. Toca cualquier parte para abrir la cámara.";

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text={voiceMessage} />

      {simplifiedMode && (
        <Card style={styles.simplifiedNotice}>
          <AccessibleText variant="body" bold centered>
            Modo simplificado activo
          </AccessibleText>
          <AccessibleText variant="small" muted centered>
            Se muestran solo las acciones principales para facilitar el uso.
          </AccessibleText>
        </Card>
      )}

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Escanear ahora"
        accessibilityHint="Abre la cámara para reconocer objetos o leer texto"
        onPress={() => router.push("/camera")}
        onLongPress={() =>
          Alert.alert("Asistente", "Comando simulado: asistente activado.")
        }
      >
        <Card
          style={{
            ...styles.mainCard,
            ...(simplifiedMode ? styles.mainCardSimplified : {})
          }}
        >
          <Text
            accessible={false}
            importantForAccessibility="no"
            style={styles.cameraIcon}
          >
            📷
          </Text>

          <AccessibleText variant="title" bold centered>
            Escanear ahora
          </AccessibleText>

          {simplifiedMode ? (
            <AccessibleText variant="body" centered>
              Toca aquí para abrir la cámara.
            </AccessibleText>
          ) : (
            <>
              <AccessibleText variant="body" centered>
                Toda la pantalla funciona como botón principal
              </AccessibleText>

              <AccessibleText variant="small" centered bold>
                Di: abrir cámara
              </AccessibleText>

              <AccessibleText variant="small" centered bold>
                Mantener: asistente
              </AccessibleText>
            </>
          )}
        </Card>
      </Pressable>

      {simplifiedMode ? (
        <AccessibleButton
            label="Historial"
            hint="Abre el historial de resultados"
            variant="secondary"
            onPress={() => router.push("/history")}
            style={styles.fullButton}
          />
      ) : (
        <View style={styles.row}>
          <AccessibleButton
            label="Historial"
            variant="secondary"
            onPress={() => router.push("/history")}
            style={styles.half}
          />

          <AccessibleButton
            label="Configurar"
            variant="secondary"
            onPress={() => router.push("/settings")}
            style={styles.half}
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
  mainCard: {
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  mainCardSimplified: {
    minHeight: 460,
  },
  cameraIcon: {
    fontSize: 74,
    lineHeight: 90,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  fullButton: {
    width: "100%",
  },
});
