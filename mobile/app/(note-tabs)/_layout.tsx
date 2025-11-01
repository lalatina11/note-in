import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="[id]"
        options={{
          title: "Note Tabs",
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
}
