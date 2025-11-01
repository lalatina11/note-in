import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="auth"
        options={{
          title: "Welcome to Note IN",
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
