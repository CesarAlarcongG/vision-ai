import AccessibleText from "@/components/AccessibleText";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "../components/AccessibleUI";
import { spacing } from "../constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Listo para escanear. Toca cualquier parte para abrir la cámara." />

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
        <Card style={styles.mainCard}>
          <AccessibleText centered style={styles.cameraIcon}>
            📷
          </AccessibleText>
          <AccessibleText variant="title" bold centered>
            Escanear ahora
          </AccessibleText>
          <AccessibleText variant="body">
            Toda la pantalla funciona como botón principal
          </AccessibleText>
          <AccessibleText variant="small" centered bold>
            Di: abrir cámara
          </AccessibleText>

          <AccessibleText variant="small" centered bold>
            Mantener: asistente
          </AccessibleText>
        </Card>
      </Pressable>

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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  cameraIcon: {
    fontSize: 74,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
});
