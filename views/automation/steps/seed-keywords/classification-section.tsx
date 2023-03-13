import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRetrieveClassificationQuery } from "api/team.api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";

import { Image } from "components/image";

interface Props {
  onAutoClassifyChange: (autoClassify: boolean) => void;
  onClassificationCategoryChange: (category: string) => void;
  onPositivePromptsChange: (prompts: string[]) => void;
  onNegativePromptsChange: (prompts: string[]) => void;
}

export const ClassificationSection: React.FC<Props> = ({
  onAutoClassifyChange,
  onClassificationCategoryChange,
  onPositivePromptsChange,
  onNegativePromptsChange,
}) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: teamClassifications, refetch: refetchTeamClassification } =
    useRetrieveClassificationQuery(activeTeam?.uid, {
      skip: !activeTeam?.uid,
    });

  useEffect(() => {
    /**
     * If the user changes the active team, we need to refetch the
     * team classification data
     */
    refetchTeamClassification();
  }, [activeTeam, refetchTeamClassification]);

  const promptCategory = teamClassifications && teamClassifications.category;
  const promptsPositive =
    teamClassifications?.targetKeywords &&
    teamClassifications.targetKeywords
      .split(",")
      .map((keyword) => keyword.trim());
  const promptsNegative =
    teamClassifications?.avoidanceKeywords &&
    teamClassifications.avoidanceKeywords
      .split(",")
      .map((keyword) => keyword.trim());

  const [classificationCategory, setClassificationCategory] = useState(
    promptCategory || ""
  );

  const [positivePrompts, setPositivePrompts] = useState<string[]>(
    promptsPositive || []
  );
  const [negativePrompts, setNegativePrompts] = useState<string[]>(
    promptsNegative || []
  );

  const [autoClassify, setAutoClassify] = useState<boolean | undefined>(
    teamClassifications?.autoClassify
  );

  useEffect(() => {
    /**
     * If any of the prompts change, we need to update the
     * parent component
     */
    if (onAutoClassifyChange && autoClassify !== undefined) {
      onAutoClassifyChange(autoClassify);
    }

    if (onClassificationCategoryChange) {
      onClassificationCategoryChange(classificationCategory);
    }

    if (onPositivePromptsChange) {
      onPositivePromptsChange(positivePrompts);
    }

    if (onNegativePromptsChange) {
      onNegativePromptsChange(negativePrompts);
    }
  }, [
    positivePrompts,
    negativePrompts,
    classificationCategory,
    autoClassify,
    onAutoClassifyChange,
    onClassificationCategoryChange,
    onPositivePromptsChange,
    onNegativePromptsChange,
  ]);

  const renderPositivePromptInput = (idx: number) => (
    <Input
      onChange={(e) => {
        setPositivePrompts((prev) => {
          prev[idx] = e.target.value;
          return prev;
        });
      }}
      defaultValue={positivePrompts[idx]}
    />
  );

  const renderNegativePromptInput = (idx: number) => (
    <Input
      onChange={(e) => {
        setNegativePrompts((prev) => {
          prev[idx] = e.target.value;
          return prev;
        });
      }}
      defaultValue={negativePrompts[idx]}
    />
  );

  const renderExamplePrompt = () => (
    <Stack mt={6}>
      <Heading fontSize="md" mb={2}>
        Example Prompt
      </Heading>
      <HStack opacity={0.5}>
        <Text fontSize="xs">
          This is the prompt that will be sent to the OpenAI API.
        </Text>
        <Link href="https://platform.openai.com/playground">
          <a target="_blank">
            <Text
              fontSize="xs"
              _hover={{
                textDecoration: "underline",
              }}
            >
              See OpenAI Playground.
            </Text>
          </a>
        </Link>
      </HStack>
      <Box border="solid 1px lightgray" p={4} borderRadius="md">
        <Text fontSize="sm">
          {`Classify the keywords according to whether it relates to "${classificationCategory}" or "Not ${classificationCategory}" and reset the context e.g.`}
        </Text>

        <Text fontSize="sm" mt={4}>
          {`${classificationCategory}: ${positivePrompts.join(", ")}`}
        </Text>
        <Text fontSize="sm" mt={4}>
          {`Not ${classificationCategory}: ${negativePrompts.join(", ")}`}
        </Text>

        <Text mt={4}>{`[KEYWORD LIST WILL BE AUTO INSERTED HERE]`}</Text>

        <Text fontSize="sm" mt={4}>
          {`The result should be two classifications with the prefix "${classificationCategory}" and "Not ${classificationCategory}" respectively.`}
        </Text>
      </Box>
    </Stack>
  );

  const promptsExist =
    classificationCategory.length &&
    positivePrompts.every((p) => p.length) &&
    negativePrompts.every((p) => p.length) &&
    autoClassify;

  const largerPrompts =
    positivePrompts.length > negativePrompts.length
      ? positivePrompts.length
      : negativePrompts.length;

  const minPrompts = Math.max(largerPrompts, 10);

  const POSITIVE_PROMPTS = minPrompts || 10;
  const NEGATIVE_PROMPTS = minPrompts || 10;

  return (
    <Box flex={1}>
      <Stack>
        <Flex justifyContent="space-between" w="full">
          <HStack>
            <Box
              width={18}
              height={18}
              position="relative"
              borderRadius={4}
              overflow="hidden"
            >
              <Image src="openai-avatar.png" layout="fill" alt="OpenAI Logo" />
            </Box>
            <Heading fontSize="md">Classification prompts (Optional)</Heading>
          </HStack>
        </Flex>
        <Stack>
          <Checkbox
            py={6}
            defaultChecked={autoClassify}
            onChange={(e) => {
              setAutoClassify(e.target.checked);
            }}
          >
            <Text fontSize="sm" opacity={0.75}>
              Enable classification
            </Text>
          </Checkbox>

          <Text fontSize="xs" opacity={0.75}>
            These prompts will be used in the OpenAI API call to help classify
            the keywords as to whether they are relevant or non-relevant.
            Leaving this blank will still produce the CSV but without relevance
            classification.
          </Text>
        </Stack>
        <FormControl>
          <FormLabel fontSize="sm">Classification category</FormLabel>
          <Input
            name="classificationCategory"
            type="text"
            onChange={(e) => setClassificationCategory(e.target.value)}
            value={classificationCategory}
          />
          <FormHelperText fontSize="xs">e.g. Female Health</FormHelperText>
        </FormControl>

        <HStack w="full">
          <Stack w="full">
            <FormLabel fontSize="sm">Positive Classifications</FormLabel>
            {Array.from({ length: POSITIVE_PROMPTS }).map((_, idx) =>
              renderPositivePromptInput(idx)
            )}
            <Text fontSize="xs" opacity={0.5}>
              These are the positive classifications{" "}
            </Text>
          </Stack>
          <Stack w="full">
            <FormLabel fontSize="sm">Negative Classifications</FormLabel>
            {Array.from({ length: NEGATIVE_PROMPTS }).map((_, idx) =>
              renderNegativePromptInput(idx)
            )}
            <Text fontSize="xs" opacity={0.5}>
              These are the negative classifications{" "}
            </Text>
          </Stack>
        </HStack>
      </Stack>
      {/* {promptsExist ? renderExamplePrompt() : null} */}
    </Box>
  );
};
