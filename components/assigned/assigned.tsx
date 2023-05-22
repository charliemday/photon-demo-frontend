import { Stack, Text } from "@chakra-ui/react";
import { ProfileIcon } from "components/icons";
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
      <Text maxWidth="108px" fontSize="xs" fontWeight="semibold" textOverflow="ellipsis">
        {name}
      </Text>
    </Stack>
  );
};
