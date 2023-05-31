import { Box, Divider, Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useGenerateSeedKeywordsMutation } from "api/engine.api";

import { Button } from "components/button";
import { SeedKeywordSource, SemrushDatabase } from "types";
import { ModalStepWrapper } from "../modal-step-wrapper";

import { useCreateCompetitorsMutation, useCreateSeedKeywordMutation } from "api/strategies.api";
import { CompetitorInterface } from "forms/competitors";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import { calculateSemrushCost, typeCheckError } from "utils";
import {
  CompetitorsSection,
  DatabaseSection,
  InputSection,
  NavTab,
  TargetKeywordsSection,
} from "views/automation/steps/seed-keywords";
import { Body } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SeedKeywords: React.FC<Props> = (props) => {
  const [database, setDatabase] = useState<SemrushDatabase>("uk");
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorInterface[]>([]);
  const [maxOrganicResults, setMaxOrganicResults] = useState<number>(300);
  const [maxPosition, setMaxPosition] = useState<number>(30);
  const [useCompetitors, setUseCompetitors] = useState<boolean>(true);

  const [step, setStep] = useState<number>(0);

  const activeTeam = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [createSeedKeywords] = useCreateSeedKeywordMutation();

  const [createCompetitors] = useCreateCompetitorsMutation();

  const [
    generateSeedKeywords,
    {
      isLoading: isGeneratingSeedKeywords,
      isError: hasErrorGeneratingSeedKeywords,
      error: generateSeedKeywordsError,
    },
  ] = useGenerateSeedKeywordsMutation();

  const toast = useToast();

  useEffect(() => {
    setStep(0);
    setIsLoading(false);
  }, [props.isOpen]);

  useEffect(() => {
    if (!isGeneratingSeedKeywords && hasErrorGeneratingSeedKeywords && generateSeedKeywordsError) {
      toast({
        title: "Error",
        description:
          typeCheckError(generateSeedKeywordsError) ||
          "Something went wrong with generating the seed keywords.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isGeneratingSeedKeywords, hasErrorGeneratingSeedKeywords, generateSeedKeywordsError, toast]);

  const handleSubmit = async () => {
    /**
     * On submitting we:
     * 1. Create the Seed Keywords for the Content Strategy (User Source)
     * 2. We then Create the Competitors for the Content Strategy
     * 3. We run the Generate Seed Keywords API
     */

    setIsLoading(true);

    createSeedKeywords({
      contentStrategyId: activeContentStrategy.id,
      body: {
        keywords: targetKeywords.map((k) => ({
          keyword: k,
          source: SeedKeywordSource.USER,
        })),
      },
    });

    createCompetitors({
      contentStrategyId: activeContentStrategy.id,
      body: competitors,
    });

    generateSeedKeywords({
      contentStrategyId: activeContentStrategy.id,
      maxOrganicResults,
      maxPosition,
      database,
    });

    setIsLoading(false);
  };

  const renderSeedKeywordSection = () => (
    <HStack alignItems="flex-start" spacing={12}>
      <Stack flex={1} spacing={12}>
        <TargetKeywordsSection onChangeKeywords={setTargetKeywords} />
        <Divider />
        <InputSection
          title={`Max Organic Results (Est. max cost: $${calculateSemrushCost({
            costPerLine: 10,
            noOfLines: maxOrganicResults,
            noOfRequests: useCompetitors
              ? (competitors.length + 15) * targetKeywords.length
              : 15 * targetKeywords.length,
          })})`}
          onChange={(value) => setMaxOrganicResults(value as number)}
          defaultValue={maxOrganicResults}
          helperText={`This is the number of organic results to return for each of the keywords. Note: the Max Cost is only if we use all of the competitors (some will be removed as they're duplicates and some may not return anything). For each keyword we will generate 15 competitors and add any custom competitors.`}
          label="Max Organic Results:"
        />
        <Divider />
        <InputSection
          title="Max Position"
          onChange={(value) => setMaxPosition(value as number)}
          defaultValue={maxPosition}
          helperText={`e.g. For a value of 20, we would only get the top 20 results`}
          label="Max Position:"
        />
      </Stack>
      <Stack flex={1} spacing={12}>
        <CompetitorsSection
          onChangeCompetitors={setCompetitors}
          activeTeam={activeTeam}
          onToggle={setUseCompetitors}
          defaultChecked={useCompetitors}
        />
        <Divider />
        <DatabaseSection onChange={setDatabase} />
        <Divider />
      </Stack>
    </HStack>
  );

  const STEPS = [
    {
      title: "Seed Keywords",
      content: renderSeedKeywordSection(),
      onClick: handleSubmit,
      buttonLabel: "Submit",
      buttonDisabled: (!targetKeywords.length && !competitors.length) || !database,
      isButtonLoading: isLoading,
    },
  ];

  const navItems = STEPS.map(({ title, content }, index) => ({
    label: title,
    onClick: () => setStep(index),
    isActive: step === index,
    content,
  }));

  return (
    <ModalStepWrapper {...props} size={"6xl"}>
      <Box>
        <Heading fontSize="lg">1. 🌱 Generate Seed Keywords through SEMRush</Heading>
        <Box my={6} opacity={0.75} w="75%">
          <Body>
            This automates the original Ahref’s step. This will take a list of competitors and
            generate a list of seed keywords from the SEMRush API to use for the next step. We can
            optionally classify the keywords into categories for deeper analysis.
          </Body>
        </Box>
        <Divider my={6} />

        <HStack alignItems="flex-start" spacing={12}>
          <Stack mb={6} flex={1} spacing={12}>
            <NavTab items={navItems} />
            {STEPS[step].content}
          </Stack>
        </HStack>
        <HStack justifyContent="flex-end" pt={12}>
          {step > 0 && (
            <Button size="lg" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button
            size="lg"
            onClick={STEPS[step].onClick}
            isDisabled={STEPS[step].buttonDisabled}
            isLoading={STEPS[step].isButtonLoading}
          >
            {STEPS[step].buttonLabel}
          </Button>
        </HStack>
      </Box>
    </ModalStepWrapper>
  );
};
