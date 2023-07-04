import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Divider,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Tag } from "components/tag";
import { FC } from "react";
import { FiMinusSquare, FiPlusSquare } from "react-icons/fi";

interface Props {
  title: string;
  clusterItems: string[];
  onToggle?: () => void;
  isOpen?: boolean;
}

export const ClusterAccordion: FC<Props> = ({ title, clusterItems, onToggle, isOpen }) => {
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
                  <Text key={index} fontSize="xs">
                    {item}
                  </Text>
                ))}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </HStack>
    </Stack>
  );
};
