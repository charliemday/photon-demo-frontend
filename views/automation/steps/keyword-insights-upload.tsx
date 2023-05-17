import { FC, useEffect, useState } from "react";
import { ModalStepWrapper } from "./modal-step-wrapper";

import {
  Flex,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCreateKeywordInsightOrderMutation } from "api/engine.api";
import { useGenerateContentStrategyPart2ManualMutation } from "api/strategies.api";
import { typeCheckError } from "utils";

import { Button } from "components/button";
import { useActiveContentStrategy } from "hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GPT_MODELS = [
  { label: "GPT-3.5", value: "gpt-3.5" },
  { label: "GPT-4", value: "gpt-4" },
];

export const KeywordInsightsUpload: FC<Props> = (props) => {
  const activeStrategy = useActiveContentStrategy();

  const [openaiModel, setOpenaiModel] = useState<string>("gpt-3.5");
  const [sheetUrl, setSheetUrl] = useState<string>("");

  const [createOrder, { isLoading: isCreating }] =
    useCreateKeywordInsightOrderMutation();

  const [triggerManualStep, { isLoading, isSuccess, isError, error }] =
    useGenerateContentStrategyPart2ManualMutation();

  const toast = useToast();

  useEffect(() => {
    // Reset the state when the modal is closed
    if (props.isOpen) {
      setOpenaiModel("gpt-3.5");
      setSheetUrl("");
    }
  }, [props.isOpen]);

  const handleSubmit = () => {
    if (activeStrategy?.id) {
      createOrder({
        contentStrategyId: activeStrategy?.id,
        sheetsUrl: sheetUrl,
        status: "complete",
      })
        .then((res) => {
          if ("data" in res) {
            triggerManualStep({
              orderId: res.data?.orderId,
            });
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: typeCheckError(err) || "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description: "Your report has been uploaded",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      if (isError && error) {
        toast({
          title: "Error",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [isSuccess, isError, error, isLoading, toast]);

  const headerComponent = () => (
    <Stack spacing={6}>
      <HStack spacing={4}>
        <Flex flex={1}>
          <Stack>
            <Input
              placeholder="Enter the URL of the Google Sheet"
              onChange={(e) => setSheetUrl(e.target.value)}
              value={sheetUrl}
            />
            <Text fontSize="sm" opacity={0.75}>
              {`It needs to be of the form  https://docs.google.com/spreadsheets/d/<SHEET_ID>/copy`}
            </Text>
          </Stack>
        </Flex>
      </HStack>

      <HStack justifyContent="space-between">
        <HStack>
          <Flex>
            <Text fontSize="sm">OpenAI Model:</Text>
          </Flex>
          <Flex>
            <Select
              size="sm"
              value={openaiModel}
              onChange={(e) => setOpenaiModel(e.target.value)}
            >
              {GPT_MODELS.map((model, index) => (
                <option value={model.value} key={index}>
                  {model.label}
                </option>
              ))}
            </Select>
          </Flex>
        </HStack>
      </HStack>
    </Stack>
  );

  return (
    <ModalStepWrapper {...props}>
      {headerComponent()}

      <HStack justifyContent="flex-end" mt={6}>
        <Button isLoading={isLoading} onClick={handleSubmit}>
          Submit
        </Button>
      </HStack>
    </ModalStepWrapper>
  );
};
