import {
    AccessibleButton,
    AppScreen,
    Card,
    TopBar,
    VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Historial de objetos y textos reconocidos." />

      <Text style={styles.title}>Historial</Text>

      <Text style={styles.subtitle}>
        Reproduce por voz elementos reconocidos anteriormente.
      </Text>

      <HistoryItem
        type="Objeto"
        time="Hoy, 10:24am"
        title="Botella de agua"
        description="Objeto centrado sobre una mesa. Etiqueta parcialmente visible."
        command="Di: leer Elemento 1"
      />

      <HistoryItem
        type="Texto"
        time="Hoy, 10:24am"
        title="Texto de Medicamento"
        description="Tomar una tableta cada 8 horas después de los alimentos."
        command="Di: leer Elemento 2"
      />

      <AccessibleButton
        label="Eliminar Historial"
        variant="danger"
        onPress={() => Alert.alert("Historial", "Historial eliminado de forma simulada.")}
      />
    </AppScreen>
  );
}

function HistoryItem({
  type,
  time,
  title,
  description,
  command,
}: {
  type: string;
  time: string;
  title: string;
  description: string;
  command: string;
}) {
  return (
    <Card>
      <View style={styles.itemHeader}>
        <Text style={styles.badge}>{type}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.command}>{command}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  badge: {
    color: colors.darkText,
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontWeight: "900",
  },
  time: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  itemTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  command: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700",
    marginTop: spacing.md,
  },
});
