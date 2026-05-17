import { AccessibilityProvider } from "@/contexts/AccesibilityContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#050505",
            },
          }}
        />
      </>
    </AccessibilityProvider>
  );
}
