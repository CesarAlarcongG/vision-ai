import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AccessibleButton, AppScreen } from "../components/AccessibleUI";
import { colors, spacing } from "../constants/theme";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <AppScreen scroll={false}>
      <View style={styles.container}>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Logo de Visión IA Accesible"
          style={styles.logo}
        >
          <Text style={styles.logoText}>👁</Text>
        </View>

        <Text style={styles.welcome}>
          Bienvenido. Di iniciar o toca dos veces la pantalla.
        </Text>

        <Text style={styles.title}>Visión IA Accesible</Text>

        <Text style={styles.subtitle}>
          Reconocimiento de objetos y lectura de texto guiado por voz
        </Text>

        <AccessibleButton
          label="Doble Toque para Iniciar"
          hint="Abre la pantalla principal de la aplicación"
          onPress={() => router.replace("/home")}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    alignItems: "center",
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
  },
  welcome: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
});
