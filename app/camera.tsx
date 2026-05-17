import {
    AccessibleButton,
    AppScreen,
    Card,
    TopBar,
    VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function CameraScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Objeto casi centrado. Acerca un poco más el objeto." />

      <Card style={styles.cameraBox}>
        <Text style={styles.badge}>Objeto centrado</Text>

        <View style={styles.target}>
          <View style={styles.circle} />
          <View style={styles.verticalLine} />
          <View style={styles.horizontalLine} />
        </View>
      </Card>

      <Card>
        <Text style={styles.helper}>✓ Vibración correcta: encuadre correcto</Text>
        <Text style={styles.helper}>
          ✓ Captura automática cuando la imagen esté estable.
        </Text>
      </Card>

      <AccessibleButton
        label="Tomar foto"
        hint="Simula la captura de imagen y pasa a procesamiento"
        onPress={() => router.push("/processing")}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cameraBox: {
    minHeight: 410,
    justifyContent: "center",
    overflow: "hidden",
  },
  badge: {
    alignSelf: "flex-start",
    color: colors.darkText,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    fontWeight: "900",
    marginBottom: spacing.lg,
  },
  target: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: colors.text,
    opacity: 0.8,
  },
  verticalLine: {
    position: "absolute",
    width: 2,
    height: 260,
    backgroundColor: colors.border,
  },
  horizontalLine: {
    position: "absolute",
    height: 2,
    width: 260,
    backgroundColor: colors.border,
  },
  helper: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
});
