import React, { useRef, useState } from "react";
import {
  Input,
  Flex,
  Stack,
  HStack,
  Text,
  Container,
  Heading,
  Divider,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button as ChakraButton,
} from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { Button } from "components/button";

import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BRAND_COLOR } from "config";
import Head from "next/head";

import { useAutomation } from "hooks";
import { htmlTemplate } from "templates";
import { BsChevronDown } from "react-icons/bs";

interface Props {}

type PeopleAlsoAskedNode = {
  name: string;
  parent: string | null;
  children: PeopleAlsoAskedNode[];
};

interface AlsoAskedResponse extends Array<PeopleAlsoAskedNode> {
  [index: number]: PeopleAlsoAskedNode;
}

const Automation: React.FC<Props> = () => {
  const [rawDataFiles, setRawDataFiles] = useState<File[] | null>(null);
  const [alsoAskedFile, setAlsoAskedFile] = useState<File | null | undefined>(
    null
  );
  const [alsoAskedResponse, setAlsoAskedResponse] = useState<
    PeopleAlsoAskedNode[][]
  >([]);
  const [selectedKeyword, setSelectedKeyword] = useState<number>(0);

  const {
    uploadAlsoAskedData,
    uploadRawData,
    isAlsoAskedDataLoading,
    isRawDataLoading,
  } = useAutomation();

  const rawDataInputRef = useRef<HTMLInputElement>(null);
  const alsoAskedInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitRawData = async () => {
    if (!rawDataFiles || !rawDataFiles.length) return;

    await uploadRawData(rawDataFiles);

    setRawDataFiles(null);
  };

  const handleSubmitAlsoAskedData = async () => {
    if (!alsoAskedFile) return;

    const response = await uploadAlsoAskedData(alsoAskedFile);

    setAlsoAskedResponse(response);

    setAlsoAskedFile(null);
  };

  const handleUploadClick = () => {
    rawDataInputRef.current?.click();
  };

  const handleUploadAlsoAskedClick = () => {
    alsoAskedInputRef.current?.click();
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
    <Container size="2xl" py={32}>
      <Head>
        <title>Automation</title>
      </Head>

      <Heading fontSize="2xl" mb={8}>
        🤖 Welcome to the Automation page
      </Heading>

      <Divider my={6} />

      <Stack spacing={12}>
        <Box>
          <Heading fontSize="lg">1. Upload raw CSV</Heading>
          <Text fontSize="xs" mt={6} opacity={0.5}>
            This will take a group of CSV files from Ahrefs and sort them to
            exclude duplicate keywords and only show the keywords on the the
            first 2 pages
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
        <Divider />
        <Box>
          <Heading fontSize="lg">2. People Also Asked</Heading>
          <Text fontSize="xs" mt={6} opacity={0.5}>
            {`This will take a CSV file with the first column of sorted keywords and get the "People Also Asked" questions for each keyword`}
          </Text>
          <Input
            type="file"
            onInput={(e: any) => setAlsoAskedFile(e.target.files[0])}
            ref={alsoAskedInputRef}
            display="none"
          />
          {renderAlsoAskedUploadZone()}
          <Flex justifyContent="flex-end">
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

        <Divider />
        {alsoAskedResponse?.length && (
          <Box>
            <Heading fontSize="lg" mb={6}>
              3. People Also Asked Tree
            </Heading>
            <Text mb={3} fontSize="sm" fontWeight="medium">
              Select a Keyword
            </Text>
            <Menu>
              <MenuButton
                size="sm"
                as={ChakraButton}
                rightIcon={<BsChevronDown />}
                mb={6}
                variant="outline"
              >
                {alsoAskedResponse[selectedKeyword][0].name}
                test
              </MenuButton>
              <MenuList>
                {alsoAskedResponse.map((item, index) => (
                  <MenuItem
                    fontSize="sm"
                    key={index}
                    onClick={() => setSelectedKeyword(index)}
                  >
                    {item[0].name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Box border="solid 1px lightgray" borderRadius="md">
              <iframe
                srcDoc={htmlTemplate(
                  JSON.stringify(alsoAskedResponse[selectedKeyword])
                )}
                width="100%"
                height="500px"
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default Automation;
