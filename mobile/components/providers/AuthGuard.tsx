import useAuthContext from "@/lib/context/auth-context";
import { useSegments, useRouter } from "expo-router";
import { ReactNode, useEffect } from "react";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { session, isLoading, token } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isAuthPage = segments[0] === "auth" || segments[1] === "auth";
    if (!isLoading) {
      if (isAuthPage && session) {
        router.navigate("/");
      } else if (!isAuthPage && !session) {
        router.navigate("/(tabs)/auth");
      }
    }
  }, [isLoading, router, session, segments, token]);

  return <>{children}</>;
};

export default AuthGuard;
