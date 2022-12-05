import React, { useRef, useState } from "react";
import {
  Input,
  Flex,
  Stack,
  HStack,
  Text,
  Container,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { Button } from "components/button";

import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BRAND_COLOR } from "config";
import { ROOT_URL } from "config/urls";

interface Props {}

const UploadCSV: React.FC<Props> = () => {
  const [csvFile, setCsvFile] = useState<File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const handleSubmit = async () => {
    if (!csvFile) return;

    setIsLoading(true);
    // Call the API to upload the CSV file
    const formData = new FormData();
    formData.append("file", csvFile);

    fetch(`${ROOT_URL}/process-csv`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.setAttribute("download", "output.xlsx");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setCsvFile(null);
        setIsLoading(false);

        toast({
          title: "Success",
          description: "Your CSV file has been processed",
          status: "success",
          isClosable: true,
        });
      })
      .catch(() => {
        setCsvFile(null);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const renderUploadZone = () => (
    <Flex
      w="full"
      h={200}
      border={`solid 1px ${csvFile ? "green" : "lightgray"}`}
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
    >
      {csvFile ? (
        <Stack alignItems="center" spacing={6}>
          <HStack>
            <BsCheckCircle fontSize={18} color="green" />
            <Text fontSize="sm" color="green.500">
              {csvFile.name} ready for submission
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

  return (
    <Container size="2xl" py={32}>
      <Heading fontSize="lg">Upload raw CSV</Heading>
      <Input
        type="file"
        onInput={(e: any) => setCsvFile(e.target.files?.[0])}
        ref={inputRef}
        display="none"
      />
      {renderUploadZone()}
      <Flex justifyContent="flex-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          isDisabled={!csvFile || isLoading}
          isLoading={isLoading}
        >
          Upload
        </Button>
      </Flex>
    </Container>
  );
};

export default UploadCSV;
