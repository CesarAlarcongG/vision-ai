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
  voiceRateValue: number;

  hapticsEnabled: boolean;
  setHapticsEnabled: (value: boolean) => void;
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

const STORAGE_RATE_KEY = "accessibility_voice_rate";
const STORAGE_HAPTICS_KEY = "accessibility_haptics";

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
  const [hapticsEnabled, setHapticsState] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_RATE_KEY).then((saved) => {
      if (saved === "slow" || saved === "normal" || saved === "fast") {
        setVoiceRateState(saved);
      }
    });

    AsyncStorage.getItem(STORAGE_HAPTICS_KEY).then((saved) => {
      if (saved !== null) setHapticsState(saved === "true");
    });
  }, []);

  const setVoiceRate = (rate: VoiceRate) => {
    setVoiceRateState(rate);
    AsyncStorage.setItem(STORAGE_RATE_KEY, rate);
  };

  const setHapticsEnabled = (value: boolean) => {
    setHapticsState(value);
    AsyncStorage.setItem(STORAGE_HAPTICS_KEY, String(value));
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
      hapticsEnabled,
      setHapticsEnabled,
    }),
    [
      fontScale,
      highContrast,
      voiceEnabled,
      simplifiedMode,
      voiceRate,
      hapticsEnabled,
    ]
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
