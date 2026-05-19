import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
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

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

const STORAGE_FONT_SCALE_KEY = "accessibility_font_scale";
const STORAGE_HIGH_CONTRAST_KEY = "accessibility_high_contrast";
const STORAGE_VOICE_ENABLED_KEY = "accessibility_voice_enabled";
const STORAGE_SIMPLIFIED_MODE_KEY = "accessibility_simplified_mode";
const STORAGE_RATE_KEY = "accessibility_voice_rate";
const STORAGE_HAPTICS_KEY = "accessibility_haptics";

function resolveStateAction<T>(
  value: React.SetStateAction<T>,
  previousValue: T
): T {
  return typeof value === "function"
    ? (value as (prev: T) => T)(previousValue)
    : value;
}

function parseStoredBoolean(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function isValidVoiceRate(value: string | null): value is VoiceRate {
  return value === "slow" || value === "normal" || value === "fast";
}

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontScale, setFontScaleState] = useState(1.1);
  const [highContrast, setHighContrastState] = useState(true);
  const [voiceEnabled, setVoiceEnabledState] = useState(true);
  const [simplifiedMode, setSimplifiedModeState] = useState(false);
  const [voiceRate, setVoiceRateState] = useState<VoiceRate>("normal");
  const [hapticsEnabled, setHapticsState] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedValues = await AsyncStorage.multiGet([
          STORAGE_FONT_SCALE_KEY,
          STORAGE_HIGH_CONTRAST_KEY,
          STORAGE_VOICE_ENABLED_KEY,
          STORAGE_SIMPLIFIED_MODE_KEY,
          STORAGE_RATE_KEY,
          STORAGE_HAPTICS_KEY,
        ]);

        const preferences = Object.fromEntries(savedValues);

        const savedFontScale = Number(preferences[STORAGE_FONT_SCALE_KEY]);
        if (!Number.isNaN(savedFontScale)) {
          const safeFontScale = Math.min(1.8, Math.max(0.8, savedFontScale));
          setFontScaleState(safeFontScale);
        }

        const savedHighContrast = parseStoredBoolean(
          preferences[STORAGE_HIGH_CONTRAST_KEY]
        );
        if (savedHighContrast !== null) {
          setHighContrastState(savedHighContrast);
        }

        const savedVoiceEnabled = parseStoredBoolean(
          preferences[STORAGE_VOICE_ENABLED_KEY]
        );
        if (savedVoiceEnabled !== null) {
          setVoiceEnabledState(savedVoiceEnabled);
        }

        const savedSimplifiedMode = parseStoredBoolean(
          preferences[STORAGE_SIMPLIFIED_MODE_KEY]
        );
        if (savedSimplifiedMode !== null) {
          setSimplifiedModeState(savedSimplifiedMode);
        }

        const savedVoiceRate = preferences[STORAGE_RATE_KEY];
        if (isValidVoiceRate(savedVoiceRate)) {
          setVoiceRateState(savedVoiceRate);
        }

        const savedHaptics = parseStoredBoolean(preferences[STORAGE_HAPTICS_KEY]);
        if (savedHaptics !== null) {
          setHapticsState(savedHaptics);
        }
      } catch (error) {
        console.log("Error loading accessibility preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  const setFontScale: React.Dispatch<React.SetStateAction<number>> =
    useCallback((value) => {
      setFontScaleState((previousValue) => {
        const nextValue = resolveStateAction(value, previousValue);
        const safeValue = Math.min(1.8, Math.max(0.8, nextValue));

        AsyncStorage.setItem(STORAGE_FONT_SCALE_KEY, String(safeValue)).catch(
          (error) => {
            console.log("Error saving font scale:", error);
          }
        );

        return safeValue;
      });
    }, []);

  const setHighContrast: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback((value) => {
      setHighContrastState((previousValue) => {
        const nextValue = resolveStateAction(value, previousValue);

        AsyncStorage.setItem(
          STORAGE_HIGH_CONTRAST_KEY,
          String(nextValue)
        ).catch((error) => {
          console.log("Error saving high contrast:", error);
        });

        return nextValue;
      });
    }, []);

  const setVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback((value) => {
      setVoiceEnabledState((previousValue) => {
        const nextValue = resolveStateAction(value, previousValue);

        AsyncStorage.setItem(
          STORAGE_VOICE_ENABLED_KEY,
          String(nextValue)
        ).catch((error) => {
          console.log("Error saving voice enabled:", error);
        });

        return nextValue;
      });
    }, []);

  const setSimplifiedMode: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback((value) => {
      setSimplifiedModeState((previousValue) => {
        const nextValue = resolveStateAction(value, previousValue);

        AsyncStorage.setItem(
          STORAGE_SIMPLIFIED_MODE_KEY,
          String(nextValue)
        ).catch((error) => {
          console.log("Error saving simplified mode:", error);
        });

        return nextValue;
      });
    }, []);

  const setVoiceRate = useCallback((rate: VoiceRate) => {
    setVoiceRateState(rate);

    AsyncStorage.setItem(STORAGE_RATE_KEY, rate).catch((error) => {
      console.log("Error saving voice rate:", error);
    });
  }, []);

  const setHapticsEnabled = useCallback((value: boolean) => {
    setHapticsState(value);

    AsyncStorage.setItem(STORAGE_HAPTICS_KEY, String(value)).catch((error) => {
      console.log("Error saving haptics:", error);
    });
  }, []);

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
      setFontScale,
      highContrast,
      setHighContrast,
      voiceEnabled,
      setVoiceEnabled,
      simplifiedMode,
      setSimplifiedMode,
      voiceRate,
      setVoiceRate,
      hapticsEnabled,
      setHapticsEnabled,
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
