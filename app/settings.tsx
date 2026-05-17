import AccessibleText from "@/components/AccessibleText";
import {
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const {
    voiceEnabled,
    setVoiceEnabled,
    highContrast,
    setHighContrast,
    simplifiedMode,
    setSimplifiedMode,
    fontScale,
    setFontScale,
  } = useAccessibility();

  const [autoReturn, setAutoReturn] = useState(false);

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.replace("/settings")}
      />

      <VoiceBanner text="Configuración accesible. Cada opción se lee automáticamente." />

      <AccessibleText variant="title" bold>
        Configuración accesible
      </AccessibleText>

      <AccessibleText variant="body" muted>
        Modo básico recomendado, navegación por voz.
      </AccessibleText>

      <OptionRow label="Idioma" value="Español (ES)" />
      <OptionRow label="Velocidad de voz" value="Normal" />

      {/* Control de tamaño de texto */}
      <Card style={styles.fontCard}>
        <AccessibleText variant="body" bold>
          Tamaño de texto
        </AccessibleText>

        <View style={styles.fontControls}>
          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => setFontScale((prev) => Math.max(0.8, prev - 0.1))}
            accessibilityLabel="Reducir tamaño de texto"
          >
            <AccessibleText variant="button" bold style={styles.fontButtonText}>
              A-
            </AccessibleText>
          </TouchableOpacity>

          <AccessibleText variant="body" bold style={styles.fontValue}>
            {Math.round(fontScale * 100)}%
          </AccessibleText>

          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => setFontScale((prev) => Math.min(1.8, prev + 0.1))}
            accessibilityLabel="Aumentar tamaño de texto"
          >
            <AccessibleText variant="button" bold style={styles.fontButtonText}>
              A+
            </AccessibleText>
          </TouchableOpacity>
        </View>
      </Card>

      <SwitchRow
        label="Alto contraste"
        value={highContrast}
        onValueChange={setHighContrast}
      />
      <SwitchRow
        label="Modo simplificado"
        value={simplifiedMode}
        onValueChange={setSimplifiedMode}
      />
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
        <AccessibleText variant="subtitle" bold style={styles.dualTitle}>
          Modo dual
        </AccessibleText>
        <AccessibleText variant="body" style={styles.dualText}>
          Básico activo. El modo avanzado queda disponible para ajustar la
          detección, resumen y lectura extendida.
        </AccessibleText>
      </Card>
    </AppScreen>
  );
}

function OptionRow({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.rowCard}>
      <AccessibleText variant="body" bold style={styles.rowLabel}>
        {label}
      </AccessibleText>
      <AccessibleText variant="body" muted>
        {value}
      </AccessibleText>
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
      <AccessibleText variant="body" bold style={styles.rowLabel}>
        {label}
      </AccessibleText>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onValueChange}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  rowCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  rowLabel: {
    flex: 1,
  },
  dualCard: {
    backgroundColor: colors.text,
  },
  dualTitle: {
    color: colors.darkText,
    marginBottom: spacing.sm,
  },
  dualText: {
    color: colors.darkText,
    lineHeight: 24,
  },
  fontButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  fontButtonText: {
    color: colors.text,
  },
  fontValue: {
    flex: 1,
    textAlign: "center",
  },
  fontCard: {
    gap: spacing.sm,
  },

  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
