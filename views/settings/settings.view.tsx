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
import { BRAND_COLOR, SUPPORT_EMAIL } from "config";
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
      <Stack spacing={16} minW="50vw" py={6}>
        <Stack spacing={6}>
          {renderHeading("📝 Account Details")}
          {renderLabelValue("Name", fullName || "")}
          {renderLabelValue("Email", userDetails?.email || "")}
        </Stack>

        <Stack spacing={6}>
          {renderHeading("💸 Subscription Settings")}
          <Box>
            <Button
              variant="solid"
              color="white"
              bgColor={BRAND_COLOR}
              _hover={{ bgColor: BRAND_COLOR, boxShadow: "lg" }}
              onClick={handleCreateCustomerPortal}
              isLoading={isCreatingCustomerPortal}
            >
              Manage Subscription
            </Button>
          </Box>
        </Stack>
        <Stack spacing={6}>
          {renderHeading("📨 Contact Us")}
          <Box>
            <Button
              color={BRAND_COLOR}
              _hover={{ color: BRAND_COLOR, boxShadow: "lg" }}
              borderColor={BRAND_COLOR}
              borderWidth="2px"
              variant="outline"
              onClick={() => window.open(`mailto:${SUPPORT_EMAIL}`)}
            >
              Contact Us
            </Button>
          </Box>
        </Stack>
        <Stack spacing={6} border="solid 2px red" p={4} borderRadius="xl">
          {renderHeading("☢️ Danger Zone")}
          <Box>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={onOpen}
              borderWidth="2px"
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