import {
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Image } from "components/image";
import { BRAND_COLOR } from "config";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { FaBrain } from "react-icons/fa";
import { useSelector } from "react-redux";
import { BarLoader } from "react-spinners";

import { useProcessAhrefsDataMutation } from "api/engine.api";
import { Button } from "components/button";
import Link from "next/link";
import { RootState } from "store";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessRawData: React.FC<Props> = (props) => {
  const [rawDataFiles, setRawDataFiles] = useState<File[] | null>(null);

  const rawDataInputRef = useRef<HTMLInputElement>(null);
  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const [uploadRawData, { isLoading, isSuccess, error, isError }] =
    useProcessAhrefsDataMutation();

  const toast = useToast();

  const [classificationCategory, setClassificationCategory] = useState("");
  const [positivePrompts, setPositivePrompts] = useState<string[]>([]);
  const [negativePrompts, setNegativePrompts] = useState<string[]>([]);
  const [excludeSimilarKeywords, setExcludeSimilarKeywords] = useState(false);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Success",
        description:
          "Your CSV files are being processed and will be saved to the Drive.",
        status: "success",
        isClosable: true,
      });
    }

    if (!isLoading && isError && error) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isLoading, isSuccess, toast, error, isError]);

  useEffect(() => {
    if (rawDataInputRef.current) rawDataInputRef.current.value = "";
  }, [rawDataFiles]);

  const handleSubmit = async () => {
    if (!rawDataFiles || !rawDataFiles.length) return;
    let formData = new FormData();
    formData.append("team_id", activeTeam.id);

    rawDataFiles.forEach((file) => {
      formData.append("files", file);
    });

    const positiveClassificationsExist = positivePrompts.length > 0;
    const negativeClassificationsExist = negativePrompts.length > 0;

    if (classificationCategory)
      formData.append("classification_category", classificationCategory);
    if (positiveClassificationsExist)
      formData.append(
        "classification_positive_prompts",
        positivePrompts.join(",")
      );
    if (negativeClassificationsExist)
      formData.append(
        "classification_negative_prompts",
        negativePrompts.join(",")
      );

    formData.append(
      "exclude_similar_keywords",
      excludeSimilarKeywords.toString()
    );

    await uploadRawData(formData);

    setRawDataFiles(null);
  };

  const handleUploadClick = () => {
    rawDataInputRef.current?.click();
  };

  const renderRawDataUploadZone = () => (
    <Flex
      w="full"
      h={200}
      border={`solid 1px ${rawDataFiles?.length ? "green" : "lightgray"}`}
      justifyContent="center"
      alignItems="center"
      my={6}
      borderRadius={4}
      cursor="pointer"
      opacity={0.5}
      _hover={{
        opacity: 1,
      }}
      onClick={handleUploadClick}
      bgColor="white"
    >
      {rawDataFiles && rawDataFiles.length ? (
        <Stack alignItems="center" spacing={6}>
          <HStack>
            <BsCheckCircle fontSize={18} color="green" />
            <Text fontSize="sm" color="green.500">
              {rawDataFiles[0].name}{" "}
              {rawDataFiles.length > 1
                ? `and ${
                    rawDataFiles.length - 1 > 2
                      ? `${rawDataFiles.length - 1} others`
                      : `${rawDataFiles.length - 1} other`
                  }`
                : ``}{" "}
              ready for submission
            </Text>
          </HStack>
          {isLoading && <BarLoader color={BRAND_COLOR} />}
        </Stack>
      ) : (
        <HStack>
          <AiOutlineCloudDownload fontSize={18} />
          <Text fontSize="sm">Click here to upload the raw keyword data</Text>
        </HStack>
      )}
    </Flex>
  );

  const renderExamplePrompt = () => (
    <Stack mt={6}>
      <Heading fontSize="md" mb={2}>
        Example Prompt
      </Heading>
      <HStack opacity={0.5}>
        <Text fontSize="xs">
          This is the prompt that will be sent to the OpenAI API.
        </Text>
        <Link href="https://platform.openai.com/playground">
          <a target="_blank">
            <Text
              fontSize="xs"
              _hover={{
                textDecoration: "underline",
              }}
            >
              See OpenAI Playground.
            </Text>
          </a>
        </Link>
      </HStack>
      <Box border="solid 1px lightgray" p={4} borderRadius="md">
        <Text fontSize="sm">
          {`Classify the keywords according to whether it relates to "${classificationCategory}" or "Not ${classificationCategory}" and reset the context e.g.`}
        </Text>

        <Text fontSize="sm" mt={4}>
          {`${classificationCategory}: ${positivePrompts.join(", ")}`}
        </Text>
        <Text fontSize="sm" mt={4}>
          {`Not ${classificationCategory}: ${negativePrompts.join(", ")}`}
        </Text>

        <Text mt={4}>{`[KEYWORD LIST WILL BE AUTO INSERTED HERE]`}</Text>

        <Text fontSize="sm" mt={4}>
          {`The result should be two classifications with the prefix "${classificationCategory}" and "Not ${classificationCategory}" respectively.`}
        </Text>
      </Box>
    </Stack>
  );

  const renderPositivePromptInput = (idx: number) => (
    <Input
      onChange={(e) => {
        setPositivePrompts((prev) => {
          prev[idx] = e.target.value;
          return prev;
        });
      }}
    />
  );

  const renderNegativePromptInput = (idx: number) => (
    <Input
      onChange={(e) => {
        setNegativePrompts((prev) => {
          prev[idx] = e.target.value;
          return prev;
        });
      }}
    />
  );

  const promptsExist =
    classificationCategory.length &&
    positivePrompts.every((p) => p.length) &&
    negativePrompts.every((p) => p.length);

  const POSITIVE_PROMPTS = 10;
  const NEGATIVE_PROMPTS = 10;

  return (
    <ModalStepWrapper {...props}>
      <Box>
        <Heading fontSize="lg">1. Upload raw CSV {activeTeam?.name}</Heading>
        <Text fontSize="xs" my={6} opacity={0.75}>
          This will take a group of CSV files from Ahrefs and sort them to
          exclude duplicate keywords and only show the keywords on the the first
          2 pages
        </Text>
        <a download href="/demo/process-raw-data/demo.csv">
          <Text
            opacity={0.75}
            fontSize="xs"
            cursor="pointer"
            _hover={{
              textDecoration: "underline",
            }}
          >
            See the correct structure of a single input file here
          </Text>
        </a>

        <Divider my={12} />

        <HStack>
          <Box
            width={18}
            height={18}
            position="relative"
            borderRadius={4}
            overflow="hidden"
          >
            <Image src="steps/ahrefs.jpeg" layout="fill" alt="Ahrefs Logo" />
          </Box>
          <Heading fontSize="md">Ahrefs Export Data</Heading>
        </HStack>

        <Input
          type="file"
          onInput={(e: any) => setRawDataFiles(Object.values(e.target.files))}
          multiple
          ref={rawDataInputRef}
          display="none"
        />
        {renderRawDataUploadZone()}

        <Divider my={12} />

        <Stack
          spacing={6}
          opacity={excludeSimilarKeywords ? 1 : 0.5}
          _hover={{
            opacity: 1,
          }}
        >
          <HStack>
            <FaBrain />
            <Heading fontSize="md">Semantic Similarity (Optional)</Heading>
          </HStack>

          <Checkbox
            onChange={(e) => {
              setExcludeSimilarKeywords(e.target.checked);
            }}
          >
            <Text fontSize="xs" opacity={0.75}>
              {`Enable semantic similarity check`}
            </Text>
          </Checkbox>
          <Text fontSize="xs" opacity={0.75}>
            {`Exclude similar keywords e.g. "how do I buy" and "how to buy". Checking this box will increase the time it takes to process the data but remove similar sounding keywords.`}
          </Text>
        </Stack>

        <Divider mt={12} />

        <Stack
          spacing={12}
          mt={12}
          opacity={promptsExist ? 1 : 0.5}
          _hover={{
            opacity: 1,
          }}
        >
          <Stack>
            <HStack>
              <Box
                width={18}
                height={18}
                position="relative"
                borderRadius={4}
                overflow="hidden"
              >
                <Image
                  src="openai-avatar.png"
                  layout="fill"
                  alt="OpenAI Logo"
                />
              </Box>
              <Heading fontSize="md">Classification prompts (Optional)</Heading>
            </HStack>

            <Text fontSize="xs" opacity={0.75}>
              These prompts will be used in the OpenAI API call to help classify
              the keywords as to whether they are relevant or non-relevant.
              Leaving this blank will still produce the CSV but without
              relevance classification.
            </Text>
          </Stack>
          <FormControl>
            <FormLabel fontSize="sm">Classification category</FormLabel>
            <Input
              name="classificationCategory"
              type="text"
              onChange={(e) => setClassificationCategory(e.target.value)}
            />
            <FormHelperText fontSize="xs">e.g. Female Health</FormHelperText>
          </FormControl>

          <HStack w="full">
            <Stack w="full">
              <FormLabel fontSize="sm">Positive Classifications</FormLabel>
              {Array.from({ length: POSITIVE_PROMPTS }).map((_, idx) => {
                return renderPositivePromptInput(idx);
              })}
              <Text fontSize="xs" opacity={0.5}>
                These are the positive classifications{" "}
              </Text>
            </Stack>
            <Stack w="full">
              <FormLabel fontSize="sm">Negative Classifications</FormLabel>
              {Array.from({ length: NEGATIVE_PROMPTS }).map((_, idx) =>
                renderNegativePromptInput(idx)
              )}
              <Text fontSize="xs" opacity={0.5}>
                These are the negative classifications{" "}
              </Text>
            </Stack>
          </HStack>
        </Stack>
        {promptsExist ? renderExamplePrompt() : null}
        <Flex justifyContent="flex-end" pt={12}>
          <Button size="sm" onClick={() => setRawDataFiles(null)}>
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            isDisabled={!rawDataFiles || isLoading}
            isLoading={isLoading}
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </ModalStepWrapper>
  );
};
