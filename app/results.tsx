import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

export default function ResultsScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Es una botella de agua sobre una mesa. Hay texto en la etiqueta." />

      <Card style={styles.resultCard}>
        <AccessibleText variant="caption" muted bold style={styles.label}>
          RESULTADO INTELIGENTE
        </AccessibleText>

        <AccessibleText variant="subtitle" bold>
          Botella de agua sobre una mesa
        </AccessibleText>

        <AccessibleText variant="body">
          Detecté una botella transparente con etiqueta clara. También hay texto
          legible: Agua natural. El objeto está a una distancia segura y bien
          iluminado.
        </AccessibleText>
      </Card>

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
          variant="secondary"
          onPress={() => Alert.alert("Voz", "Repitiendo resultado por voz.")}
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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
});
