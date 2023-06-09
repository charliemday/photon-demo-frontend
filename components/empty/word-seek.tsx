import { Stack } from "@chakra-ui/react";
import { Button } from "components/button";
import { Body, Heading } from "components/text";
import { FC } from "react";

interface Props {
  onClick: () => void;
}

export const WordSeekEmpty: FC<Props> = ({ onClick }) => {
  return (
    <Stack
      border="solid 1px lightgray"
      borderRadius="lg"
      w="full"
      alignItems="center"
      justifyContent="center"
      h="40vh"
      spacing={6}
    >
      <Heading fontSize="2xl">🕳️</Heading>
      <Heading fontSize="2xl">Nothing to see here</Heading>
      <Body w="302px" textAlign="center">
        You might want to try pressing this purple-blue button to run the WordSeek automation
      </Body>
      <Button onClick={onClick}>Start WordSeek</Button>
    </Stack>
  );
};
