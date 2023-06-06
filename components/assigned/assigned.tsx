import { Box, Stack, Text } from "@chakra-ui/react";
import { ProfileIcon } from "components/icons";
import { Body } from "components/text";
import { useInitials } from "hooks";
import { FC } from "react";

interface Props {
  name: string;
}

export const Assigned: FC<Props> = ({ name }) => {
  const { initials } = useInitials({ name });
  return (
    <Stack direction="row" align="center" spacing="6px">
      <ProfileIcon initials={initials} size="sm" />

      <Body maxWidth="108px" fontWeight="semibold" textOverflow="ellipsis">
        {name}
      </Body>
    </Stack>
  );
};
