import { Divider, Stack, Text, useClipboard, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BlogSection } from "types/blog";

interface Props {
  item: BlogSection;
}

export const BlogSectionItem: React.FC<Props> = ({ item }) => {
  const [textToCopy, setTextToCopy] = useState<string>();

  const { onCopy, hasCopied } = useClipboard(textToCopy || "");

  const toast = useToast();

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: "Copied to clipboard",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    }
  }, [hasCopied, toast]);

  return (
    <Stack>
      <Text
        cursor="pointer"
        borderRadius="md"
        p={2}
        _hover={{
          bgColor: "gray.50",
        }}
        onClick={() => {
          setTextToCopy(item.title);
          onCopy();
        }}
      >
        {item.title}
      </Text>
      <Divider />
      <Text fontSize="sm" as="i" pl={2} opacity={0.75}>
        Some ideas to write about
      </Text>
      <Text
        cursor="pointer"
        borderRadius="md"
        p={2}
        _hover={{
          bgColor: "gray.50",
        }}
        onClick={() => {
          setTextToCopy(item.content);
          onCopy();
        }}
        whiteSpace="pre-wrap"
      >
        {item.content}
      </Text>
    </Stack>
  );
};
