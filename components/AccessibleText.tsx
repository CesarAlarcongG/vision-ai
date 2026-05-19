import { colors } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

type Variant = "title" | "subtitle" | "body" | "small" | "caption" | "button";

type AccessibleTextProps = TextProps & {
  variant?: Variant;
  bold?: boolean;
  centered?: boolean;
  muted?: boolean;
  style?: StyleProp<TextStyle>;
};

export default function AccessibleText({
  children,
  variant = "body",
  bold = false,
  centered = false,
  muted = false,
  style,
  ...props
}: AccessibleTextProps) {
  const { fontScale, highContrast } = useAccessibility();

  const getFontSize = () => {
    switch (variant) {
      case "title":
        return 32 * fontScale;
      case "subtitle":
        return 24 * fontScale;
      case "body":
        return 17 * fontScale;
      case "small":
        return 15 * fontScale;
      case "caption":
        return 13 * fontScale;
      case "button":
        return 18 * fontScale;
      default:
        return 16 * fontScale;
    }
  };

  const fontSize = getFontSize();
  const lineHeight = fontSize * 1.35; // ← siempre mayor que fontSize

  return (
    <Text
      allowFontScaling={false} // ← desactivar: ya escalamos manualmente
      style={[
        {
          fontSize,
          lineHeight,
          color: muted
            ? highContrast
              ? "#BBBBBB"
              : colors.muted
            : highContrast
            ? "#FFFFFF"
            : colors.text,
          fontWeight: bold ? "900" : "600",
          textAlign: centered ? "center" : "left",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
