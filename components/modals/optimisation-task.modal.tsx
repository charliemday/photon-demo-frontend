import { Stack, Text, Checkbox } from "@chakra-ui/react";
import { FC } from "react";
import { Modal } from "./modal";
import { SuggestedText } from "components/suggested-text";

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
          <Text fontWeight="medium">Write about clustered themes</Text>

          <Text fontSize="xs">
            We have clustered the missing keywords into themes. We have generated some sample text
            that covers the keywords within themed headings:
          </Text>
        </Stack>

        <Stack spacing="16px">
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center" spacing="8px">
              <Checkbox />

              <Text fontSize="xs" fontWeight="semibold">
                Best chalk bag for beginners
              </Text>
            </Stack>
          </Stack>

          <Stack paddingX="24px" spacing="10px">
            <Text fontSize="xs">Beginner chalk bags</Text>
            <Text fontSize="xs">Beginner chalk bag</Text>
            <Text fontSize="xs">First chalk bag</Text>
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

              <Text fontSize="xs" fontWeight="semibold">
                Best chalk bag for beginners
              </Text>
            </Stack>
          </Stack>

          <Stack paddingX="24px" spacing="10px">
            <Text fontSize="xs">Beginner chalk bags</Text>
            <Text fontSize="xs">Beginner chalk bag</Text>
            <Text fontSize="xs">First chalk bag</Text>
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

          <Text fontSize="xs">
            The following missing keywords are good candidates for short FAQs at the end of your
            blog post. We have added some AI content (max 140 characters including spaces:
          </Text>
        </Stack>

        <Stack spacing="16px">
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center" spacing="8px">
              <Checkbox />

              <Text fontSize="xs" fontWeight="semibold">
                Best chalk bag for beginners
              </Text>
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

              <Text fontSize="xs" fontWeight="semibold">
                Best chalk bag for beginners
              </Text>
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
