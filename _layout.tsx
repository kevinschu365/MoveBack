import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/src/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: colors.primary,
            fontWeight: "700",
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="training/[id]"
          options={{ title: "Training Detail", presentation: "card" }}
        />
      </Stack>
    </>
  );
}
