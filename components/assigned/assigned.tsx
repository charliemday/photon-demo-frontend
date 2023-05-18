import { Stack, Text } from "@chakra-ui/react";
import { ProfileIcon } from "components/icons";
import { FC } from "react";

interface Props {
  name: string;
}

export const Assigned: FC<Props> = ({ name }) => (
  <Stack direction="row" align="center" spacing="6px">
    <ProfileIcon name={name} size="sm" />

    <Text maxWidth="108px" fontSize="xs" fontWeight="medium" textOverflow="ellipsis">
      {name}
    </Text>
  </Stack>
);
