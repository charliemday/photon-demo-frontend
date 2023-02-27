import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Image } from "components/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { SeedKeywordsBody, useSeedKeywordsMutation } from "api/engine.api";
import { useRetrieveClassificationQuery } from "api/team.api";
import { Button } from "components/button";
import { CompetitorsForm } from "forms/competitors";
import { CompetitorInterface } from "forms/competitors/competitors.form";
import Link from "next/link";
import { RootState } from "store";
import { Team } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

export const SeedKeywords: React.FC<Props> = (props) => {
  const [competitors, setCompetitors] = useState<CompetitorInterface[]>([]);
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: teamClassifications, refetch: refetchTeamClassification } =
    useRetrieveClassificationQuery(activeTeam?.uid, {
      skip: !activeTeam?.uid,
    });

  const [generateSeedKeywords, { isLoading, isSuccess, isError, error }] =
    useSeedKeywordsMutation();

  useEffect(() => {
    /**
     * If the user changes the active team, we need to refetch the
     * team classification data
     */
    refetchTeamClassification();
  }, [activeTeam, refetchTeamClassification]);

  const toast = useToast();

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

  const [autoClassify, setAutoClassify] = useState(
    teamClassifications?.autoClassify
  );

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Success",
        description:
          "Seed keywords are being generated and will be saved to the Drive.",
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

  const handleSubmit = async () => {
    const body: SeedKeywordsBody = {
      teamId: activeTeam.id.toString(),
      competitors,
    };

    const positiveClassificationsExist = positivePrompts.length > 0;
    const negativeClassificationsExist = negativePrompts.length > 0;

    if (autoClassify) {
      if (classificationCategory)
        body["classificationCategory"] = classificationCategory;
      if (positiveClassificationsExist)
        body["positivePrompts"] = positivePrompts;
      if (negativeClassificationsExist)
        body["negativePrompts"] = negativePrompts;
    }

    await generateSeedKeywords(body);
  };

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

  const renderPositivePromptInput = (idx: number) => (
    <Input
      onChange={(e) => {
        setPositivePrompts((prev) => {
          prev[idx] = e.target.value;
          return prev;
        });
      }}
      value={positivePrompts[idx]}
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
      value={negativePrompts[idx]}
    />
  );

  const promptsExist =
    (classificationCategory.length &&
      positivePrompts.every((p) => p.length) &&
      negativePrompts.every((p) => p.length)) ||
    autoClassify;

  const minPrompts =
    positivePrompts.length || negativePrompts?.length
      ? Math.min(positivePrompts.length, negativePrompts.length)
      : 0;

  const POSITIVE_PROMPTS = minPrompts || 10;
  const NEGATIVE_PROMPTS = minPrompts || 10;

  return (
    <ModalStepWrapper {...props}>
      <Box>
        <HStack alignItems="center" mb={6}>
          <Switch
            fontSize="sm"
            justifyContent="center"
            onChange={(e) => {
              props.onSwitch();
            }}
            isChecked
          >
            Switch for new step 1 automation
          </Switch>
        </HStack>
        <Badge colorScheme="green" mb={2}>
          New!
        </Badge>
        <Heading fontSize="lg">
          1. Generate Seed Keywords for {activeTeam?.name}
        </Heading>
        <Text fontSize="xs" my={6} opacity={0.75}>
          {`This automates the Ahref's step. This will take a list of competitors
          and generate a list of seed keywords from SEMRush to use for the next
          step. We can optionally classify the keywords into categories for
          deeper analysis.`}
        </Text>

        <Divider my={6} />

        <Stack mb={6}>
          <HStack>
            <Box
              width={18}
              height={18}
              position="relative"
              borderRadius={4}
              overflow="hidden"
            >
              <Image
                src="steps/semrush.jpeg"
                layout="fill"
                alt="Semrush Logo"
              />
            </Box>
            <Heading fontSize="md">Competitors</Heading>
          </HStack>
          <Text fontSize="xs" opacity={0.75} py={3}>
            List the competitor names and urls you want to compare against via
            SEMRush
          </Text>

          <CompetitorsForm onChange={setCompetitors} team={activeTeam} />
        </Stack>

        <Accordion allowMultiple defaultIndex={[0]}>
          <AccordionItem>
            <AccordionButton py={6}>
              <Flex justifyContent="space-between" w="full">
                <HStack>
                  <Box
                    width={18}
                    height={18}
                    position="relative"
                    borderRadius={4}
                    overflow="hidden"
                  >
                    <Image
                      src="openai-avatar.png"
                      layout="fill"
                      alt="OpenAI Logo"
                    />
                  </Box>
                  <Heading fontSize="md">
                    Classification prompts (Optional)
                  </Heading>
                </HStack>
                <AccordionIcon />
              </Flex>
            </AccordionButton>
            <AccordionPanel>
              <Stack
                spacing={12}
                opacity={promptsExist ? 1 : 0.5}
                _hover={{
                  opacity: 1,
                }}
              >
                <Stack>
                  <Checkbox
                    py={6}
                    defaultChecked={autoClassify}
                    onChange={(e) => {
                      setAutoClassify(e.target.checked);
                    }}
                  >
                    <Text fontSize="xs" opacity={0.75}>
                      Enable classification
                    </Text>
                  </Checkbox>

                  <Text fontSize="xs" opacity={0.75}>
                    These prompts will be used in the OpenAI API call to help
                    classify the keywords as to whether they are relevant or
                    non-relevant. Leaving this blank will still produce the CSV
                    but without relevance classification.
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
                  <FormHelperText fontSize="xs">
                    e.g. Female Health
                  </FormHelperText>
                </FormControl>

                <HStack w="full">
                  <Stack w="full">
                    <FormLabel fontSize="sm">
                      Positive Classifications
                    </FormLabel>
                    {Array.from({ length: POSITIVE_PROMPTS }).map((_, idx) =>
                      renderPositivePromptInput(idx)
                    )}
                    <Text fontSize="xs" opacity={0.5}>
                      These are the positive classifications{" "}
                    </Text>
                  </Stack>
                  <Stack w="full">
                    <FormLabel fontSize="sm">
                      Negative Classifications
                    </FormLabel>
                    {Array.from({ length: NEGATIVE_PROMPTS }).map((_, idx) =>
                      renderNegativePromptInput(idx)
                    )}
                    <Text fontSize="xs" opacity={0.5}>
                      These are the negative classifications{" "}
                    </Text>
                  </Stack>
                </HStack>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        {promptsExist ? renderExamplePrompt() : null}
        <Flex justifyContent="flex-end" pt={12}>
          <Button
            size="sm"
            onClick={handleSubmit}
            isDisabled={competitors.length == 0 || isLoading}
            isLoading={isLoading}
          >
            Upload
          </Button>
        </Flex>
      </Box>
    </ModalStepWrapper>
  );
};
