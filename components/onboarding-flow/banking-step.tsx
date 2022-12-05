import React, { useEffect, useState } from "react";
import {
  ModalFooter,
  ModalBody,
  Stack,
  HStack,
  useToast,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Image } from "components/image";
import { useGetAuthUrlQuery } from "api/vendor.api";
import { Button } from "components/button";

interface Props {}

export interface FormValeus {
  name: string;
  description: string;
}

const bankingIcons = [
  "monzo",
  "revolut",
  "hsbc",
  "natwest",
  "barclays",
  "santander",
  "nationwide",
  "pleo",
];

const ICON_SIZE = 75;

export const BankingStep: React.FC<Props> = () => {
  const [vendorApp, setVendorApp] = useState<string | null>(null);
  const toast = useToast();
  const {
    data: authUrl,
    isLoading,
    refetch: fetchAuthUrl,
    isSuccess,
    error: getAuthUrlError,
  } = useGetAuthUrlQuery(
    {
      appName: vendorApp,
    },
    {
      skip: !vendorApp,
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

  const handleClick = async () => {
    setVendorApp("tink");
    await fetchAuthUrl();
  };

  return (
    <Box>
      <ModalBody>
        <Stack>
          <HStack>
            <Grid templateColumns="repeat(4, 1fr)" gap={10}>
              {bankingIcons.map((icon, key) => (
                <GridItem key={key}>
                  <Box
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    position="relative"
                    borderRadius="md"
                    overflow="hidden"
                    border="solid 1px lightgray"
                    opacity={0.5}
                  >
                    <Image
                      src={`/logos/banks/${icon}.png`}
                      alt={icon}
                      layout="fill"
                    />
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </HStack>
        </Stack>
      </ModalBody>
      <ModalFooter justifyContent="center" mt={12}>
        <Button onClick={handleClick} isLoading={isLoading} size="sm">
          Connect
        </Button>
      </ModalFooter>
    </Box>
  );
};
