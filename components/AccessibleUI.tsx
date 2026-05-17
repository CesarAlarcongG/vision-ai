import { colors, radius, spacing } from "@/constants/theme";
import { ReactNode } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
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
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function VoiceBanner({ text }: { text: string }) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Mensaje de voz: ${text}`}
      style={styles.voiceBanner}
    >
      <Text style={styles.voiceIcon}>◉</Text>
      <Text style={styles.voiceText}>{text}</Text>
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
  return (
    <View style={styles.topBar}>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Ir al inicio"
        onPress={onHome}
        style={styles.iconButton}
      >
        <Text style={styles.iconText}>⌂</Text>
      </Pressable>

      <Text style={styles.voiceStatus}>Voz activa</Text>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Abrir configuración"
        onPress={onSettings}
        style={styles.iconButton}
      >
        <Text style={styles.iconText}>⚙</Text>
      </Pressable>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
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
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  voiceBanner: {
    minHeight: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  voiceIcon: {
    color: colors.text,
    fontSize: 18,
  },
  voiceText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  button: {
    minHeight: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
