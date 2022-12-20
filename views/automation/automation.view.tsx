import React, { useRef, useState, useEffect } from "react";
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
  Select,
} from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { Button } from "components/button";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { GoogleLoginButton } from "react-social-login-buttons";

import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BRAND_COLOR } from "config";
import Head from "next/head";

import { useAutomation } from "hooks";
import { useCompleteOauthMutation } from "api/auth.api";
import { useUserDetailsQuery } from "api/user.api";
import {
  useCreateSearchConsoleReportMutation,
  useGetSearchConsoleSitesQuery,
} from "api/vendor.api";

export const AutomationView: React.FC = () => {
  const [rawDataFiles, setRawDataFiles] = useState<File[] | null>(null);
  const [alsoAskedFile, setAlsoAskedFile] = useState<File | null | undefined>(
    null
  );

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  const { data: user } = useUserDetailsQuery(undefined);

  const toast = useToast();

  const [completeOauth, { isLoading, isSuccess, isError }] =
    useCompleteOauthMutation();

  const [
    createReport,
    { isLoading: isReportLoading, isSuccess: isReportSuccess },
  ] = useCreateSearchConsoleReportMutation();

  const {
    isLoading: isSiteLoading,
    isSuccess: isSiteSuccess,
    data: sites,
  } = useGetSearchConsoleSitesQuery(undefined);

  const handleGetReport = () => {
    if (startDate && endDate && domain) {
      createReport({ startDate, endDate, domain });
    }
  };

  useEffect(() => {
    if (!isReportLoading && isReportSuccess) {
      toast({
        title: "Success",
        description: "Report created successfully. Check your Email.",
        status: "success",
        isClosable: true,
      });
    }
  }, [isReportLoading, isReportSuccess, toast]);

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
    await uploadAlsoAskedData(alsoAskedFile);
    setAlsoAskedFile(null);
  };

  const handleUploadClick = () => {
    rawDataInputRef.current?.click();
  };

  const handleUploadAlsoAskedClick = () => {
    console.log("handleUploadClick");
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
        <Box>
          <Heading fontSize="lg" mb={6}>
            3. Connect up your Google Search Console
          </Heading>
          <Text fontSize="xs" my={6} opacity={0.5}>
            {`This will allow Baser to access your Google Search Console data through Google's API so we can show your site metrics on your SEO hub.`}
          </Text>
          {/* @ts-ignore */}
          <GoogleLoginButton onClick={googleLogin}>
            <Text fontSize="sm">Connect up Google Search Console</Text>
          </GoogleLoginButton>
        </Box>
        <Divider />

        <Box>
          <Stack spacing={6}>
            <Heading fontSize="lg">4. Google Search Console Report</Heading>
            <Text fontSize="xs" opacity={0.5}>
              Get the search console report sent to info@getbaser.com
            </Text>
            <HStack>
              <Stack w="full">
                <Text fontSize="sm" fontWeight="semibold">
                  Start Date:
                </Text>
                <Input
                  type="date"
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                  size="sm"
                  bgColor="white"
                />
              </Stack>
              <Stack w="full">
                <Text fontSize="sm" fontWeight="semibold">
                  End Date:
                </Text>
                <Input
                  type="date"
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                  bgColor="white"
                  size="sm"
                />
              </Stack>
            </HStack>
            <Stack>
              <Text fontSize="sm" fontWeight="semibold">
                Domain
              </Text>
              <Select
                placeholder="Select Site"
                bgColor="white"
                onChange={({ target: { value } }) => setDomain(value)}
              >
                {sites?.map((site, idx) => (
                  <option key={idx} value={site}>
                    {site}
                  </option>
                ))}
              </Select>
            </Stack>
            <Flex justifyContent="flex-end">
              <Button
                size="sm"
                onClick={handleGetReport}
                isDisabled={!startDate || !endDate || !sites}
                isLoading={isReportLoading}
              >
                Get Report
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
