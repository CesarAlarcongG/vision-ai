import AccessibleText from "@/components/AccessibleText";
import {
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProcessingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/results");
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Procesando imagen. Mantén el teléfono estable." />

      <Card style={styles.card}>
        <View style={styles.processor}>
          <Text style={styles.processorIcon}>▦</Text>
        </View>

        <AccessibleText variant="subtitle" bold centered>
          Procesando Imagen
        </AccessibleText>

        <AccessibleText variant="body" muted centered>
          Analizando objetos, texto y nivel de iluminación
        </AccessibleText>

        <View style={styles.progressOuter}>
          <View style={styles.progressInner} />
        </View>

        <AccessibleText variant="small" muted centered>
          Vibración suave continua activa
        </AccessibleText>
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 520,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  processor: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  processorIcon: {
    color: colors.text,
    fontSize: 72,
    lineHeight: 84,
    fontWeight: "900",
    textAlign: "center",
  },
  progressOuter: {
    width: "90%",
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  progressInner: {
    width: "58%",
    height: "100%",
    backgroundColor: colors.text,
  },
});
