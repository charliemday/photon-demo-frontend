import { FC, useRef, useState } from "react";

import { Box, Flex, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";

import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { BarLoader } from "react-spinners";

import { BRAND_COLOR } from "config";
import { Body, Label } from "components/text";

interface Props {
  title: string;
  subtitle: string;
  uploadText: string;
  isLoading?: boolean;
  handleUpload?: (files: File[]) => void;
  headerComponent?: JSX.Element;
  footerComponent?: JSX.Element;
}

export const UploadZone: FC<Props> = ({
  title,
  subtitle,
  uploadText,
  isLoading,
  handleUpload,
  headerComponent,
  footerComponent,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[] | null>(null);

  const onClickUpload = () => {
    if (files && files.length) {
      handleUpload?.(files);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const renderUploadZone = () => (
    <Flex
      w="full"
      h={200}
      border={`solid 1px ${files?.length ? "green" : "lightgray"}`}
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
      {files && files.length ? (
        <Stack alignItems="center" spacing={6}>
          <HStack>
            <BsCheckCircle fontSize={18} color="green" />
            <Label color="green.500">
              {files[0].name}{" "}
              {files.length > 1
                ? `and ${
                    files.length - 1 > 2
                      ? `${files.length - 1} others`
                      : `${files.length - 1} other`
                  }`
                : ``}{" "}
              ready for submission
            </Label>
          </HStack>
          {isLoading && <BarLoader color={BRAND_COLOR} />}
        </Stack>
      ) : (
        <HStack>
          <AiOutlineCloudDownload fontSize={18} />
          <Label>{uploadText}</Label>
        </HStack>
      )}
    </Flex>
  );

  return (
    <Stack spacing={6}>
      <Heading fontSize="lg">{title}</Heading>
      {headerComponent}
      <Box my={6} opacity={0.75}>
        <Body>{subtitle}</Body>
      </Box>
      <Input
        type="file"
        onInput={(e: any) => setFiles(Object.values(e.target.files))}
        multiple
        ref={inputRef}
        display="none"
      />
      {renderUploadZone()}
      {footerComponent}
      <Flex justifyContent="flex-end">
        <Button size="sm" onClick={() => setFiles(null)}>
          Clear
        </Button>
        <Button
          size="sm"
          onClick={onClickUpload}
          isDisabled={!files || isLoading}
          isLoading={isLoading}
        >
          Upload
        </Button>
      </Flex>
    </Stack>
  );
};
