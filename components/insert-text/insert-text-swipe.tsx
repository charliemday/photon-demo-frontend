import { Box, Flex, HStack, Stack, useClipboard, useToast } from "@chakra-ui/react";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { FC, useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { InsertText } from "./insert-text";

interface Props {
  sentences: string[];
  originalSentences: string[];
  query: string;
  url: string;
}

export const InsertTextSwipe: FC<Props> = ({ sentences, originalSentences, query, url }) => {
  const toast = useToast();

  const { hasCopied, onCopy } = useClipboard("");
  const [isHovered, setIsHovered] = useState(false);
  const [isOriginalHovered, setIsOriginalHovered] = useState(false);

  const [sentenceRandomIndex, setSentenceRandomIndex] = useState(
    Math.floor(Math.random() * sentences.length),
  );

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: "Copied to clipboard",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [hasCopied, toast]);

  const navigateToPage = () => {
    const locator = "#:~:text=";
    const urlEncodedSentence = encodeURIComponent(originalSentences[sentenceRandomIndex]);
    const urlToNavigateTo = url + locator + urlEncodedSentence;

    window.open(urlToNavigateTo, "_noreferer", "noreferrer");
  };

  return (
    <Stack>
      <Body py={2}>Original Text</Body>
      <Flex
        border="solid 1px lightgray"
        borderRadius="md"
        p={8}
        opacity={0.9}
        cursor="pointer"
        onMouseOver={() => setIsOriginalHovered(true)}
        onMouseLeave={() => setIsOriginalHovered(false)}
        position="relative"
        onClick={navigateToPage}
      >
        <i>...{originalSentences[sentenceRandomIndex]}...</i>
        <Box display={isOriginalHovered ? "block" : "none"} position="absolute" top={2} left={2}>
          <Tag text="Click to view sentence on page" size="sm" />
        </Box>
      </Flex>
      <Body py={2}>Suggested Text</Body>
      <Flex
        border="solid 1px lightgray"
        borderRadius="md"
        p={8}
        opacity={0.9}
        cursor="pointer"
        onClick={onCopy}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
      >
        <InsertText text={sentences[sentenceRandomIndex]} insertText={query} />
        <Box display={isHovered ? "block" : "none"} position="absolute" top={2} left={2}>
          <Tag text={hasCopied ? "Click to copy" : "Copied!"} size="sm" />
        </Box>
      </Flex>
      <HStack pl={2} pt={4}>
        <Body
          cursor="pointer"
          onClick={() => setSentenceRandomIndex(Math.floor(Math.random() * sentences.length))}
          fontSize="sm"
        >
          🤔 Try another
        </Body>
        <BsArrowRight />
      </HStack>
    </Stack>
  );
};
