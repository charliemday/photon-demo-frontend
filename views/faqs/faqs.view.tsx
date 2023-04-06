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
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "config";
import Link from "next/link";
import React from "react";

interface Props {}

const faqs = [
  {
    question: "What is WordSeek?",
    answer:
      "WordSeek is a tool that helps you find the keywords that your page is ranking for but do not appear on the page",
  },
  {
    question: "Who are we?",
    answer: (
      <Text>
        {`We're Gigi, Mark, and Charlie and we're Baser, we automate your SEO - check us out at `}
        <Link href="https://getbaser.com">https://getbaser.com</Link>
      </Text>
    ),
  },
  {
    question: "How do I get in contact?",
    answer: `Contact us at ${SUPPORT_EMAIL}`,
  },
  {
    question: "Where is your privacy policy?",
    answer: (
      <Text>
        {`You can find our privacy policy at `}
        <a href={PRIVACY_POLICY_URL}>{PRIVACY_POLICY_URL}</a>
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