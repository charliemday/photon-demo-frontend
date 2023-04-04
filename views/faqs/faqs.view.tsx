import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface Props {}

const faqs = [
  {
    question: "What is WordSeek?",
    answer:
      "WordSeek is a tool that helps you find the keywords that your page is ranking for but do not appear on your site",
  },
  {
    question: "Who are we?",
    answer: (
      <Text>
        {`We're baser, we automate your SEO - check us out at `}
        <a href="https://getbaser.com">https://getbaser.com</a>
      </Text>
    ),
  },
];

export const FaqsView: React.FC<Props> = () => (
  <Stack w="30vw">
    {faqs.map(({ question, answer }, index) => (
      <Accordion key={index}>
        <AccordionItem>
          <AccordionButton>
            <HStack justifyContent="space-between" w="full">
              <Text fontWeight="semibold" fontSize="lg">
                {question}
              </Text>
              <AccordionIcon />
            </HStack>
          </AccordionButton>
          <AccordionPanel>{answer}</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ))}
  </Stack>
);
