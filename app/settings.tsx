import AccessibleText from "@/components/AccessibleText";
import {
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak } from "@/services/speech";
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
    voiceRate,
    setVoiceRate,
    voiceRateValue,
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
      <Card style={styles.rateCard}>
        <AccessibleText variant="body" bold>
          Velocidad de voz
        </AccessibleText>
        <View style={styles.rateControls}>
          {(["slow", "normal", "fast"] as const).map((rate) => {
            const labels = { slow: "Lenta", normal: "Normal", fast: "Rápida" };
            const isActive = voiceRate === rate;
            return (
              <TouchableOpacity
                key={rate}
                style={[styles.rateButton, isActive && styles.rateButtonActive]}
                onPress={() => {
                  setVoiceRate(rate);
                  if (voiceEnabled)
                    speak(`Velocidad ${labels[rate]}`, voiceRateValue);
                }}
                accessibilityLabel={`Velocidad ${labels[rate]}`}
              >
                <AccessibleText
                  variant="small"
                  bold
                  style={isActive ? styles.rateTextActive : styles.rateText}
                >
                  {labels[rate]}
                </AccessibleText>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Control de tamaño de texto */}
      <Card style={styles.fontCard}>
        <AccessibleText variant="body" bold>
          Tamaño de texto
        </AccessibleText>

        <View style={styles.fontControls}>
          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => {
              setFontScale((prev) => {
                const next = Math.max(0.8, prev - 0.1);
                if (voiceEnabled)
                  speak(
                    `Texto al ${Math.round(next * 100)} por ciento`,
                    voiceRateValue
                  );
                return next;
              });
            }}
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
            onPress={() => {
              setFontScale((prev) => {
                const next = Math.min(1.8, prev + 0.1);
                if (voiceEnabled)
                  speak(
                    `Texto al ${Math.round(next * 100)} por ciento`,
                    voiceRateValue
                  );
                return next;
              });
            }}
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
        label="Narración por voz"
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
  const { voiceEnabled, voiceRateValue } = useAccessibility();

  const handleChange = (newValue: boolean) => {
    if (voiceEnabled) {
      speak(
        `${label} ${newValue ? "activado" : "desactivado"}`,
        voiceRateValue
      );
    }
    onValueChange(newValue);
  };

  return (
    <Card style={styles.rowCard}>
      <AccessibleText variant="body" bold style={styles.rowLabel}>
        {label}
      </AccessibleText>
      <Switch
        value={value}
        onValueChange={handleChange}
        accessibilityLabel={label}
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
  rateCard: {
    gap: spacing.sm,
  },
  rateControls: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  rateButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rateButtonActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  rateText: {
    color: colors.text,
  },
  rateTextActive: {
    color: colors.darkText,
  },
});
