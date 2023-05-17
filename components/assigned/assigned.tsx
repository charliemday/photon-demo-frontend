import { Stack, Text } from "@chakra-ui/react";
import { ProfileIcon } from "components/profile-icon";
import { FC } from "react";

interface Props {
  name: string;
}

export const Assigned: FC<Props> = ({ name }) => (
  <Stack direction="row" justify="flex-start" align="center" spacing="6px">
    <ProfileIcon name="M" size="sm" />

    <Text
      fontFamily="Inter"
      lineHeight="1.43"
      fontWeight="medium"
      fontSize="12px"
      color="#000000"
      width="108px"
    >
      {name}
    </Text>
  </Stack>
);
