import { Stack } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import AuthProviderContext from "@/components/providers/AuthProviderContext";
import AuthGuard from "@/components/providers/AuthGuard";

export default function RootLayout() {
  const client = new QueryClient();
  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={client}>
        <AuthProviderContext>
          <AuthGuard>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  title: "Note IN",
                  headerTitleAlign: "center",
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen
                name="[id]"
                options={{
                  headerShown: true,
                  headerBackVisible: true,
                  headerTitle: "Note",
                  headerTitleAlign: "center",
                }}
              />
            </Stack>
          </AuthGuard>
        </AuthProviderContext>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
