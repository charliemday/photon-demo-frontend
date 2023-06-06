import React, { useState, useRef, FC, useEffect } from "react";
import { ModalStepWrapper } from "./modal-step-wrapper";
import { Flex, Stack, HStack, Text, Box, Heading, Input, useToast, Link } from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { useUploadAhrefsReportMutation } from "api/vendor.api";
import { BRAND_COLOR } from "config";
import { typeCheckError } from "utils";
import { Button } from "components/button";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Body, Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadAhrefsReport: FC<Props> = (props) => {
  const [files, setFiles] = useState<File[] | null>(null);

  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const inputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const [uploadAhrefsReport, { isLoading, isSuccess, error, isError }] =
    useUploadAhrefsReportMutation();

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleUploadAhrefsReport = () => {
    if (!files || !files.length || !activeTeam) return;

    let formData = new FormData();

    formData.append("file", files[0]);
    formData.append("team", activeTeam.id);

    uploadAhrefsReport(formData);
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
          <Label>Click here to upload the manual Ahrefs data</Label>
        </HStack>
      )}
    </Flex>
  );

  return (
    <ModalStepWrapper {...props}>
      <Box>
        <Heading fontSize="lg">6. Upload Ahrefs Report {activeTeam?.name}</Heading>
        <Box my={6} opacity={0.75}>
          <Body>
            Upload custom Ahrefs report for {activeTeam?.name}. This will be saved on the Database
            as an Ahref report.
          </Body>
        </Box>
        <Link
          download
          href="/demo/ahrefs-report/demo.csv"
          opacity={0.75}
          cursor="pointer"
          _hover={{
            textDecoration: "underline",
          }}
        >
          <Body>See the correct structure of a single input file here</Body>
        </Link>
        <Input
          type="file"
          onInput={(e: any) => setFiles(Object.values(e.target.files))}
          multiple
          ref={inputRef}
          display="none"
        />
        {renderUploadZone()}
        <Flex justifyContent="flex-end">
          <Button size="sm" onClick={() => setFiles(null)}>
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleUploadAhrefsReport}
            isDisabled={!files || isLoading}
            isLoading={isLoading}
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </ModalStepWrapper>
  );
};
