import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { BarLoader } from "react-spinners";

import { usePeopleAlsoAskMutation } from "api/engine.api";
import { Button } from "components/button";
import { BaserMenu } from "components/menus";
import { BRAND_COLOR, GOOGLE_LANGUAGES } from "config";
import { GridInputForm } from "forms/grid-input";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";
import { InputSection } from "./seed-keywords";
import { Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PeopleAlsoAsked: React.FC<Props> = (props) => {
  const activeTeam = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();

  const [exclusionKeywords, setExclusionKeywords] = useState<string[]>([]);
  const [volumeThreshold, setVolumeThreshold] = useState<number>(1e3);
  const [useVolumeThreshold, setUseVolumeThreshold] = useState<boolean>(false);

  const alsoAskedInputRef = useRef<HTMLInputElement>(null);
  const [alsoAskedFile, setAlsoAskedFile] = useState<File | null | undefined>(null);
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (alsoAskedInputRef.current) alsoAskedInputRef.current.value = "";
  }, [alsoAskedFile]);

  useEffect(() => {
    setUseVolumeThreshold(false);
  }, [props.isOpen]);

  const [uploadAlsoAskedData, { isLoading, isSuccess, isError, error }] =
    usePeopleAlsoAskMutation();

  const toast = useToast();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Success",
        description:
          "Your CSV file has been sent. We will save the QuestionsAsked output to the Drive and notify you on Slack when it's ready.",
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

  const langOptions = useMemo(() => {
    return GOOGLE_LANGUAGES.map(({ language_code, language_name }) => ({
      value: language_code,
      label: `${language_name} (${language_code})`,
    }));
  }, []);

  const handleUploadAlsoAskedClick = () => {
    alsoAskedInputRef.current?.click();
  };

  const handleSubmitAlsoAskedData = async () => {
    if (!alsoAskedFile) return;

    const formData = new FormData();

    formData.append("file", alsoAskedFile);
    formData.append("language", language || "en");
    formData.append("content_strategy_id", activeContentStrategy?.id.toString());

    if (useVolumeThreshold) {
      formData.append("volume_threshold", volumeThreshold.toString());
    }

    if (exclusionKeywords.length > 0) {
      formData.append("exclusion_keywords", exclusionKeywords.join(","));
    }

    await uploadAlsoAskedData(formData);
    setAlsoAskedFile(null);
  };

  const renderAlsoAskedUploadZone = () => (
    <Flex
      w="full"
      h={200}
      border={`solid 1px ${alsoAskedFile ? "green" : "lightgray"}`}
      justifyContent="center"
      alignItems="center"
      my={6}
      borderRadius={4}
      cursor="pointer"
      opacity={0.5}
      _hover={{
        opacity: 1,
      }}
      onClick={handleUploadAlsoAskedClick}
      bgColor="white"
    >
      {alsoAskedFile ? (
        <Stack alignItems="center" spacing={6}>
          <HStack>
            <BsCheckCircle fontSize={18} color="green" />
            <Label color="green.500">{alsoAskedFile.name} ready for submission</Label>
          </HStack>
          {isLoading && <BarLoader color={BRAND_COLOR} />}
        </Stack>
      ) : (
        <HStack>
          <AiOutlineCloudDownload fontSize={18} />
          <Label>Click here to upload keyword data</Label>
        </HStack>
      )}
    </Flex>
  );

  return (
    <ModalStepWrapper {...props} size="6xl">
      <Box>
        <Heading fontSize="lg">2. Questions Asked for {activeTeam?.name}</Heading>
        <Text fontSize="xs" my={6} opacity={0.75}>
          {`This will take a CSV file with the first column of sorted keywords and get the "People Also Asked" questions for each keyword`}
        </Text>
        <a download href="/demo/people-also-ask/demo.csv">
          <Text
            opacity={0.75}
            fontSize="xs"
            cursor="pointer"
            _hover={{
              textDecoration: "underline",
            }}
          >
            See the correct structure of an input file here
          </Text>
        </a>
        <Input
          type="file"
          onInput={(e: any) => setAlsoAskedFile(e.target.files[0])}
          ref={alsoAskedInputRef}
          display="none"
        />
        {renderAlsoAskedUploadZone()}

        <Divider my={6} />

        <HStack alignItems="flex-start">
          <Flex flex={1}>
            <InputSection
              title="Volume Threshold"
              subtitle="Exclude running keywords through PAA with less than this volume"
              label="Volume"
              defaultValue={volumeThreshold}
              onChange={(e) => setVolumeThreshold(e as number)}
              onCheck={setUseVolumeThreshold}
              checkLabel="Use Volume Threshold"
              inputType="number"
              imageSrc={undefined}
            />
          </Flex>

          <Stack flex={1}>
            <Text fontSize="md" fontWeight="bold">
              🌍 Language to use in Google Search
            </Text>

            <Box>
              <BaserMenu
                defaultValue={langOptions[langOptions.findIndex(({ value }) => value === "en")]}
                onChange={(e: any) => setLanguage(e.value)}
                data={langOptions as any}
              />
            </Box>
          </Stack>
        </HStack>

        <Divider my={6} />

        <HStack>
          <Stack mb={6} flex={1}>
            <Stack mb={6}>
              <Text fontSize="md" fontWeight="bold">
                ✂️ Keywords to Exclude (Optional)
              </Text>
              <Text fontSize="xs" opacity={0.75}>
                {`Optionally add some target keywords you want to remove from the PAA output. For example if you
            add "mint" to the list, all the PAA questions that contain the word "mint" will be
            set as "Non-relevant" e.g. "How do you mint an NFT?" would be labeled "Non-relevant".`}
              </Text>
            </Stack>
            <GridInputForm
              onChange={(e) => setExclusionKeywords(e.filter((f) => f.length))}
              buttonLabel="Add a new exclusion keyword"
            />
          </Stack>
          <Flex flex={1} />
        </HStack>

        <Flex justifyContent="flex-end" pt={6}>
          <Button size="lg" onClick={() => setAlsoAskedFile(null)} color="white">
            Clear
          </Button>
          <Button
            size="lg"
            onClick={handleSubmitAlsoAskedData}
            isDisabled={!alsoAskedFile || isLoading}
            isLoading={isLoading}
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </ModalStepWrapper>
  );
};
