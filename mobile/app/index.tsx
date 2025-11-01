import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiRequest";
import useAuthContext from "@/lib/context/auth-context";
import { noteSchema } from "@/lib/schemas/auth-schema";
import { ApiResponse, Note } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Pressable, Text } from "react-native";
import { format } from "timeago.js";
import { z } from "zod";

export default function Index() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => {
    setShowAlertDialog(false);
    form.reset();
  };

  const {
    token,
    signOut,
    session,
    isLoading: isFetchingUserInfo,
  } = useAuthContext();

  const handleSignOut = async () => {
    await signOut(token);
  };

  const {
    isEnabled,
    data: res,
    isLoading,
    error,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await apiRequest.get("/api/notes", token);
      return (await res.json()) as Promise<ApiResponse<Note[]>>;
    },
    enabled: !!session,
  });

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: "", description: "" },
  });

  const router = useRouter();

  const isFormBusy = form.formState.isLoading || form.formState.isSubmitting;

  const createNote = async (body: z.infer<typeof noteSchema>) => {
    try {
      const res = await apiRequest.post("/api/notes", body, token);
      const result = (await res.json()) as ApiResponse<Note>;
      if (result.error) {
        throw new Error(result.message || "Something went Wrong!");
      }
      await refetch();
      handleClose();
    } catch (error) {
      const { message } = error as Error;
      form.setError("root", { message });
    }
  };

  if (!isEnabled)
    return (
      <Box className="flex-1 flex justify-center items-center">
        <Text className="text-3xl font-semibold">
          You are not Authenticated!
        </Text>
      </Box>
    );

  if (isLoading || isPending) {
    return (
      <Box className="flex-1 flex justify-center items-center">
        <Text className="text-3xl font-semibold">Loading Notes Data...</Text>
      </Box>
    );
  }

  if (isFetchingUserInfo) {
    return (
      <Box className="flex-1 flex justify-center items-center">
        <Text className="text-3xl font-semibold">Loading Notes Data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 flex justify-center items-center">
        <Text className="text-3xl font-semibold">
          {error.message || "Something went wrong!"}
        </Text>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Box className="flex-1 h-full flex flex-col gap-3 w-full p-3">
        <Box className="flex flex-row justify-between items-center gap-6 p-6">
          <Text>Hello {session?.user.name}</Text>
          <Button onPress={handleSignOut} variant="solid" action="negative">
            <ButtonText>Logout</ButtonText>
          </Button>
        </Box>
        <>
          <Button onPress={() => setShowAlertDialog(true)}>
            <ButtonText>Create new Note</ButtonText>
          </Button>
          <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading
                  className="text-typography-950 font-semibold"
                  size="md"
                >
                  Create Note
                </Heading>
              </AlertDialogHeader>
              <AlertDialogBody className="mt-1 mb-4">
                <Text>Create A new Note</Text>
                {form.formState.errors.root?.message && (
                  <Text className=" text-sm text-error-500 mt-1">
                    {form.formState.errors.root?.message}
                  </Text>
                )}
                <Box className="flex flex-col gap-3 mt-3">
                  <Box className="flex flex-col gap-3">
                    <Text>Title</Text>
                    <Input
                      variant="outline"
                      size="md"
                      isDisabled={false}
                      isInvalid={false}
                      isReadOnly={false}
                    >
                      <InputField
                        onChangeText={(val) => form.setValue("title", val)}
                        placeholder="Enter Text here..."
                      />
                    </Input>
                    {form.formState.errors.title?.message && (
                      <Text className=" text-sm text-error-500 mt-1">
                        {form.formState.errors.title?.message}
                      </Text>
                    )}
                  </Box>
                  <Box className="flex flex-col gap-3">
                    <Text>Description</Text>
                    <Input
                      variant="outline"
                      size="md"
                      isDisabled={false}
                      isInvalid={false}
                      isReadOnly={false}
                    >
                      <InputField
                        onChangeText={(val) =>
                          form.setValue("description", val)
                        }
                        placeholder="Enter Text here..."
                      />
                    </Input>
                    {form.formState.errors.description?.message && (
                      <Text className=" text-sm text-error-500 mt-1">
                        {form.formState.errors.description?.message}
                      </Text>
                    )}
                  </Box>
                </Box>
              </AlertDialogBody>
              <AlertDialogFooter
                style={{ marginTop: 20 }}
                className="flex justify-between items-center"
              >
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  size="sm"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  size="sm"
                  disabled={isFormBusy}
                  onPress={form.handleSubmit(createNote)}
                >
                  <ButtonText>Create</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>

        {res?.data && res?.data?.length ? (
          <Box className="">
            {res.data.map((note) => (
              <Pressable
                onPress={() => {
                  router.navigate(`/${note.id}`);
                }}
                key={note.id}
              >
                <Card size="md" variant="elevated" className="m-3">
                  <Heading size="md" className="mb-1">
                    {note.title}
                  </Heading>
                  <Text>{note.description}</Text>
                  <Text>{format(new Date(note.createdAt))}</Text>
                </Card>
              </Pressable>
            ))}
          </Box>
        ) : (
          <Box>
            <Text className="text-center">
              There are No Notes at the moment, Please Create one
            </Text>
          </Box>
        )}
      </Box>
    </KeyboardAvoidingView>
  );
}
