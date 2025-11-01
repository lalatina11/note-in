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
import { Text } from "@/components/ui/text";
import { apiRequest } from "@/lib/apiRequest";
import { noteSchema } from "@/lib/schemas/auth-schema";
import useTokenStore from "@/lib/stores/token-store";
import { ApiResponse, Note } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native";
import { z } from "zod";

const Page = () => {
  const { token } = useTokenStore();
  const { id: noteId } = useLocalSearchParams();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    form.clearErrors();
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const {
    data: res,
    isLoading,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: async () => {
      const res = await apiRequest.get(`/api/notes/${noteId}`, token);
      const result = res.json() as Promise<ApiResponse<Note>>;
      form.setValue("title", (await result).data?.title as string);
      form.setValue("description", (await result).data?.description as string);
      return result;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["notes"],
    mutationFn: async () => {
      await apiRequest.delete("/api/notes/" + noteId, token);
    },
    onSuccess: () => {
      handleCloseDeleteDialog();
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      router.navigate("/");
    },
  });

  const handleDeleteNote = () => {
    mutation.mutate();
  };

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: res?.data?.title as string,
      description: res?.data?.description as string,
    },
  });

  const isFormBusy = form.formState.isLoading || form.formState.isSubmitting;

  const handleEditNote = async (body: z.infer<typeof noteSchema>) => {
    await apiRequest.patch("/api/notes/" + noteId, body, token);
    await refetch();
    await queryClient.invalidateQueries({
      queryKey: ["notes"],
    });
    handleCloseEditDialog();
  };

  if (isLoading || isPending) {
    return (
      <Box className="flex-1 flex justify-center items-center">
        <Text className="text-3xl font-semibold">Loading Notes Data...</Text>
      </Box>
    );
  }

  if (!res?.data) {
    return (
      <Box className="flex-1 flex justify-center items-center">
        <Text className="text-3xl font-semibold">404 Not Found</Text>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Box className="flex-1 flex flex-col">
        <Card size="md" variant="elevated" className="m-3">
          <Heading size="md" className="mb-1">
            {res?.data?.title}
          </Heading>
          <Text size="sm">{res?.data?.description}</Text>
        </Card>
        <Card
          size="md"
          variant="elevated"
          className="m-3 flex justify-evenly flex-row items-center"
        >
          <>
            <Button onPress={() => setIsEditDialogOpen(true)}>
              <ButtonText>Edit This Note</ButtonText>
            </Button>
            <AlertDialog
              isOpen={isEditDialogOpen}
              onClose={handleCloseEditDialog}
              size="md"
            >
              <AlertDialogBackdrop />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <Heading
                    className="text-typography-950 font-semibold"
                    size="md"
                  >
                    Are you sure you want to delete this post?
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
                          defaultValue={res.data.title}
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
                          defaultValue={res.data.description as string}
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
                <AlertDialogFooter className="">
                  <Button
                    variant="outline"
                    action="positive"
                    onPress={handleCloseEditDialog}
                    size="sm"
                  >
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    disabled={isFormBusy}
                    onPress={form.handleSubmit(handleEditNote)}
                  >
                    <ButtonText>Update</ButtonText>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
          <>
            <Button
              action="negative"
              onPress={() => setIsDeleteDialogOpen(true)}
            >
              <ButtonText>Delete This Note</ButtonText>
            </Button>
            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={handleCloseDeleteDialog}
              size="md"
            >
              <AlertDialogBackdrop />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <Heading
                    className="text-typography-950 font-semibold"
                    size="md"
                  >
                    Are you sure you want to delete this Note?
                  </Heading>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-3 mb-4">
                  <Text size="sm">
                    Deleting the post will remove it permanently and cannot be
                    undone. Please confirm if you want to proceed.
                  </Text>
                </AlertDialogBody>
                <AlertDialogFooter className="">
                  <Button
                    variant="outline"
                    action="positive"
                    onPress={handleCloseDeleteDialog}
                    size="sm"
                  >
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    action="negative"
                    onPress={handleDeleteNote}
                  >
                    <ButtonText>Delete</ButtonText>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        </Card>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default Page;
