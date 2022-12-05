import React, { Fragment, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Stack,
  HStack,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { OAUTH_URLS } from "config";
import { Image } from "components/image";
import { useGetAuthUrlQuery } from "api/vendor.api";
import slugify from "react-slugify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValeus {
  name: string;
  description: string;
}

const testProviders = [
  {
    name: "Xero",
    image:
      "https://lh3.googleusercontent.com/gG0xkV1JBILj15UhWCTVfbz1yp3GthLWdutvBpcjUh12BubSwy01W_mgrS_SdRPXH8L540hTWHFElyLAu1OlgBJ7lI5cYZ3CX3Tcdg=w960",
    isDisabled: false,
  },
  {
    name: "Quickbooks",
    image: "https://shogo.io/media/quickbooks-logo-sm.png",
    isDisabled: true,
  },
  {
    name: "Dext",
    image:
      "https://www.connect4.app/wp-content/uploads/2022/02/dext_appicon.png",
    isDisabled: true,
  },
];

const ICON_SIZE = 75;

export const ConnectAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const toast = useToast();
  const [appName, setAppName] = useState<string | null>(null);
  const {
    data: authUrl,
    isLoading,
    error: getAuthUrlError,
    isSuccess,
  } = useGetAuthUrlQuery(
    {
      appName: appName,
    },
    {
      skip: !appName,
    }
  );

  useEffect(() => {
    if (authUrl && !isLoading && isSuccess) {
      window.location.href = authUrl.url;
    }

    if (getAuthUrlError && !isLoading && !isSuccess) {
      toast({
        title: "Error",
        description: "There was an error getting the url",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [authUrl, isLoading, getAuthUrlError, toast, isSuccess]);

  const handleClick = () => {
    setAppName(slugify(selectedProvider));
  };

  const renderProvider = ({
    name,
    image,
    isDisabled,
  }: {
    name: string;
    image: string;
    isDisabled: boolean;
  }) => (
    <Stack
      borderRadius="lg"
      bgColor="gray.100"
      p={3}
      cursor={isDisabled ? "default" : "pointer"}
      boxShadow="md"
      border={
        selectedProvider === name ? "1px solid green" : "1px solid transparent"
      }
      _hover={{
        boxShadow: isDisabled ? "" : "xl",
      }}
      alignItems="center"
      width={150}
      height={150}
      opacity={isDisabled ? 0.25 : 1}
      pointerEvents={isDisabled ? "none" : "auto"}
      onClick={() => setSelectedProvider(name)}
    >
      <Image src={image} alt={name} width={ICON_SIZE} height={ICON_SIZE} />
      <Flex alignItems="center" flexDirection="column">
        <Text fontWeight="semibold">{name}</Text>
        {isDisabled && <Text fontSize="xs">Coming Soon</Text>}
      </Flex>
    </Stack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select a Provider</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Text fontSize="sm" mb={6} textAlign="center">
              Automate adding your SaaS tools by connecting your accounts using
              a provider below
            </Text>
            <HStack>
              {testProviders.map((provider, key) => (
                <Fragment key={key}>{renderProvider(provider)}</Fragment>
              ))}
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            onClick={handleClick}
            isDisabled={selectedProvider === null}
            isLoading={isLoading}
          >
            Connect {selectedProvider ? `with ${selectedProvider}` : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
