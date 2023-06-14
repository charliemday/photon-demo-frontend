import { Stack } from "@chakra-ui/react";
import { ProfileIcon } from "components/icons";
import { Body } from "components/text";
import { useInitials } from "hooks";
import { FC } from "react";

interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export const Assigned: FC<Props> = ({ name, size = "xs" }) => {
  const { initials } = useInitials({ name });
  return (
    <Stack direction="row" align="center" spacing="6px">
      <ProfileIcon initials={initials} size="sm" />

      <Body maxWidth="108px" fontWeight="semibold" fontSize={size} textOverflow="ellipsis">
        {name}
      </Body>
    </Stack>
  );
};
