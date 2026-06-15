import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
} from "@/components/AccessibleUI";

import SwipeHistoryCard from "@/components/SwipeHistoryCard";

import { spacing } from "@/constants/theme";
import { useAccessibility } from "@/contexts/AccesibilityContext";
import { speak } from "@/services/speech";

import {
  AnalysisHistoryItem,
  getHistory,
  deleteHistoryItem,
} from "@/services/historyStorage";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useEffect, useState } from "react";

import { Alert, StyleSheet, View } from "react-native";

export default function ResultsScreen() {
  const router = useRouter();

  const { description } = useLocalSearchParams<{
    description?: string;
  }>();

  const { voiceEnabled, voiceRateValue, simplifiedMode } = useAccessibility();

  const aiDescription =
    typeof description === "string"
      ? description
      : "No se pudo analizar la imagen.";

  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = history[currentIndex];

  const visibleDescription = currentItem?.description ?? aiDescription;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const goNext = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const deleteCurrent = async () => {
    if (!currentItem) return;

    await deleteHistoryItem(currentItem.id);

    const updatedHistory = await getHistory();

    setHistory(updatedHistory);

    if (currentIndex >= updatedHistory.length && updatedHistory.length > 0) {
      setCurrentIndex(updatedHistory.length - 1);
    }

    if (updatedHistory.length === 0) {
      setCurrentIndex(0);
    }
  };

  const handleRepeatResult = () => {
    if (!voiceEnabled) {
      Alert.alert(
        "Narración desactivada",
        "Activa la narración por voz en configuración para escuchar el resultado.",
      );

      return;
    }

    speak(visibleDescription, voiceRateValue);
  };

  useEffect(() => {
    if (!voiceEnabled) return;

    speak(visibleDescription, voiceRateValue);
  }, [visibleDescription, voiceEnabled, voiceRateValue]);

  return (
    <AppScreen>
      <View style={styles.containerAll}>
        <TopBar
          onHome={() => router.replace("/home")}
          onSettings={() => router.push("/settings")}
        />

        {simplifiedMode && (
          <Card style={styles.simplifiedNotice}>
            <AccessibleText variant="body" bold centered>
              Modo simplificado activo
            </AccessibleText>

            <AccessibleText variant="small" muted centered>
              Se muestran solo las acciones más importantes.
            </AccessibleText>
          </Card>
        )}

        {/* Contenedor flexible para centrar verticalmente la tarjeta de historial */}
        <View style={styles.centerContainer}>
          <SwipeHistoryCard
            onDelete={deleteCurrent}
            onRepeat={handleRepeatResult}
            onNext={goNext}
            onPrevious={goPrevious}
            currentCard={
              <Card style={styles.resultCard}>
                {!simplifiedMode && (
                  <AccessibleText
                    variant="caption"
                    muted
                    bold
                    style={styles.label}
                  >
                    RESULTADO INTELIGENTE
                  </AccessibleText>
                )}

                <AccessibleText
                  variant="subtitle"
                  bold
                  centered={simplifiedMode}
                >
                  Resultado del análisis
                </AccessibleText>

                <AccessibleText variant="body" centered={simplifiedMode}>
                  {visibleDescription}
                </AccessibleText>

                {history.length > 0 && (
                  <AccessibleText
                    variant="small"
                    muted
                    centered
                    style={styles.indexText}
                  >
                    {currentIndex + 1} de {history.length}
                  </AccessibleText>
                )}
              </Card>
            }
            nextCard={
              history[currentIndex + 1] ? (
                <Card style={styles.resultCard}>
                  <AccessibleText variant="subtitle" bold>
                    Siguiente análisis
                  </AccessibleText>

                  <AccessibleText variant="body">
                    {history[currentIndex + 1].description}
                  </AccessibleText>
                </Card>
              ) : undefined
            }
            previousCard={
              history[currentIndex - 1] ? (
                <Card style={styles.resultCard}>
                  <AccessibleText variant="subtitle" bold>
                    Análisis anterior
                  </AccessibleText>

                  <AccessibleText variant="body">
                    {history[currentIndex - 1].description}
                  </AccessibleText>
                </Card>
              ) : undefined
            }
          />
        </View>

        {simplifiedMode ? (
          <View>
            <AccessibleButton
              label="Repetir"
              hint="Lee nuevamente el resultado usando voz"
              variant="primary"
              onPress={handleRepeatResult}
              style={styles.fullButton}
            />

            <AccessibleButton
              label="Nueva Captura"
              hint="Abre la cámara para escanear otro objeto o texto"
              variant="secondary"
              onPress={() => router.replace("/camera")}
              style={styles.fullButton}
            />

            <AccessibleButton
              label="Inicio"
              hint="Regresa a la pantalla principal"
              variant="secondary"
              onPress={() => router.replace("/home")}
              style={styles.fullButton}
            />
          </View>
        ) : (
          <View>
            <AccessibleButton
              label="Nueva Captura"
              hint="Abre la cámara para analizar otra imagen"
              variant="secondary"
              onPress={() => router.replace("/camera")}
              style={styles.fullButton}
            />
          </View>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    justifyContent: "space-between",
  },

  simplifiedNotice: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  centerContainer: {
    justifyContent: "center",
    width: "100%",
  },

  resultCard: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },

  label: {
    letterSpacing: 1,
  },

  indexText: {
    marginTop: spacing.sm,
  },

  fullButton: {
    width: "100%",
  },
});
