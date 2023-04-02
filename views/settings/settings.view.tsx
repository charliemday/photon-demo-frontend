import {
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCreateCustomerPortalMutation } from "api/payment.api";
import { useDeleteAccountMutation, useUserDetailsQuery } from "api/user.api";
import { ConfirmationModal } from "components/modals";
import { BASE_FRONTEND_URL } from "config/urls";
import { useLogout } from "hooks";
import React from "react";
import { typeCheckError } from "utils";

interface Props {}

export const SettingsView: React.FC<Props> = () => {
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const [deleteAccount, { isLoading: isDeletingAccount }] =
    useDeleteAccountMutation();
  const [createCustomerPortal, { isLoading: isCreatingCustomerPortal }] =
    useCreateCustomerPortalMutation();

  const { logout } = useLogout();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderHeading = (heading: string) => (
    <Stack w="full">
      <Text fontSize="lg" fontWeight="semibold">
        {heading}
      </Text>
      <Divider />
    </Stack>
  );

  const handleDeleteAccount = async () => {
    await deleteAccount(undefined)
      .unwrap()
      .then(() => {
        logout();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description:
            typeCheckError(err) ||
            "Something went wrong. Please contact our team.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleCreateCustomerPortal = async () => {
    await createCustomerPortal({
      returnUrl: `${BASE_FRONTEND_URL}/settings`,
    })
      .unwrap()
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((err) => {
        toast({
          title: "Error",
          description:
            typeCheckError(err) ||
            "Something went wrong. Please contact our team.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const renderLabelValue = (label: string, value: string) => (
    <HStack>
      <Text fontWeight="semibold">{label}:</Text>
      <Text>{value}</Text>
    </HStack>
  );
  const fullName = `${userDetails?.firstName} ${userDetails?.lastName}`;

  return (
    <>
      <Stack spacing={12} minW="50vw" py={6}>
        <Stack spacing={6}>
          {renderHeading("📝 Account Details")}
          {renderLabelValue("Name", fullName || "")}
          {renderLabelValue("Email", userDetails?.email || "")}
        </Stack>

        <Stack spacing={6}>
          {renderHeading("💸 Subscription Settings")}
          <Box>
            <Button
              variant="outline"
              colorScheme="purple"
              size="sm"
              onClick={handleCreateCustomerPortal}
              isLoading={isCreatingCustomerPortal}
            >
              Manage Subscription
            </Button>
          </Box>
        </Stack>
        <Stack spacing={6}>
          {renderHeading("☢️ Danger Zone")}
          <Box>
            <Button
              colorScheme="red"
              size="sm"
              variant="outline"
              onClick={onOpen}
            >
              Delete Account
            </Button>
          </Box>
        </Stack>
      </Stack>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        handleConfirm={handleDeleteAccount}
        title="Delete Account"
        body="Are you sure you want to delete your account? This action cannot be undone."
        confirmButtonLabel="Delete"
        cancelButtonLabel="Cancel"
        isLoading={isDeletingAccount}
      />
    </>
  );
};
