import {
  Box,
  Container,
  Divider,
  HStack,
  Input,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Image } from "components/image";
import { BaserMenu } from "components/menus";
import React, { useState } from "react";
import {
  metricalFields,
  metricOperations,
  textFields,
  textOperations,
} from "./data";

import { AiOutlineCopy } from "react-icons/ai";

interface Props {}

enum Sign {
  INCLUDE = "+",
  EXCLUDE = "-",
}

const signOptions = [
  { value: Sign.INCLUDE, label: "Include" },
  { value: Sign.EXCLUDE, label: "Exclude" },
];

enum FieldType {
  METRIC = "Metrical",
  TEXT = "Textual",
}

export const DeveloperView: React.FC<Props> = () => {
  const [sign, setSign] = useState<Sign>(Sign.INCLUDE);

  const [field, setField] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const toast = useToast();

  const [fieldType, setFieldType] = useState<FieldType>(FieldType.METRIC);

  const fieldData =
    fieldType === FieldType.METRIC ? metricalFields : textFields;
  const operationData =
    fieldType === FieldType.METRIC ? metricOperations : textOperations;

  const buildResult = () => `${sign}|${field}|${operation}|${value}`;

  const copyResultToClipboard = () => {
    navigator.clipboard.writeText(buildResult());
    toast({
      title: "Copied to clipboard",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="50vw" pt={12}>
      <Stack spacing={12}>
        <Stack>
          <HStack>
            <Box
              position="relative"
              h={30}
              w={30}
              overflow="hidden"
              borderRadius="md"
            >
              <Image
                src="/steps/semrush.jpeg"
                layout="fill"
                alt="SEMRush Logo"
              />
            </Box>

            <Text fontSize="2xl" fontWeight="semibold">
              Filter Builder
            </Text>
          </HStack>
          <Text>Build complex SEMRush API filters</Text>
        </Stack>
        <HStack alignItems="center">
          <Text>{fieldType} Fields:</Text>
          <Switch
            onChange={() => {
              setFieldType(
                fieldType === FieldType.METRIC
                  ? FieldType.TEXT
                  : FieldType.METRIC
              );
            }}
          />
        </HStack>

        <HStack>
          <Text>Sign:</Text>
          <BaserMenu onChange={(v) => setSign(v as Sign)} data={signOptions} />
        </HStack>

        <HStack>
          <Text>Field:</Text>
          <BaserMenu onChange={setField} data={fieldData} />
        </HStack>

        <HStack>
          <Text>Operation:</Text>
          <BaserMenu onChange={setOperation} data={operationData} />
        </HStack>

        <HStack>
          <Text>Value:</Text>
          <Input
            maxW="50%"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </HStack>
      </Stack>

      <Divider my={6} />

      <Stack
        border="solid 1px lightgray"
        minH={200}
        boxShadow="xs"
        borderRadius="md"
        p={3}
        position="relative"
      >
        <Text fontSize="sm" opacity={0.5}>
          Result:
        </Text>
        <Text fontWeight="bold" fontSize="2xl" letterSpacing={1}>
          {buildResult()}
        </Text>

        <Box w="80%" position="absolute" bottom={3} left={3}>
          <Text fontSize="sm" opacity={0.5}>
            {`Note: If you're using the '+' symbol you may have replace with '%2B' to URL encode it. See https://www.webatic.com/ascii-table`}
          </Text>
        </Box>

        <Box
          cursor="pointer"
          opacity={0.75}
          _hover={{
            opacity: 1,
          }}
          position="absolute"
          right={5}
          bottom={5}
          title="Copy to clipboard"
          onClick={copyResultToClipboard}
        >
          <AiOutlineCopy fontSize={32} />
        </Box>
      </Stack>
    </Container>
  );
};
