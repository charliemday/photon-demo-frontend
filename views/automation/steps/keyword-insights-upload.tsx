import { FC, useEffect, useState } from "react";
import { ModalStepWrapper } from "./modal-step-wrapper";

import {
  Checkbox,
  Flex,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  useCreateKeywordInsightOrderMutation,
  useUploadKeywordInsightsOutputMutation,
} from "api/engine.api";
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

const MAX_BATCH_OUTPUTS = 10; // Store this in a config file

export const KeywordInsightsUpload: FC<Props> = (props) => {
  const activeStrategy = useActiveContentStrategy();

  const [openaiModel, setOpenaiModel] = useState<string>("gpt-3.5");
  const [reportName, setReportName] = useState<string>("");
  const [sheetUrl, setSheetUrl] = useState<string>("");

  const [createOrder, { isLoading, isSuccess, isError, error }] =
    useCreateKeywordInsightOrderMutation();
  const [
    uploadKeywordInsights,
    {
      isLoading: isUploading,
      isSuccess: isUploadSuccess,
      isError: isUploadError,
      error: uploadError,
    },
  ] = useUploadKeywordInsightsOutputMutation();

  const toast = useToast();

  useEffect(() => {
    // Reset the state when the modal is closed
    if (props.isOpen) {
      setOpenaiModel("gpt-3.5");
      setBatchOutputs(MAX_BATCH_OUTPUTS);
      setReportName("");
    }
  }, [props.isOpen]);

  const handleSubmit = () => {
    if (activeStrategy?.id) {
      createOrder({
        contentStrategyId: activeStrategy?.id,
        sheetsUrl: sheetUrl,
        status: "complete",
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
          <Input
            placeholder="Enter the URL of the Google Sheet"
            onChange={(e) => setSheetUrl(e.target.value)}
            value={reportName}
          />
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
        <Stack>
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                setBatchOutputs(1);
              } else {
                setBatchOutputs(MAX_BATCH_OUTPUTS);
              }
            }}
          >
            <Tooltip
              label="Checking this box will only run a single batch for testing purposes (so we can keep the cost down)"
              hasArrow
            >
              <Text>Test Run</Text>
            </Tooltip>
          </Checkbox>
        </Stack>
      </HStack>
    </Stack>
  );

  return (
    <ModalStepWrapper {...props}>
      {headerComponent()}
      {/* <UploadZone
        title="Upload Keyword Insights Data"
        subtitle="Upload the output from Keyword Insights"
        uploadText="Upload the file here"
        isLoading={isLoading}
        handleUpload={handleUploadClick}
        headerComponent={headerComponent()}
      /> */}
      <HStack justifyContent="flex-end" mt={6}>
        <Button isLoading={isLoading} onClick={handleSubmit}>
          Submit
        </Button>
      </HStack>
    </ModalStepWrapper>
  );
};
