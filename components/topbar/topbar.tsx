import { Flex, HStack } from "@chakra-ui/react";
import { Body, Heading } from "components/text";
import { BRAND_NAME } from "config";
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
      px="15%"
      alignItems="center"
      justifyContent="space-between"
      borderBottom="solid 1px #E2E8F0"
    >
      <Heading>{BRAND_NAME} | Automated SEO</Heading>
      <HStack>
        <Body
          fontSize="md"
          onClick={logout}
          _hover={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Logout
        </Body>
        <BiExit />
      </HStack>
    </Flex>
  );
};
