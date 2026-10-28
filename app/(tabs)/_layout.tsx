import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Student Directory",
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="add-student"
        options={{
          title: "Add Student",
          href: null,
          headerShown: true,
          headerTitle: "Join the Directory",
        }}
      />
    </Tabs>
  );
}