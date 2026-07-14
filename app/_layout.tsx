// app/_layout.tsx

import { AccessibilityProvider } from "@/contexts/AccesibilityContext";
import { VoiceAssistantProvider } from "@/contexts/VoiceAssistantContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AccessibilityProvider>
        <VoiceAssistantProvider>
          <StatusBar style="light" />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#050505",
              },
            }}
          />
        </VoiceAssistantProvider>
      </AccessibilityProvider>
    </GestureHandlerRootView>
  );
}
