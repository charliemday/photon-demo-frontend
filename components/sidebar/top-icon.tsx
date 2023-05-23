import { Box, HStack, Text } from "@chakra-ui/react";
import { Image } from "components/image";
import { useActiveTeam } from "hooks";

import { FC } from "react";
import { FiHome } from "react-icons/fi";

interface Props {}

const LOGO_DIM = 6;

export const TopIcon: FC<Props> = () => {
  const activeTeam = useActiveTeam();
  return (
    <HStack>
      <Box position="relative" h={LOGO_DIM} w={LOGO_DIM} overflow="hidden" borderRadius="md">
        {activeTeam?.logo ? (
          <Image src={activeTeam?.logo} objectFit="cover" alt="Team Logo" layout="fill" />
        ) : (
          <FiHome fontSize={20} />
        )}
      </Box>
      <Text fontWeight="semibold" fontSize="lg">
        {activeTeam?.name || "Baser"}
      </Text>
    </HStack>
  );
};
