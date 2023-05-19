import { Box, Stack, Text } from "@chakra-ui/react";
import { Image } from "components/image";
import { useActiveTeam } from "hooks";

import { FC } from "react";

interface Props {}

const LOGO_DIM = 6;

export const TopIcon: FC<Props> = () => {
  const activeTeam = useActiveTeam();

  return (
    <Stack width="102px" height="17px">
      <Box position="relative" h={LOGO_DIM} w={LOGO_DIM} overflow="hidden" borderRadius="md">
        {activeTeam?.logo && (
          <Image src={activeTeam?.logo} objectFit="cover" alt="Team Logo" layout="fill" />
        )}
      </Box>
      <Text fontWeight="semibold" fontSize="lg">
        {activeTeam?.name}
      </Text>
    </Stack>
  );
};
