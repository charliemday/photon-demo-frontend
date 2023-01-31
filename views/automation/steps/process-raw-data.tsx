import React, { useState, useRef, useEffect } from "react";
import {
  Flex,
  Stack,
  HStack,
  Text,
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BRAND_COLOR } from "config";
import { useSelector } from "react-redux";
import { Image } from "components/image";

import { useProcessAhrefsDataMutation } from "api/engine.api";
import { Button } from "components/button";
import { RootState } from "store";
import { ModalStepWrapper } from "./modal-step-wrapper";
import Link from "next/link";
import { typeCheckError } from "utils";

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
  const [positive1, setPositive1] = useState("");
  const [positive2, setPositive2] = useState("");
  const [positive3, setPositive3] = useState("");
  const [negative1, setNegative1] = useState("");
  const [negative2, setNegative2] = useState("");
  const [negative3, setNegative3] = useState("");

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

    const positiveClassificationsExist =
      positive1.length && positive2.length && positive3.length;
    const negativeClassificationsExist =
      negative1.length && negative2.length && negative3.length;

    if (classificationCategory)
      formData.append("classification_category", classificationCategory);
    if (positiveClassificationsExist)
      formData.append(
        "classification_positive_prompts",
        [positive1, positive2, positive3].join(",")
      );
    if (negativeClassificationsExist)
      formData.append(
        "classification_negative_prompts",
        [negative1, negative2, negative3].join(",")
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
          {`${classificationCategory}: ${positive1}, ${positive2}, ${positive3}`}
        </Text>
        <Text fontSize="sm" mt={4}>
          {`Not ${classificationCategory}: ${negative1}, ${negative2}, ${negative3}`}
        </Text>

        <Text mt={4}>{`[KEYWORD LIST WILL BE AUTO INSERTED HERE]`}</Text>

        <Text fontSize="sm" mt={4}>
          {`The result should be two classifications with the prefix "${classificationCategory}" and "Not ${classificationCategory}" respectively.`}
        </Text>
      </Box>
    </Stack>
  );

  const promptsExist =
    classificationCategory.length &&
    positive1.length &&
    positive2.length &&
    positive3.length &&
    negative1.length &&
    negative2.length &&
    negative3.length;

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

        <Divider mt={12} />

        <Stack spacing={12} mt={12}>
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
              <Input
                name="positive1"
                type="text"
                onChange={(e) => setPositive1(e.target.value)}
              />
              <Input
                name="positive2"
                onChange={(e) => setPositive2(e.target.value)}
              />
              <Input
                name="positive3"
                onChange={(e) => setPositive3(e.target.value)}
              />
              <Text fontSize="xs" opacity={0.5}>
                These are the positive classifications{" "}
              </Text>
            </Stack>
            <Stack w="full">
              <FormLabel fontSize="sm">Negative Classifications</FormLabel>
              <Input
                name="negative1"
                onChange={(e) => setNegative1(e.target.value)}
              />
              <Input
                name="negative2"
                onChange={(e) => setNegative2(e.target.value)}
              />
              <Input
                name="negative3"
                onChange={(e) => setNegative3(e.target.value)}
              />
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
