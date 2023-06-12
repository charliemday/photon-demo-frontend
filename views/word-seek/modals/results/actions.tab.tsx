import { Stack } from "@chakra-ui/react";
import { Body } from "components/text";
import { FC } from "react";

interface Props {}

export const ActionsTab: FC<Props> = () => {
  return (
    <Stack alignItems="center" justifyContent="center" py={12}>
      <Body fontSize="md">Suggestions coming soon 🏗️</Body>
      <Body>Having data is one thing...knowing what to do with it is another...</Body>
    </Stack>
  );
};
