import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Stack,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BarLoader } from "react-spinners";

import { Button } from "components/button";
import { RootState } from "store";
import { BRAND_COLOR, GOOGLE_LANGUAGES } from "config";
import { useAutomation } from "hooks";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PeopleAlsoAsked: React.FC<Props> = (props) => {
  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const alsoAskedInputRef = useRef<HTMLInputElement>(null);
  const [alsoAskedFile, setAlsoAskedFile] = useState<File | null | undefined>(
    null
  );
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (alsoAskedInputRef.current) alsoAskedInputRef.current.value = "";
  }, [alsoAskedFile]);

  const { uploadAlsoAskedData, isAlsoAskedDataLoading } = useAutomation();

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
    if (!alsoAskedFile || !activeTeam?.id) return;
    await uploadAlsoAskedData({
      file: alsoAskedFile,
      language: language || "en",
      team: activeTeam?.id,
    });
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
            <Text fontSize="sm" color="green.500">
              {alsoAskedFile.name} ready for submission
            </Text>
          </HStack>
          {isAlsoAskedDataLoading && <BarLoader color={BRAND_COLOR} />}
        </Stack>
      ) : (
        <HStack>
          <AiOutlineCloudDownload fontSize={18} />
          <Text fontSize="sm">Click here to upload keyword data</Text>
        </HStack>
      )}
    </Flex>
  );

  return (
    <ModalStepWrapper {...props}>
      <Box>
        <Heading fontSize="lg">
          2. Questions Asked for {activeTeam?.name}
        </Heading>
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
        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            Language to use in Google Search:
          </Text>

          <ReactSelect
            className="basic-single"
            classNamePrefix="select"
            isSearchable
            name="color"
            defaultValue={
              langOptions[langOptions.findIndex(({ value }) => value === "en")]
            }
            onChange={(e: any) => setLanguage(e.value)}
            options={langOptions as any}
          />
        </Stack>
        <Flex justifyContent="flex-end" pt={6}>
          <Button size="sm" onClick={() => setAlsoAskedFile(null)}>
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSubmitAlsoAskedData}
            isDisabled={!alsoAskedFile || isAlsoAskedDataLoading}
            isLoading={isAlsoAskedDataLoading}
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </ModalStepWrapper>
  );
};
