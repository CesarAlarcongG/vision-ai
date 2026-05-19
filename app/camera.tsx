import AccessibleText from "@/components/AccessibleText";
import {
  AccessibleButton,
  AppScreen,
  Card,
  TopBar,
  VoiceBanner,
} from "@/components/AccessibleUI";
import { colors, spacing } from "@/constants/theme";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Linking, StyleSheet, View } from "react-native";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleRequestCameraPermission = () => {
    if (permission?.canAskAgain === false) {
      Linking.openSettings();
      return;
    }

    requestPermission();
  };

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

  if (!permission) {
    return (
      <AppScreen>
        <TopBar
          onHome={() => router.replace("/home")}
          onSettings={() => router.push("/settings")}
        />

        <VoiceBanner text="Verificando permiso de cámara." />

        <Card style={styles.permissionCard}>
          <AccessibleText variant="subtitle" bold centered>
            Verificando cámara
          </AccessibleText>

          <AccessibleText variant="body" centered>
            Estamos comprobando si la aplicación puede usar la cámara del
            dispositivo.
          </AccessibleText>
        </Card>
      </AppScreen>
    );
  }

  if (!permission.granted) {
    const permissionText =
      permission.canAskAgain === false
        ? "El permiso de cámara está bloqueado. Abre los ajustes del dispositivo para habilitarlo."
        : "La aplicación necesita permiso de cámara para reconocer objetos y leer texto.";

    return (
      <AppScreen>
        <TopBar
          onHome={() => router.replace("/home")}
          onSettings={() => router.push("/settings")}
        />

        <VoiceBanner text="La cámara está desactivada. Autoriza el permiso para escanear objetos y texto." />

        <Card style={styles.permissionCard}>
          <AccessibleText variant="subtitle" bold centered>
            Permiso de cámara requerido
          </AccessibleText>

          <AccessibleText variant="body" centered>
            {permissionText}
          </AccessibleText>
        </Card>

        <AccessibleButton
          label={permission.canAskAgain === false ? "Abrir ajustes" : "Permitir cámara"}
          hint={
            permission.canAskAgain === false
              ? "Abre los ajustes del dispositivo para habilitar la cámara"
              : "Solicita permiso para usar la cámara"
          }
          onPress={handleRequestCameraPermission}
        />

        <AccessibleButton
          label="Volver al inicio"
          variant="secondary"
          hint="Regresa a la pantalla principal"
          onPress={() => router.replace("/home")}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <TopBar
        onHome={() => router.replace("/home")}
        onSettings={() => router.push("/settings")}
      />

      <VoiceBanner text="Objeto casi centrado. Acerca un poco más el objeto." />

      <Card style={styles.cameraBox}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        <View style={styles.overlay} pointerEvents="none">
          <AccessibleText variant="small" bold style={styles.badge}>
            Objeto centrado
          </AccessibleText>

          <View
            style={styles.target}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
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
  permissionCard: {
    gap: spacing.md,
  },
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
