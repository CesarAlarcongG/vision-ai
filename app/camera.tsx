import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef } from "react";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      if (!photo?.uri) return;

      router.push({
        pathname: "/processing",
        params: {
          imageUri: String(photo.uri),
        },
      });
    } catch (error) {
      console.log("Error taking photo:", error);
    }
  };

  if (!permission) return <View />;

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Objeto casi centrado. Acerca un poco más el objeto." />

      <Card style={styles.cameraBox}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        <View style={styles.overlay}>
          <AccessibleText variant="small" bold style={styles.badge}>
            Objeto centrado
          </AccessibleText>

          <View style={styles.target}>
            <View style={styles.circle} />
            <View style={styles.verticalLine} />
            <View style={styles.horizontalLine} />
          </View>
        </View>
      </Card>

      <Card style={styles.helperCard}>
        <AccessibleText variant="body" bold>
          ✓ Vibración correcta: encuadre correcto
        </AccessibleText>
        <AccessibleText variant="body" bold>
          ✓ Captura automática cuando la imagen esté estable.
        </AccessibleText>
      </Card>

      <AccessibleButton
        label="Tomar foto"
        hint="Captura imagen y envía a procesamiento"
        onPress={takePhoto}
      />
    </AppScreen>
  );
}

const CAMERA_PADDING = spacing.md;

const styles = StyleSheet.create({
  cameraBox: {
    minHeight: 410,
    overflow: "hidden",
    padding: CAMERA_PADDING,
    position: "relative",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: CAMERA_PADDING,
  },
  badge: {
    position: "absolute",
    top: 30,
    left: 30,
    color: colors.darkText,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    overflow: "hidden",
  },
  target: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#fff",
  },
  verticalLine: {
    position: "absolute",
    width: 2,
    height: 260,
    backgroundColor: "#fff",
  },
  horizontalLine: {
    position: "absolute",
    height: 2,
    width: 260,
    backgroundColor: "#fff",
  },
  helperCard: {
    gap: spacing.sm,
  },
});
