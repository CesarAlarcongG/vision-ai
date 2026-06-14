import AccessibleText from "@/components/AccessibleText";
import {
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";

import { colors, spacing } from "@/constants/theme";
import { successHaptic } from "@/services/haptics";
import { describeImage } from "@/services/visionAI";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function ProcessingScreen() {
  const router = useRouter();

  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

  const safeImageUri = typeof imageUri === "string" ? imageUri : null;

  useEffect(() => {
    const processImage = async () => {
      try {
        if (!safeImageUri) {
          router.replace("/results");
          return;
        }

        const base64 = await FileSystem.readAsStringAsync(safeImageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const description = await describeImage(base64);

        await successHaptic();

        router.replace({
          pathname: "/results",
          params: {
            imageUri: safeImageUri,
            description,
          },
        });
      } catch (error) {
        console.error("Error procesando imagen:", error);

        router.replace({
          pathname: "/results",
          params: {
            imageUri: safeImageUri ?? "",
            description: "No se pudo analizar la imagen correctamente.",
          },
        });
      }
    };

    processImage();
  }, [safeImageUri, router]);

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Procesando imagen. Mantén el teléfono estable." />

      <Card style={styles.card}>
        {safeImageUri && (
          <Image source={{ uri: safeImageUri }} style={styles.image} />
        )}
        {/*
        <View style={styles.processor}>
          <Text style={styles.processorIcon}>▦</Text>
        </View>*/}

        <AccessibleText variant="subtitle" bold centered>
          Procesando Imagen
        </AccessibleText>

        <AccessibleText variant="body" muted centered>
          Analizando objetos, texto y nivel de iluminación
        </AccessibleText>

        <View style={styles.progressOuter}>
          <View style={styles.progressInner} />
        </View>

        <AccessibleText variant="small" muted centered>
          Vibración suave continua activa
        </AccessibleText>
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 520,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },

  processor: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  processorIcon: {
    color: colors.text,
    fontSize: 72,
    lineHeight: 84,
    fontWeight: "900",
    textAlign: "center",
  },

  progressOuter: {
    width: "90%",
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: "hidden",
  },

  progressInner: {
    width: "58%",
    height: "100%",
    backgroundColor: colors.text,
  },
});
