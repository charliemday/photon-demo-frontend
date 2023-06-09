import {
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useCreateCustomerPortalMutation } from "api/payment.api";
import { useDeleteAccountMutation, useUserDetailsQuery } from "api/user.api";
import { useGetAppSumoDetailsQuery } from "api/vendor.api";
import { AppSumoSubscriptionModal, ConfirmationModal } from "components/modals";
import { BRAND_COLOR, SUPPORT_EMAIL } from "config";
import { BASE_FRONTEND_URL } from "config/urls";
import { useLogout } from "hooks";
import React from "react";
import { IconType } from "react-icons";
import { AiFillDelete } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { BsCreditCard2BackFill } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { typeCheckError } from "utils";
import { GscConnectModal } from "views/word-seek/modals";

export const SettingsView: React.FC = () => {
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const [createCustomerPortal, { isLoading: isCreatingCustomerPortal }] =
    useCreateCustomerPortalMutation();

  const { data: appSumoDetails } = useGetAppSumoDetailsQuery();

  const { logout } = useLogout();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGscModalOpen,
    onOpen: onGscModalOpen,
    onClose: onGscModalClose,
  } = useDisclosure();
  const {
    isOpen: isAppSumoSubscriptionOpen,
    onOpen: onAppSumoSubscriptionOpen,
    onClose: onAppSumoSubscriptionClose,
  } = useDisclosure();

  const renderHeading = (heading: string, icon?: IconType) => {
    const Icon = icon;

    return (
      <Stack w="full">
        <HStack>
          {/* @ts-ignore */}
          {icon && <Icon size={20} />}
          <Text fontSize="lg" fontWeight="semibold">
            {heading}
          </Text>
        </HStack>
        <Divider />
      </Stack>
    );
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(undefined)
      .unwrap()
      .then(() => {
        logout();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: typeCheckError(err) || "Something went wrong. Please contact our team.",
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
          description: typeCheckError(err) || "Something went wrong. Please contact our team.",
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
          {renderHeading("Account Details", BiUserCircle)}
          {renderLabelValue("Name", fullName || "")}
          {renderLabelValue("Email", userDetails?.email || "")}
          <Box>
            <Button
              variant="solid"
              color="white"
              bgColor={BRAND_COLOR}
              _hover={{ bgColor: BRAND_COLOR, boxShadow: "lg" }}
              onClick={onGscModalOpen}
            >
              Refresh GSC Connection
            </Button>
          </Box>
        </Stack>
        <GscConnectModal isOpen={isGscModalOpen} onClose={onGscModalClose} />

        {appSumoDetails ? (
          <Stack spacing={6}>
            {renderHeading("AppSumo Subscription", BsCreditCard2BackFill)}

            <Box>
              <Button
                variant="solid"
                color="white"
                bgColor={BRAND_COLOR}
                border={`solid 2px ${BRAND_COLOR}`}
                _hover={{
                  bgColor: "white",
                  color: BRAND_COLOR,
                }}
                onClick={onAppSumoSubscriptionOpen}
              >
                Manage AppSumo Subscription
              </Button>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={6}>
            {renderHeading("Subscription Settings", BsCreditCard2BackFill)}
            <Box>
              <Button
                variant="solid"
                color="white"
                bgColor={BRAND_COLOR}
                _hover={{ bgColor: BRAND_COLOR, boxShadow: "lg" }}
                onClick={handleCreateCustomerPortal}
                isLoading={isCreatingCustomerPortal}
                isDisabled={
                  userDetails?.products
                    ? Object.values(userDetails?.products).length
                      ? false
                      : true
                    : true
                }
              >
                Manage Subscription
              </Button>
            </Box>
          </Stack>
        )}
        <Stack spacing={6}>
          {renderHeading("Contact Us", FiMail)}
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
        <Stack spacing={6} borderRadius="xl">
          {renderHeading("Account Removal", AiFillDelete)}
          <Box>
            <Button colorScheme="red" variant="outline" onClick={onOpen} borderWidth="2px">
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
      <AppSumoSubscriptionModal
        isOpen={isAppSumoSubscriptionOpen}
        onClose={onAppSumoSubscriptionClose}
      />
    </>
  );
};
