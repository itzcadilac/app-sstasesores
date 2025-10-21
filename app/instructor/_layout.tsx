import { Stack } from 'expo-router';
import React from 'react';

export default function InstructorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Dashboard Instructor',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
    </Stack>
  );
}
