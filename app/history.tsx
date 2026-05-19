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
import { Alert, StyleSheet, View } from "react-native";

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Historial de objetos y textos reconocidos." />

      <AccessibleText variant="title" bold>
        Historial
      </AccessibleText>

      <AccessibleText variant="body" muted>
        Reproduce por voz elementos reconocidos anteriormente.
      </AccessibleText>

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
        onPress={() =>
          Alert.alert("Historial", "Historial eliminado de forma simulada.")
        }
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
    <Card style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <AccessibleText variant="small" bold style={styles.badge}>
          {type}
        </AccessibleText>
        <AccessibleText variant="small" muted style={styles.time}>
          {time}
        </AccessibleText>
      </View>

      <AccessibleText variant="subtitle" bold>
        {title}
      </AccessibleText>

      <AccessibleText variant="body">{description}</AccessibleText>

      <AccessibleText variant="small" muted style={styles.command}>
        {command}
      </AccessibleText>
    </Card>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    gap: spacing.sm,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  badge: {
    color: colors.darkText,
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: "hidden",
  },
  time: {
    flexShrink: 1,
  },
  command: {
    marginTop: spacing.sm,
  },
});
