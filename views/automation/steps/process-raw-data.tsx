import React, { useState, useRef, useEffect } from "react";
import {
  Flex,
  Stack,
  HStack,
  Text,
  Box,
  Heading,
  Input,
} from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BRAND_COLOR } from "config";
import { useSelector } from "react-redux";

import { useAutomation } from "hooks";
import { Button } from "components/button";
import { RootState } from "store";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessRawData: React.FC<Props> = (props) => {
  const [rawDataFiles, setRawDataFiles] = useState<File[] | null>(null);

  const rawDataInputRef = useRef<HTMLInputElement>(null);
  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const { uploadRawData, isRawDataLoading } = useAutomation();

  useEffect(() => {
    if (rawDataInputRef.current) rawDataInputRef.current.value = "";
  }, [rawDataFiles]);

  const handleSubmitRawData = async () => {
    if (!rawDataFiles || !rawDataFiles.length) return;

    await uploadRawData(rawDataFiles);

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
          {isRawDataLoading && <BarLoader color={BRAND_COLOR} />}
        </Stack>
      ) : (
        <HStack>
          <AiOutlineCloudDownload fontSize={18} />
          <Text fontSize="sm">Click here to upload the raw keyword data</Text>
        </HStack>
      )}
    </Flex>
  );

  return (
    <ModalStepWrapper {...props}>
      <Box>
        <Heading fontSize="lg">1. Upload raw CSV {activeTeam?.name}</Heading>
        <Text fontSize="xs" mt={6} opacity={0.5}>
          This will take a group of CSV files from Ahrefs and sort them to
          exclude duplicate keywords and only show the keywords on the the first
          2 pages
        </Text>
        <Input
          type="file"
          onInput={(e: any) => setRawDataFiles(Object.values(e.target.files))}
          multiple
          ref={rawDataInputRef}
          display="none"
        />
        {renderRawDataUploadZone()}
        <Flex justifyContent="flex-end">
          <Button size="sm" onClick={() => setRawDataFiles(null)}>
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSubmitRawData}
            isDisabled={!rawDataFiles || isRawDataLoading}
            isLoading={isRawDataLoading}
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </ModalStepWrapper>
  );
};
