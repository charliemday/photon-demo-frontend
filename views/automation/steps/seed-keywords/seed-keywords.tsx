import {
  Box,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  SeedKeywordsBody,
  useClusterKeywordsMutation,
  useGenerateSeedKeywordsMutation,
  useSeedKeywordsMutation,
} from "api/engine.api";
import {
  useBulkCreateSeedKeywordsMutation,
  useCreateCompetitorsMutation,
  useUpdateClassificationsMutation,
} from "api/team.api";
import { Button } from "components/button";
import { RootState } from "store";
import { SemrushDatabase, Team } from "types";
import { ModalStepWrapper } from "../modal-step-wrapper";

import { TeamClassification } from "api/team.api";
import { CompetitorInterface } from "forms/competitors";
import { calculateSemrushCost, typeCheckError } from "utils";
import {
  ClassificationSection,
  CompetitorsSection,
  DatabaseSection,
  InputSection,
  KeywordThemeSection,
  NavTab,
  TargetKeywordsSection,
} from "views/automation/steps/seed-keywords";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SeedKeywords: React.FC<Props> = (props) => {
  const [database, setDatabase] = useState<SemrushDatabase>("uk");
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorInterface[]>([]);
  const [checkClustering, setCheckClustering] = useState<boolean>(false);
  const [broadKeywordsCount, setBroadKeywordsCount] = useState<number>(10);
  const [maxOrganicResults, setMaxOrganicResults] = useState<number>(300);
  const [maxPosition, setMaxPosition] = useState<number>(30);
  const [useCompetitors, setUseCompetitors] = useState<boolean>(true);

  const [step, setStep] = useState<number>(1);

  const [keywordThemes, setKeywordThemes] = useState<string[]>([]);

  const [classify, setClassify] = useState<boolean>(true);
  const [classificationCategory, setClassificationCategory] = useState<
    string | null
  >(null);
  const [positivePrompts, setPositivePrompts] = useState<string[]>([]);
  const [negativePrompts, setNegativePrompts] = useState<string[]>([]);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const [generateSeedKeywords, { isLoading, isError, error }] =
    useSeedKeywordsMutation();

  const [
    generateSeedKeywordsv2,
    {
      isLoading: isGeneratingSeedKeywords,
      isError: hasErrorGeneratingSeedKeywords,
      error: generateSeedKeywordsError,
    },
  ] = useGenerateSeedKeywordsMutation();

  const [
    bulkCreateSeedKeywords,
    {
      isLoading: isBulkCreatingSeedKeywords,
      isError: hasErrorBulkCreatingSeedKeywords,
      error: bulkCreateSeedKeywordsError,
    },
  ] = useBulkCreateSeedKeywordsMutation();

  const [
    createCompetitors,
    {
      isLoading: isCreatingCompetitors,
      isError: hasErrorCreatingCompetitors,
      error: createCompetitorsError,
    },
  ] = useCreateCompetitorsMutation();

  const [
    updateClassifications,
    {
      isLoading: isUpdatingClassifications,
      isError: hasErrorUpdatingClassifications,
      error: updateClassificationsError,
    },
  ] = useUpdateClassificationsMutation();

  // TODO: Uncomment when the API is ready
  // const [
  //   createKeywordThemes,
  //   {
  //     isLoading: isCreatingKeywordThemes,
  //     isError: hasErrorCreatingKeywordThemes,
  //     error: createKeywordThemesError,
  //   },
  // ] = useCreateKeywordThemesMutation();

  const [
    runClustering,
    {
      isLoading: isClustering,
      isError: isClusteringError,
      error: clusteringError,
    },
  ] = useClusterKeywordsMutation();

  const toast = useToast();

  useEffect(() => {
    setStep(0);
  }, [props.isOpen]);

  useEffect(() => {
    if (!isLoading && isError && error) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong.",
        status: "error",
        isClosable: true,
      });
    }

    if (!isClustering && isClusteringError && clusteringError) {
      toast({
        title: "Error",
        description:
          typeCheckError(clusteringError) ||
          "Something went wrong with the Clustering.",
        status: "error",
        isClosable: true,
      });
    }

    if (
      !isGeneratingSeedKeywords &&
      hasErrorGeneratingSeedKeywords &&
      generateSeedKeywordsError
    ) {
      toast({
        title: "Error",
        description:
          typeCheckError(generateSeedKeywordsError) ||
          "Something went wrong with generating the seed keywords.",
        status: "error",
        isClosable: true,
      });
    }
  }, [
    isError,
    error,
    isClustering,
    isClusteringError,
    clusteringError,
    isGeneratingSeedKeywords,
    hasErrorGeneratingSeedKeywords,
    generateSeedKeywordsError,
    isLoading,
    toast,
  ]);

  useEffect(
    () => {
      if (
        !isUpdatingClassifications &&
        hasErrorUpdatingClassifications &&
        updateClassificationsError
      ) {
        toast({
          title: "Error",
          description:
            typeCheckError(updateClassificationsError) ||
            "Something went wrong with updating the classifications.",
          status: "error",
          isClosable: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isUpdatingClassifications,
      hasErrorUpdatingClassifications,
      updateClassificationsError,
    ]
  );

  useEffect(
    () => {
      if (
        !isBulkCreatingSeedKeywords &&
        hasErrorBulkCreatingSeedKeywords &&
        bulkCreateSeedKeywordsError
      ) {
        toast({
          title: "Error",
          description:
            typeCheckError(bulkCreateSeedKeywordsError) ||
            "Something went wrong with creating the seed keywords.",
          status: "error",
          isClosable: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isBulkCreatingSeedKeywords,
      hasErrorBulkCreatingSeedKeywords,
      bulkCreateSeedKeywordsError,
    ]
  );

  useEffect(
    () => {
      if (
        !isCreatingCompetitors &&
        hasErrorCreatingCompetitors &&
        createCompetitorsError
      ) {
        toast({
          title: "Error",
          description:
            typeCheckError(createCompetitorsError) ||
            "Something went wrong with creating the competitors.",
          status: "error",
          isClosable: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCreatingCompetitors, hasErrorCreatingCompetitors, createCompetitorsError]
  );

  const handleSubmit = async () => {
    if (classify) {
      const body: TeamClassification = {
        teamUid: activeTeam.uid,
        targetKeywords: positivePrompts.join(","),
        avoidanceKeywords: negativePrompts.join(","),
        category: classificationCategory,
      };
      const response = await updateClassifications(body);
      if ("error" in response) {
        return;
      }
    }

    const generateSeedKeywordsResponse = await generateSeedKeywordsv2({
      teamId: activeTeam.id.toString(),
      maxOrganicResults,
      maxPosition,
      classify,
      database,
      useCompetitors,
    });

    if ("data" in generateSeedKeywordsResponse) {
      toast({
        title: "Success",
        description: "Seed keywords are being generated.",
        status: "success",
        isClosable: true,
      });
      props.onClose();
    }
  };

  // TODO: Uncomment this when the API is ready
  // const handleSaveThemes = async () => {
  //   const body: CreateKeywordsThemesBody = {
  //     teamId: activeTeam.id.toString(),
  //     themes: keywordThemes,
  //   };
  //   const response = await createKeywordThemes(body);

  //   if ("data" in response) {
  //     setStep((s) => s + 1);
  //   }
  // };

  const handleSetup = async () => {
    const body: SeedKeywordsBody = {
      teamId: activeTeam.id.toString(),
      keywords: targetKeywords,
      database,
      maxPosition,
      maxOrganicResults,
    };

    if (useCompetitors) {
      body["competitors"] = competitors;
    }

    if (checkClustering) {
      // If the "Run Clustering Checkbox" is checked then we
      // will run the clustering algorithm on the generated keywords

      body["limit"] = broadKeywordsCount;
      const response = await runClustering(body);

      if ("data" in response) {
        // The clustering is complete so we can now show the clustering results
        // to the user
        setStep((s) => s + 1);
      }
    } else {
      let proceed = true;

      // Save the seed keywords
      const createSeedKeywordsResponse = await bulkCreateSeedKeywords({
        teamUid: activeTeam.uid,
        keywords: targetKeywords,
      });

      if ("error" in createSeedKeywordsResponse) proceed = false;

      // Save the competitors
      if (useCompetitors) {
        const createCompetitorsResponse = await createCompetitors(
          competitors.map((c) => ({
            competitorName: c.name,
            competitorUrl: c.url,
            team: activeTeam.id,
          }))
        );
        if ("error" in createCompetitorsResponse) proceed = false;
      }

      if (proceed) {
        setStep((s) => s + 1);
      }
    }
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
        {/* <Divider />
        <InputSection
          title={`Max Organic Results (Max Cost: $${calculateSemrushCost({
            costPerLine: 20,
            noOfLines: broadKeywordsCount,
            noOfRequests: 4,
          })})`}
          subtitle="Run the each of the target keywords through the Broad Keywords API to return a list of themes to manually select from"
          onChange={(value) => setBroadKeywordsCount(value as number)}
          defaultValue={broadKeywordsCount}
          helperText={`This is the number of Broad Keywords to return for each of the
          Target Keywords in the "Expanding Broad Keywords" section of the flow`}
          label="Broad Keywords Count:"
          checkLabel="Generate Themes?"
          isChecked={checkClustering}
          onCheck={setCheckClustering}
        /> */}
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

  const renderThemeSection = () => (
    <HStack>
      <KeywordThemeSection onSelectTheme={setKeywordThemes} />
    </HStack>
  );

  const renderClassificationSection = () => (
    <HStack w="50%">
      <ClassificationSection
        onAutoClassifyChange={setClassify}
        onClassificationCategoryChange={setClassificationCategory}
        onPositivePromptsChange={setPositivePrompts}
        onNegativePromptsChange={setNegativePrompts}
      />
    </HStack>
  );

  const STEPS = [
    {
      title: "Seed Keywords",
      content: renderSeedKeywordSection(),
      onClick: handleSetup,
      buttonLabel: "Continue 👉",
      buttonDisabled:
        (!targetKeywords.length && !competitors.length) || !database,
      isButtonLoading: isBulkCreatingSeedKeywords || isCreatingCompetitors,
    },
    // {
    //   title: "Keyword Themes",
    //   content: renderThemeSection(),
    //   onClick: handleSaveThemes,
    //   buttonLabel: "Setup Step 2 👉",
    //   buttonDisabled: !keywordThemes.length,
    // },
    {
      title: "Classifications",
      content: renderClassificationSection(),
      onClick: handleSubmit,
      buttonLabel: "Run Step 1 🚀",
      buttonDisabled: false,
      isButtonLoading:
        isUpdatingClassifications || isGeneratingSeedKeywords || isLoading,
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
        <Heading fontSize="lg">
          1. 🌱 Generate Seed Keywords through SEMRush
        </Heading>
        <Text fontSize="xs" my={6} opacity={0.75} w="75%">
          {`This automates the original Ahref's step. This will take a list of competitors
          and generate a list of seed keywords from the SEMRush API to use for the next
          step. We can optionally classify the keywords into categories for
          deeper analysis.`}
        </Text>

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
              👈 Back
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
