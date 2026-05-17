import { colors, radius, spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { lightHaptic } from "@/services/haptics";
import { speak, stopSpeaking } from "@/services/speech";
import { ReactNode, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccessibleText from "./AccessibleText";

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  const { highContrast } = useAccessibility();

  const bg = highContrast ? "#000000" : colors.background;

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={[styles.content, styles.full]}>{children}</View>
    </SafeAreaView>
  );
}

type AccessibleButtonProps = {
  label: string;
  onPress: () => void;
  hint?: string;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function AccessibleButton({
  label,
  onPress,
  hint,
  variant = "primary",
  style,
  textStyle,
}: AccessibleButtonProps) {
  const { fontScale, highContrast, hapticsEnabled } = useAccessibility();

  const primaryBg = highContrast ? "#FFFFFF" : colors.accent;
  const primaryText = highContrast ? "#000000" : colors.darkText;
  const secondaryBg = highContrast ? "#000000" : colors.surfaceSoft;
  const secondaryBorder = highContrast ? "#FFFFFF" : colors.border;

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={async () => {
        if (hapticsEnabled) await lightHaptic();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: primaryBg },
        variant === "secondary" && {
          backgroundColor: secondaryBg,
          borderWidth: highContrast ? 2 : 1,
          borderColor: secondaryBorder,
        },
        variant === "danger" && styles.dangerButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && { color: primaryText },
          variant === "secondary" && {
            color: highContrast ? "#FFFFFF" : colors.text,
          },
          { fontSize: 17 * fontScale },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type VoiceBannerProps = {
  text: string;
};

export function VoiceBanner({ text }: VoiceBannerProps) {
  const { voiceEnabled, voiceRateValue, highContrast } = useAccessibility();

  useEffect(() => {
    if (!voiceEnabled) return;

    stopSpeaking();

    const timer = setTimeout(() => {
      speak(text, voiceRateValue);
    }, 300);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, voiceEnabled]);

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      style={[
        styles.container,
        highContrast && {
          backgroundColor: "#000000",
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
      ]}
    >
      <AccessibleText variant="body" bold>
        🔊 {text}
      </AccessibleText>
    </View>
  );
}

export function TopBar({
  onHome,
  onSettings,
}: {
  onHome?: () => void;
  onSettings?: () => void;
}) {
  const { fontScale, highContrast, hapticsEnabled } = useAccessibility();

  const iconBg = highContrast ? "#000000" : colors.surface;
  const iconBorder = highContrast ? "#FFFFFF" : colors.border;
  const iconBorderWidth = highContrast ? 2 : 1;

  return (
    <View style={styles.topBar}>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Ir al inicio"
        onPress={async () => {
          if (hapticsEnabled) await lightHaptic();
          onHome?.();
        }}
        style={[
          styles.iconButton,
          {
            backgroundColor: iconBg,
            borderColor: iconBorder,
            borderWidth: iconBorderWidth,
          },
        ]}
      >
        <Text style={styles.iconText}>⌂</Text>
      </Pressable>

      <Text style={[styles.voiceStatus, { fontSize: 16 * fontScale }]}>
        Voz activa
      </Text>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Abrir configuración"
        onPress={async () => {
          if (hapticsEnabled) await lightHaptic();
          onSettings?.();
        }}
        style={[
          styles.iconButton,
          {
            backgroundColor: iconBg,
            borderColor: iconBorder,
            borderWidth: iconBorderWidth,
          },
        ]}
      >
        <Text style={styles.iconText}>⚙</Text>
      </Pressable>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const { highContrast } = useAccessibility();

  return (
    <View
      style={[
        styles.card,
        highContrast && {
          backgroundColor: "#000000",
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  full: {
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  iconText: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  voiceStatus: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "center",
  },
  button: {
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dangerButton: {
    backgroundColor: "#2A1010",
    borderWidth: 1,
    borderColor: "#5A2020",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  primaryButtonText: {
    color: colors.darkText,
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
  },
});
