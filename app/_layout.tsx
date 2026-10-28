import { Stack } from "expo-router";
import { StudentsProvider } from "../context/students-context";

export default function RootLayout() {
  return (
    <StudentsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </StudentsProvider>
  );
}