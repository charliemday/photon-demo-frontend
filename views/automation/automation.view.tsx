import React, { useRef, useState, useEffect, useMemo } from "react";
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
  useToast,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { BarLoader } from "react-spinners";
import { Button } from "components/button";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { GoogleLoginButton } from "react-social-login-buttons";

import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BRAND_COLOR, GOOGLE_LANGUAGES } from "config";
import Head from "next/head";

import { useAutomation } from "hooks";
import { useCompleteOauthMutation } from "api/auth.api";
import { useUserDetailsQuery } from "api/user.api";

import { SearchConsoleReport } from "./search-console-report";
import { CompareConsoleReport } from "./compare-console-report";

export const AutomationView: React.FC = () => {
  const [rawDataFiles, setRawDataFiles] = useState<File[] | null>(null);
  const [alsoAskedFile, setAlsoAskedFile] = useState<File | null | undefined>(
    null
  );
  const [language, setLanguage] = useState<string | null>(null);

  const { data: user } = useUserDetailsQuery(undefined);

  const toast = useToast();

  const [completeOauth, { isLoading, isSuccess, isError }] =
    useCompleteOauthMutation();

  const langOptions = useMemo(() => {
    return GOOGLE_LANGUAGES.map(({ language_code, language_name }) => ({
      value: language_code,
      label: `${language_name} (${language_code})`,
    }));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description:
            "Connected to Google Search Console successfully. We'll start processing your data shortly.",
          status: "success",
          isClosable: true,
        });
      }

      if (isError) {
        toast({
          title: "Error",
          description: "Could not connect to Google Search Console",
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [isLoading, isSuccess, isError, toast]);

  const {
    uploadAlsoAskedData,
    uploadRawData,
    isAlsoAskedDataLoading,
    isRawDataLoading,
  } = useAutomation();

  const rawDataInputRef = useRef<HTMLInputElement>(null);
  const alsoAskedInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (rawDataInputRef.current) rawDataInputRef.current.value = "";
    if (alsoAskedInputRef.current) alsoAskedInputRef.current.value = "";
  }, [alsoAskedFile, rawDataFiles]);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    onSuccess: (response: CodeResponse) => {
      // On Success we should complete the OAuth flow by exchanging the code for an access token
      completeOauth({ code: response.code, app: "google" });
    },
  });

  const handleSubmitRawData = async () => {
    if (!rawDataFiles || !rawDataFiles.length) return;

    await uploadRawData(rawDataFiles);

    setRawDataFiles(null);
  };

  const handleSubmitAlsoAskedData = async () => {
    if (!alsoAskedFile) return;
    await uploadAlsoAskedData(alsoAskedFile, language || "en");
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
    <Container size="2xl" py={32} pb={64}>
      <Head>
        <title>Automation</title>
      </Head>

      <Heading fontSize="2xl" mb={8}>
        {`🤖 Welcome to the Automation page, ${user?.firstName || ""}`}
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
                langOptions[
                  langOptions.findIndex(({ value }) => value === "en")
                ]
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
        <Divider />
        <Box>
          <Heading fontSize="lg" mb={6}>
            3. Connect up your Google Search Console
          </Heading>
          <Text fontSize="xs" my={6} opacity={0.5}>
            {`This will allow Baser to access your Google Search Console data through Google's API so we can show your site metrics on your SEO hub.`}
          </Text>
          {user?.connectedSearchConsole && (
            <HStack mb={6} color="green.400">
              <BsCheckCircle />
              <Text fontSize="sm" fontWeight="semibold">
                You are already connected to Google Search Console
              </Text>
            </HStack>
          )}
          <Box opacity={user?.connectedSearchConsole ? 0.5 : 1}>
            {/* @ts-ignore */}
            <GoogleLoginButton onClick={googleLogin}>
              <Text fontSize="sm">
                {user?.connectedSearchConsole
                  ? "Reconnect to Google Search Console"
                  : "Connect up Google Search Console"}
              </Text>
            </GoogleLoginButton>
          </Box>
        </Box>
        <Divider />

        <Box>
          <SearchConsoleReport
            isDisabled={user?.connectedSearchConsole === false}
          />
        </Box>
        <Box>{/* <CompareConsoleReport /> */}</Box>
      </Stack>
    </Container>
  );
};
