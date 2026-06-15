// app/_layout.tsx

import { AccessibilityProvider } from "@/contexts/AccesibilityContext";
import { VoiceAssistantProvider } from "@/contexts/VoiceAssistantContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <VoiceAssistantProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        <StatusBar style="light" />
      </VoiceAssistantProvider>
    </AccessibilityProvider>
  );
}
