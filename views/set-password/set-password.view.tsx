import { Box, Container } from "@chakra-ui/react";
import { SetPasswordForm, SetPasswordFormValues } from "forms/set-password";
import React from "react";

interface Props {}

export const SetPasswordView: React.FC<Props> = () => {
  const handleSetPassword = (values: SetPasswordFormValues) => {
    /**
     * TODO: Send this off to the backend...
     */
    console.log("Values", values);
  };

  return (
    <Container p={12}>
      <Box boxShadow="lg" p={12} borderRadius="md">
        <SetPasswordForm handleSubmit={handleSetPassword} />
      </Box>
    </Container>
  );
};
