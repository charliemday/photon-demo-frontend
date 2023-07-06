import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  HStack,
  Stack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { Tag } from "components/tag";
import { FC, useEffect } from "react";
import { FiMinusSquare, FiPlusSquare } from "react-icons/fi";

interface Props {
  title: string;
  clusterItems: string[];
  onToggle?: () => void;
  isOpen?: boolean;
}

export const ClusterAccordion: FC<Props> = ({ title, clusterItems, onToggle, isOpen }) => {
  const { onCopy, hasCopied, setValue } = useClipboard("");

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
      <HStack>
        <Accordion allowToggle defaultIndex={isOpen ? [0] : []} w="full">
          <AccordionItem
            border="none"
            onChange={() => {
              onToggle && onToggle();
            }}
            w="full"
          >
            <AccordionButton
              borderRadius="md"
              _hover={{
                bg: "none",
              }}
              p={0}
              onClick={() => {
                onToggle && onToggle();
              }}
            >
              <Stack w="full">
                <HStack spacing={0} justifyContent="space-between">
                  <HStack>
                    {isOpen ? <FiMinusSquare /> : <FiPlusSquare />}
                    <Text fontSize="xs" fontWeight="semibold">
                      {title}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Text
                      fontWeight="semibold"
                      fontSize="xs"
                      textAlign="left"
                      pl={6}
                      color="gray.500"
                    >
                      Missing Keywords:
                    </Text>
                    <Tag text={clusterItems.length.toString()} fontSize="xs" size="sm" />
                  </HStack>
                </HStack>
                {isOpen && <Divider color="#EEF1F6" />}
              </Stack>
            </AccordionButton>
            <AccordionPanel>
              <Stack ml={2}>
                {clusterItems.map((item, index) => (
                  <Flex key={index}>
                    <Text
                      fontSize="xs"
                      onClick={() => {
                        setValue(item);
                        onCopy();
                      }}
                      cursor="pointer"
                    >
                      {item}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </HStack>
    </Stack>
  );
};
