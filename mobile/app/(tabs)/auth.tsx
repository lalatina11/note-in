import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";

const AuthPage = () => {
  const [authType, setAuthType] = useState<"register" | "login">("login");

  const isLoginPage = authType === "login";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Box className="h-full p-6">
        <Card size="md" variant="elevated" className="rounded-lg w-full">
          <Heading size="md" className="mb-1">
            {isLoginPage ? "Login" : "Register"}
          </Heading>
          <Text size="sm">
            {isLoginPage ? "Login Into Your Account" : "Register Your Account"}
          </Text>
          {isLoginPage ? <LoginForm /> : <RegisterForm />}
        </Card>
        <Box className="flex gap-2 flex-row justify-center items-center mt-3">
          <Text className="text-primary-900 w-fit">
            {isLoginPage
              ? "Don't Have an Account?"
              : "Already have an Account?"}
          </Text>
          <Text
            className="text-primary-900 w-fit border-b"
            onPress={() => setAuthType(isLoginPage ? "register" : "login")}
          >
            {isLoginPage ? "Register Here" : "Login Here"}
          </Text>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default AuthPage;
