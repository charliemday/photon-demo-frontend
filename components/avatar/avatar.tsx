import { Box, HStack, Text } from "@chakra-ui/react";
import { useUserDetailsQuery } from "api/user.api";
import { FC } from "react";

export const Avatar: FC = () => {
  const { data: userDetails } = useUserDetailsQuery(undefined);

  const fullName = `${userDetails?.firstName} ${userDetails?.lastName}`;
  const initials = `${userDetails?.firstName[0]}${userDetails?.lastName[0]}`;

  if (!userDetails) {
    return null;
  }

  return (
    <HStack>
      <Text fontSize="lg">{fullName}</Text>
      <Box
        border="solid 2px black"
        px={2}
        py={1}
        borderRadius="md"
        bgColor="purple.400"
      >
        <Text fontWeight="semibold">{initials}</Text>
      </Box>
    </HStack>
  );
};
