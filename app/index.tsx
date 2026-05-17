import AccessibleText from "@/components/AccessibleText";
import { AccessibleButton, AppScreen } from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

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

        <AccessibleText variant="body" centered>
          Bienvenido. Di iniciar o toca dos veces la pantalla.
        </AccessibleText>

        <AccessibleText variant="title" bold centered>
          Visión IA Accesible
        </AccessibleText>

        <AccessibleText variant="body" muted centered>
          Reconocimiento de objetos y lectura de texto guiado por voz
        </AccessibleText>

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
    lineHeight: 70,
  },
});
