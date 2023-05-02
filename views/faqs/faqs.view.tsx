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
    answer: `Contact us at ${SUPPORT_EMAIL} or send us some Feedback 😄`,
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
  {
    question: "No pages appearing?",
    answer: (
      <Text>
        {`In order for WordSeek to run properly, Google needs to have indexed your website pages. These will show on your Search Console. Still confused? Just drop us a message on`}{" "}
        <Link href="mailto:info@getbaser.com">info@getbaser.com</Link> and we
        will get back to you!
      </Text>
    ),
  },
  {
    question: "No result appearing?",
    answer:
      "This is either a good or a bad thing! Either you are 100% optimised already… or, you do not have enough queries being associated with your page from Google.",
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
