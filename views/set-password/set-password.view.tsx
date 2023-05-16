import { Box, Container, useToast } from "@chakra-ui/react";
import { useSetPasswordMutation } from "api/auth.api";
import { SetPasswordForm, SetPasswordFormValues } from "forms/set-password";
import { FC, useEffect, useState } from "react";
import { typeCheckError } from "utils";
import { BackgroundView } from "views/background";

interface Props {}

export const SetPasswordView: FC<Props> = () => {
  const [showBackground, setShowBackground] = useState(false);
  const [setPassword, { isLoading, isSuccess, isError, error }] =
    useSetPasswordMutation();

  const toast = useToast();

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
        toast({
          title: "Password updated successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
        setShowBackground(true);
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
  }, [isLoading, isSuccess, isError, error, toast]);

  if (showBackground) {
    return <BackgroundView />;
  }

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
