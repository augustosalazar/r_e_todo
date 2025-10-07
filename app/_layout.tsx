
import { darkTheme, lightTheme } from "@/theme/theme";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";


export default function RootLayout() {


  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  console.log("Current theme:", scheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

