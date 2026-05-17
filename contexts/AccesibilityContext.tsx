import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type VoiceRate = "slow" | "normal" | "fast";

const VOICE_RATE_VALUES: Record<VoiceRate, number> = {
  slow: 0.6,
  normal: 0.9,
  fast: 1.3,
};

type AccessibilityContextType = {
  fontScale: number;
  setFontScale: React.Dispatch<React.SetStateAction<number>>;

  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;

  voiceEnabled: boolean;
  setVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  simplifiedMode: boolean;
  setSimplifiedMode: React.Dispatch<React.SetStateAction<boolean>>;

  voiceRate: VoiceRate;
  setVoiceRate: (rate: VoiceRate) => void;
  voiceRateValue: number; // el número real que usa expo-speech
};
const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

const STORAGE_KEY = "accessibility_voice_rate";

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontScale, setFontScale] = useState(1.1);
  const [highContrast, setHighContrast] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [voiceRate, setVoiceRateState] = useState<VoiceRate>("normal");

  // Cargar velocidad guardada al iniciar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "slow" || saved === "normal" || saved === "fast") {
        setVoiceRateState(saved);
      }
    });
  }, []);

  // Guardar cuando cambia
  const setVoiceRate = (rate: VoiceRate) => {
    setVoiceRateState(rate);
    AsyncStorage.setItem(STORAGE_KEY, rate);
  };

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
      voiceRate,
      setVoiceRate,
      voiceRateValue: VOICE_RATE_VALUES[voiceRate],
    }),
    [fontScale, highContrast, voiceEnabled, simplifiedMode, voiceRate]
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
