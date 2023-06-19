import { Box, HStack, Text } from "@chakra-ui/react";
import { useUserDetailsQuery } from "api/user.api";
import { useInitials } from "hooks";
import { FC } from "react";

export const Avatar: FC = () => {
  const { data: userDetails } = useUserDetailsQuery();

  const fullName = `${userDetails?.firstName} ${userDetails?.lastName}`;
  const { initials } = useInitials();

  if (!userDetails) {
    return null;
  }

  return (
    <HStack>
      <Text fontSize="lg">{fullName}</Text>

      <Box border="solid 2px black" px={2} py={1} borderRadius="md" bgColor="purple.400">
        <Text fontWeight="semibold">{initials}</Text>
      </Box>
    </HStack>
  );
};
