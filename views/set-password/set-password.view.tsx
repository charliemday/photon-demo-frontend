import { Box, Container, useToast } from "@chakra-ui/react";
import { useSetPasswordMutation } from "api/auth.api";
import { ROUTES } from "config";
import { SetPasswordForm, SetPasswordFormValues } from "forms/set-password";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { typeCheckError } from "utils";

interface Props {}

export const SetPasswordView: FC<Props> = () => {
  const [setPassword, { isLoading, isSuccess, isError, error }] =
    useSetPasswordMutation();

  const toast = useToast();
  const router = useRouter();

  const handleSetPassword = (values: SetPasswordFormValues) => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setPassword({
        password: values.password,
        token,
      });
    }
  };

  useEffect(() => {
    /**
     * Handles the success/failure of set password
     */
    if (!isLoading) {
      if (isSuccess) {
        router.push(ROUTES.BASE);
      }
      if (isError && error) {
        toast({
          title: typeCheckError(error) || "Could not update password",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      }
    }
  }, [isLoading, isSuccess, isError, error, toast, router]);

  return (
    <Container p={12}>
      <Box boxShadow="lg" p={12} borderRadius="md">
        <SetPasswordForm
          handleSubmit={handleSetPassword}
          isLoading={isLoading}
        />
      </Box>
    </Container>
  );
};
