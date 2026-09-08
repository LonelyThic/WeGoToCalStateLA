import React from "react";
import { Stack } from "expo-router";
import WebLayout from "../../components/WebLayout"; 
import { ThreadsProvider } from "./threadStore";

export default function ThreadsLayout() {
  return (
    <ThreadsProvider>
      <WebLayout>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="feed" />
          <Stack.Screen name="composer" />
          <Stack.Screen name="detail" />
        </Stack>
      </WebLayout>
    </ThreadsProvider>
  );
}
