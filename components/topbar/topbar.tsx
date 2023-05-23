import { Flex, HStack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { BRAND_NAME, LANDING_PAGE } from "config";
import { useLogout } from "hooks";
import React from "react";
import { BiExit } from "react-icons/bi";

interface Props {}

export const Topbar: React.FC<Props> = () => {
  const { logout } = useLogout();
  return (
    <Flex
      w="full"
      h={75}
      bgColor="gray.100"
      px="15%"
      alignItems="center"
      justifyContent="space-between"
      boxShadow="sm"
    >
      <Text
        cursor="pointer"
        onClick={() => {
          window.location.href = LANDING_PAGE;
        }}
        fontSize="xl"
      >
        {BRAND_NAME} | Automated SEO
      </Text>
      <HStack spacing={12}>
        <Button onClick={logout} variant="outline">
          <HStack>
            <BiExit fontSize={24} />
            <Text>Logout</Text>
          </HStack>
        </Button>
      </HStack>
    </Flex>
  );
};
