import { colors, radius, spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { ReactNode } from "react";
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

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
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
    <SafeAreaView style={styles.safe}>
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
  const { fontScale } = useAccessibility();

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        variant === "danger" && styles.dangerButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && styles.primaryButtonText,
          { fontSize: 17 * fontScale },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function VoiceBanner({ text }: { text: string }) {
  const { fontScale } = useAccessibility();

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Mensaje de voz: ${text}`}
      style={styles.voiceBanner}
    >
      <Text style={[styles.voiceIcon, { fontSize: 18 * fontScale }]}>◉</Text>
      <Text style={[styles.voiceText, { fontSize: 15 * fontScale }]}>
        {text}
      </Text>
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
  const { fontScale } = useAccessibility();
  const iconSize = Math.max(52, 52 * fontScale);

  return (
    <View style={styles.topBar}>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Ir al inicio"
        onPress={onHome}
        style={[
          styles.iconButton,
          { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
        ]}
      >
        <Text style={[styles.iconText, { fontSize: 26 * fontScale }]}>⌂</Text>
      </Pressable>

      <Text style={[styles.voiceStatus, { fontSize: 16 * fontScale }]}>
        Voz activa
      </Text>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Abrir configuración"
        onPress={onSettings}
        style={[
          styles.iconButton,
          { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
        ]}
      >
        <Text style={[styles.iconText, { fontSize: 26 * fontScale }]}>⚙</Text>
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
  return <View style={[styles.card, style]}>{children}</View>;
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
    flexWrap: "wrap",
    gap: spacing.sm,
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
  },
  iconText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  voiceStatus: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "center",
  },
  voiceBanner: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start", // ← flex-start para que el ícono no se estire
    gap: spacing.sm,
  },
  voiceIcon: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
  },
  voiceText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    flexWrap: "wrap",
  },
  button: {
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg, // ← padding en vez de minHeight fija
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
});
