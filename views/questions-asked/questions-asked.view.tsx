import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input, Stack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Body, Heading } from "components/text";
import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { BarLoader } from "react-spinners";

import { usePeopleAlsoAskMutation } from "api/engine.api";
import { CsvExampleModal } from "components/modals";
import { Label } from "components/text";
import { BRAND_COLOR } from "config";
import { typeCheckError } from "utils";

export const QuestionsAskedView: FC = () => {
  const [email, setEmail] = useState<string | null>(null);

  const alsoAskedInputRef = useRef<HTMLInputElement>(null);
  const [alsoAskedFile, setAlsoAskedFile] = useState<File | null | undefined>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const {
    isOpen: isCsvExampleModalOpen,
    onOpen: onCsvExampleModalOpen,
    onClose: onCsvExampleModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (alsoAskedInputRef.current) alsoAskedInputRef.current.value = "";
  }, [alsoAskedFile]);

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

  const handleUploadAlsoAskedClick = () => {
    alsoAskedInputRef.current?.click();
  };

  const handleSubmitAlsoAskedData = async () => {
    if (!alsoAskedFile) return;

    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    const formData = new FormData();

    formData.append("file", alsoAskedFile);
    formData.append("email", email || "");

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
          <Body>Click here to upload a CSV file</Body>
        </HStack>
      )}
    </Flex>
  );

  return (
    <Container py={6} pt={24}>
      <Heading>People Also Asked</Heading>
      <CsvExampleModal 
        isOpen={isCsvExampleModalOpen}
        onClose={onCsvExampleModalClose}
        url="https://docs.google.com/spreadsheets/d/1WvUjY_Tm4pCpAWa6B3TVrCwKqkJNKbGJizKafXyH9zw/edit?usp=sharing"
      />
      <Box>
        <Box my={3}>
          <Body>
            This will take a CSV file with the first column of sorted keywords and get the “People
            Also Asked” questions for each keyword
          </Body>
        </Box>
          <Body
            onClick={() => onCsvExampleModalOpen()}
            cursor="pointer"
            _hover={{
              textDecoration: "underline",
            }}
          >See the correct structure of an input file here</Body>
      
        <Input
          type="file"
          onInput={(e: any) => setAlsoAskedFile(e.target.files[0])}
          ref={alsoAskedInputRef}
          display="none"
        />
        {renderAlsoAskedUploadZone()}

        <FormControl isInvalid={!!emailError}>
          <FormLabel>
            <Stack>
              <Heading fontSize="md">Email</Heading>
              <Body>We will send you an email when the output is ready.</Body>
            </Stack>
            <FormErrorMessage>
              <Body>{emailError}</Body>
            </FormErrorMessage>
          </FormLabel>
          <Input
            bg="white"
            placeholder="questions@asked.com"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            fontSize="sm"
          />
        </FormControl>

        <HStack justifyContent="flex-end" pt={6}>
          <Button onClick={() => setAlsoAskedFile(null)} variant="outline">
            Clear
          </Button>
          <Button
            onClick={handleSubmitAlsoAskedData}
            isDisabled={!alsoAskedFile || isLoading || !email}
            isLoading={isLoading}
            colorScheme="blue"
          >
            Go 🚀
          </Button>
        </HStack>
      </Box>
    </Container>
  );
};
