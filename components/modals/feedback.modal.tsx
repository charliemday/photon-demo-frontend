import { HStack, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { useSubmitFeedbackMutation } from "api/user.api";
import { Button } from "components/button";
import React, { useEffect, useState } from "react";
import { VscFeedback } from "react-icons/vsc";
import { typeCheckError } from "utils";
import { Modal } from "./modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState("");

  const toast = useToast();

  const [submitFeedback, { isLoading, isSuccess, isError, error }] = useSubmitFeedbackMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      onClose();
      toast({
        title: "Feedback submitted!",
        description: "Thanks for your feedback!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    if (!isLoading && isError) {
      toast({
        title: typeCheckError(error) || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isLoading, isSuccess, isError, error, toast, onClose]);

  useEffect(() => {
    if (isOpen) {
      setFeedback("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Stack spacing={12}>
        <HStack>
          <VscFeedback size={32} />
          <Text fontSize="lg" fontWeight="bold">
            Feedback
          </Text>
        </HStack>
        <Textarea
          value={feedback}
          p={4}
          rows={10}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="We'd love to hear any feedback...especially the parts you don't like!"
        />
      </Stack>
      <HStack pt={6} justifyContent="flex-end">
        <Button
          isLoading={isLoading}
          onClick={() => submitFeedback({ feedback })}
          isDisabled={!feedback || feedback.length === 0}
        >
          Submit
        </Button>
      </HStack>
    </Modal>
  );
};
