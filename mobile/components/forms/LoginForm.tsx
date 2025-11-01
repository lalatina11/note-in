import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import useAuthContext from "@/lib/context/auth-context";
import { registerSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

const loginSchema = registerSchema.omit({ name: true });

const LoginForm = () => {
  const { signIn, isLoading: isFetchingUserInfo, session } = useAuthContext();
  const [isShowPass, setIsShowPass] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signIn(values);
    } catch (error) {
      const { message } = error as Error;
      form.setError("root", { message });
    }
  };

  const isFormLoading =
    form.formState.isLoading ||
    form.formState.isSubmitting ||
    isFetchingUserInfo;

  return (
    <Box className="flex flex-col gap-6 my-6">
      {form.formState.errors.root && (
        <Text className="text-center text-sm text-error-500 mt-1">
          {form.formState.errors.root.message}
        </Text>
      )}
      {session ? (
        <Text>Already Logged In!</Text>
      ) : (
        <>
          <Box>
            <Text>Email</Text>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                onChangeText={(val) => form.setValue("email", val)}
                placeholder="Enter Text here..."
              />
            </Input>
            {form.formState.errors.email?.message && (
              <Text className=" text-sm text-error-500 mt-1">
                {form.formState.errors.email?.message}
              </Text>
            )}
          </Box>
          <Box>
            <Text>Password</Text>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                type={isShowPass ? "text" : "password"}
                onChangeText={(val) => form.setValue("password", val)}
                placeholder="Enter Text here..."
              />
            </Input>
            {form.formState.errors.password?.message && (
              <Text className=" text-sm text-error-500 mt-1">
                {form.formState.errors.password?.message}
              </Text>
            )}
          </Box>
          <Checkbox
            value={""}
            onChange={(check) => setIsShowPass(!!check)}
            isDisabled={false}
            isInvalid={false}
            size="md"
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>Show Password</CheckboxLabel>
          </Checkbox>
          <Button
            onPress={form.handleSubmit(login)}
            disabled={isFormLoading}
            variant="solid"
            size="md"
            action="primary"
          >
            <ButtonText>{isFormLoading ? "Loading..." : "Login"}</ButtonText>
          </Button>
        </>
      )}
    </Box>
  );
};

export default LoginForm;
