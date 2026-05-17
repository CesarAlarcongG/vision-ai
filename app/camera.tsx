import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

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
        <AccessibleText variant="small" bold style={styles.badge}>
          Objeto centrado
        </AccessibleText>

        <View style={styles.target}>
          <View style={styles.circle} />
          <View style={styles.verticalLine} />
          <View style={styles.horizontalLine} />
        </View>
      </Card>

      <Card style={styles.helperCard}>
        <AccessibleText variant="body" bold>
          ✓ Vibración correcta: encuadre correcto
        </AccessibleText>
        <AccessibleText variant="body" bold>
          ✓ Captura automática cuando la imagen esté estable.
        </AccessibleText>
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
    marginBottom: spacing.lg,
    overflow: "hidden",
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
  helperCard: {
    gap: spacing.sm,
  },
});
