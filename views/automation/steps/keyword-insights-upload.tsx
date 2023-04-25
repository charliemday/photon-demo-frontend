import { FC, useEffect, useState } from "react";
import { ModalStepWrapper } from "./modal-step-wrapper";

import {
  Box,
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
import { useUploadKeywordInsightsOutputMutation } from "api/engine.api";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { typeCheckError } from "utils";
import { UploadZone } from "./upload-zone";

import { FaRandom } from "react-icons/fa";

import { Button } from "components/button";
import * as ung from "unique-names-generator";

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
  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const [openaiModel, setOpenaiModel] = useState<string>("gpt-3.5");
  const [batchOutputs, setBatchOutputs] = useState<number>(MAX_BATCH_OUTPUTS);
  const [reportName, setReportName] = useState<string>("");

  const toast = useToast();

  useEffect(() => {
    // Reset the state when the modal is closed
    if (props.isOpen) {
      setOpenaiModel("gpt-3.5");
      setBatchOutputs(MAX_BATCH_OUTPUTS);
      setReportName("");
    }
  }, [props.isOpen]);

  const [uploadFile, { isLoading, isSuccess, isError, error }] =
    useUploadKeywordInsightsOutputMutation();

  const handleUploadClick = (files: File[]) => {
    let formData = new FormData();

    formData.append("file", files[0]);
    formData.append("team_id", activeTeam.id);
    formData.append("model", openaiModel);
    formData.append("outputs", batchOutputs.toString());
    formData.append("report_name", reportName);

    uploadFile(formData);
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

  const suggestRandomName = () => {
    const randomName = ung.uniqueNamesGenerator({
      dictionaries: [ung.adjectives, ung.colors, ung.animals],
    });

    setReportName(randomName);
  };

  const headerComponent = () => (
    <Stack spacing={6}>
      <HStack spacing={4}>
        <Flex flex={1}>
          <Input
            placeholder="Enter a name for your report"
            size="sm"
            onChange={(e) => setReportName(e.target.value)}
            value={reportName}
          />
        </Flex>
        <Flex>
          <Button onClick={suggestRandomName} size="sm" flex={1}>
            Suggest a name
            <Box ml={2}>
              <FaRandom />
            </Box>
          </Button>
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
          {/* <HStack>
            <Flex>
              <Text fontSize="sm">No. of Batch Outputs:</Text>
            </Flex>
            <Flex>
              <Select
                size="sm"
                value={batchOutputs}
                onChange={(e) => setBatchOutputs(Number(e.target.value))}
              >
                {Array.from(Array(10).keys()).map((n, index) => (
                  <option value={n + 1} key={index}>
                    {n + 1}
                  </option>
                ))}
              </Select>
            </Flex>
          </HStack> */}
        </Stack>
      </HStack>
    </Stack>
  );

  return (
    <ModalStepWrapper {...props}>
      <UploadZone
        title="Upload Keyword Insights Data"
        subtitle="Upload the output from Keyword Insights"
        uploadText="Upload the file here"
        isLoading={isLoading}
        handleUpload={handleUploadClick}
        headerComponent={headerComponent()}
      />
    </ModalStepWrapper>
  );
};
