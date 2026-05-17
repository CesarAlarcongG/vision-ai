import {
    AppScreen,
    Card,
    TopBar,
    VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoReturn, setAutoReturn] = useState(false);

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.replace("/settings")}
      />

      <VoiceBanner text="Configuración accesible. Cada opción se lee automáticamente." />

      <Text style={styles.title}>Configuración accesible</Text>

      <Text style={styles.subtitle}>
        Modo básico recomendado, navegación por voz.
      </Text>

      <OptionRow label="Idioma" value="Español (ES)" />
      <OptionRow label="Velocidad de voz" value="Normal" />
      <SwitchRow
        label="Activación por voz"
        value={voiceEnabled}
        onValueChange={setVoiceEnabled}
      />
      <SwitchRow
        label="Retorno automático"
        value={autoReturn}
        onValueChange={setAutoReturn}
      />
      <OptionRow label="Sensibilidad de detección" value="Alta" />

      <Card style={styles.dualCard}>
        <Text style={styles.dualTitle}>Modo dual</Text>
        <Text style={styles.dualText}>
          Básico activo. El modo avanzado queda disponible para ajustar la
          detección, resumen y lectura extendida.
        </Text>
      </Card>
    </AppScreen>
  );
}

function OptionRow({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.rowCard}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </Card>
  );
}

function SwitchRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Card style={styles.rowCard}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onValueChange}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  rowCard: {
    minHeight: 74,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
  },
  rowValue: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "700",
  },
  dualCard: {
    backgroundColor: colors.text,
  },
  dualTitle: {
    color: colors.darkText,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  dualText: {
    color: colors.darkText,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
});
