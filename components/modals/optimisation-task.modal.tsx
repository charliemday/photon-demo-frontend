import { Stack, Text, Checkbox } from "@chakra-ui/react";
import { FC } from "react";
import { Modal } from "./modal";
import { SuggestedText } from "components/suggested-text";
import { Body, Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OptimisationTaskModal: FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="6xl">
    <Stack direction="row" spacing="30px">
      <Stack
        maxWidth="570px"
        paddingX="24px"
        paddingY="20px"
        borderRadius="8px"
        borderColor="#ECECEC"
        borderWidth="1px"
        spacing="30px"
      >
        <Stack spacing="8px">
          <Label>Write about clustered themes</Label>

          <Body>
            We have clustered the missing keywords into themes. We have generated some sample text
            that covers the keywords within themed headings:
          </Body>
        </Stack>

        <Stack spacing="16px">
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center" spacing="8px">
              <Checkbox />
              <Body>Best chalk bag for beginners</Body>
            </Stack>
          </Stack>

          <Stack paddingX="24px" spacing="10px">
            <Body>Beginner chalk bags</Body>
            <Body>Beginner chalk bag</Body>
            <Body>First chalk bag</Body>
          </Stack>

          <SuggestedText
            heading="Some Top Tips For Best Chalk Bag For Beginners"
            text="Beginner chalk bags are not their own category. Most people go straight for some of the most well known brands for their first chalk bag. As a result, defining a beginner chalk bag is tricky."
          />
        </Stack>

        <Stack spacing="16px">
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center" spacing="8px">
              <Checkbox />
              <Body>Best chalk bag for beginners</Body>
            </Stack>
          </Stack>

          <Stack paddingX="24px" spacing="10px">
            <Body>Beginner chalk bags</Body>
            <Body>Beginner chalk bag</Body>
            <Body>First chalk bag</Body>
          </Stack>

          <SuggestedText
            heading="Some Top Tips For Best Chalk Bag For Beginners"
            text="Beginner chalk bags are not their own category. Most people go straight for some of the most well known brands for their first chalk bag. As a result, defining a beginner chalk bag is tricky."
          />
        </Stack>
      </Stack>

      <Stack
        maxWidth="570px"
        paddingX="24px"
        paddingY="20px"
        borderRadius="8px"
        borderColor="#ECECEC"
        borderWidth="1px"
        spacing="30px"
      >
        <Stack spacing="8px">
          <Text fontWeight="medium">Add FAQs</Text>

          <Body>
            The following missing keywords are good candidates for short FAQs at the end of your
            blog post. We have added some AI content (max 140 characters including spaces:
          </Body>
        </Stack>

        <Stack spacing="16px">
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center" spacing="8px">
              <Checkbox />
              <Body>Best chalk bag for beginners</Body>
            </Stack>
          </Stack>

          <SuggestedText
            heading="Some Top Tips For Best Chalk Bag For Beginners"
            text="Beginner chalk bags are not their own category. Most people go straight for some of the most well known brands for their first chalk bag. As a result, defining a beginner chalk bag is tricky."
          />
        </Stack>

        <Stack spacing="16px">
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center" spacing="8px">
              <Checkbox />
              <Body>Best chalk bag for beginners</Body>
            </Stack>
          </Stack>

          <SuggestedText
            heading="Some Top Tips For Best Chalk Bag For Beginners"
            text="Beginner chalk bags are not their own category. Most people go straight for some of the most well known brands for their first chalk bag. As a result, defining a beginner chalk bag is tricky."
          />
        </Stack>
      </Stack>
    </Stack>
  </Modal>
);
