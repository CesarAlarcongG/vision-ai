import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
    AccessibleButton,
    AppScreen,
    Card,
    TopBar,
    VoiceBanner,
} from "../components/AccessibleUI";
import { colors, spacing } from "../constants/theme";

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
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.title}>Escanear ahora</Text>
          <Text style={styles.subtitle}>
            Toda la pantalla funciona como botón principal
          </Text>
          <Text style={styles.command}>Di: abrir cámara</Text>
          <Text style={styles.command}>Mantener: asistente</Text>
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
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  command: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
});
