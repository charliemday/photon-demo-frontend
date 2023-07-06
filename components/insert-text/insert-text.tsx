import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  insertText: string;
}

export const InsertText: FC<Props> = ({ text, insertText }) => {
  const splitText = text.split(insertText);
  return (
    <Flex>
      <Text>{splitText[0]}</Text>
      <Text px={1} mx={1} bgColor="green.200" borderRadius="md">
        {insertText}
      </Text>
      <Text>{splitText[1]}</Text>
    </Flex>
  );
};
