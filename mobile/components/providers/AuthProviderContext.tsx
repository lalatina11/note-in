import {
  signIn as login,
  signOut as logout,
  signUp as register,
} from "@/lib/auth-client";
import { getSessionByToken } from "@/lib/auth-service";
import useTokenStore from "@/lib/stores/token-store";
import { useQuery } from "@tanstack/react-query";
import { useSegments } from "expo-router";
import { ReactNode } from "react";
import AuthContext, { SignInSchema, SignUpSchema } from "../AuthContext";

interface Props {
  children: ReactNode;
}
const AuthProviderContext = ({ children }: Props) => {
  const { token, setToken } = useTokenStore();
  const gettingUserInfo = async () => await getSessionByToken(token);
  const segments = useSegments();
  const {
    data: res,
    isLoading,
    refetch,
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["auth-user", segments],
    queryFn: gettingUserInfo,
  });

  const signIn = async (credentials: SignInSchema) => {
    const { data, error } = await login.email(credentials);
    if (error) throw new Error(error.message || "Something went wrong");
    setToken(data.token || "");
    await refetch();
  };
  const signUp = async (credentials: SignUpSchema) => {
    const { data, error } = await register.email(credentials);
    if (error) throw new Error(error.message || "Something went wrong");
    setToken(data.token || "");
    await refetch();
  };

  const signOut = async (sessionToken: string) => {
    await logout({
      fetchOptions: {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${sessionToken}`,
        },
      },
    });
    setToken("");
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        session: res?.data,
        isLoading: isLoading || isPending || isRefetching,
        signIn,
        signUp,
        signOut,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProviderContext;
