import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { registerSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import useAuthContext from "@/lib/context/auth-context";
import { useRouter } from "expo-router";
import { z } from "zod";

const RegisterForm = () => {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const [isShowPass, setIsShowPass] = useState(false);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const register = async (body: z.infer<typeof registerSchema>) => {
    try {
      await signUp(body);
      router.navigate("/");
    } catch (error) {
      const { message } = error as Error;
      form.setError("root", { message });
    }
  };

  return (
    <Box className="flex flex-col gap-6 my-6">
      {form.formState.errors.root && (
        <Text className="text-center text-sm text-error-500 mt-1">
          {form.formState.errors.root.message}
        </Text>
      )}
      <Box className="">
        <Text>Username</Text>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            onChangeText={(val) => form.setValue("name", val)}
            placeholder="Enter Text here..."
          />
        </Input>
        {form.formState.errors.name?.message && (
          <Text className="text-sm text-error-500 mt-1">
            {form.formState.errors.name?.message}
          </Text>
        )}
      </Box>
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
          <Text className="text-sm text-error-500 mt-1">
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
          <Text className="text-sm text-error-500 mt-1">
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
        onPress={form.handleSubmit(register)}
        variant="solid"
        size="md"
        action="primary"
      >
        <ButtonText>Register Now</ButtonText>
      </Button>
    </Box>
  );
};

export default RegisterForm;
