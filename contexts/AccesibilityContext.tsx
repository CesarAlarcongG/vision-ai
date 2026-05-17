import React, { createContext, useContext, useMemo, useState } from "react";

type AccessibilityContextType = {
  fontScale: number;
  setFontScale: React.Dispatch<React.SetStateAction<number>>;

  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;

  voiceEnabled: boolean;
  setVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  simplifiedMode: boolean;
  setSimplifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontScale, setFontScale] = useState(1.1);

  const [highContrast, setHighContrast] = useState(true);

  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [simplifiedMode, setSimplifiedMode] = useState(false);

  const value = useMemo(
    () => ({
      fontScale,
      setFontScale,

      highContrast,
      setHighContrast,

      voiceEnabled,
      setVoiceEnabled,

      simplifiedMode,
      setSimplifiedMode,
    }),
    [fontScale, highContrast, voiceEnabled, simplifiedMode]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility debe usarse dentro de AccessibilityProvider"
    );
  }

  return context;
}
