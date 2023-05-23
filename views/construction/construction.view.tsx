import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { FeedbackModal } from "components/modals";
import React from "react";

interface Props {
  text: string;
}

export const ConstructionView: React.FC<Props> = ({ text }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack spacing={1}>
      <Text>{text}</Text>
      <Text
        textDecoration="underline"
        _hover={{
          cursor: "pointer",
          color: "blue.500",
        }}
        onClick={onOpen}
      >{`Let us know what you'd like to see 👀`}</Text>
      <FeedbackModal isOpen={isOpen} onClose={onClose} />
    </HStack>
  );
};
