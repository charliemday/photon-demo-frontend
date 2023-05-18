import {
  Box,
  Button as ChakraButton,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import {
  useDeleteContentStrategyMutation,
  useListContentStrategiesQuery,
} from "api/strategies.api";
import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery } from "api/user.api";
import { Button, FloatingButton, FloatingButtonContentStrategy } from "components/button";

import { AutomationCard } from "components/cards";
import { ConfirmationModal } from "components/modals";
import { ContentStrategy } from "components/wizards";
import { useActiveContentStrategy, useActiveTeam, useContentStrategies } from "hooks";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setActiveContentStrategy } from "store/slices";
import { removeContentStrategy } from "store/slices/strategy.slice";
import { TeamType } from "types";
import { typeCheckError } from "utils";
import { KEY, STEPS } from "./config";
import {
  BroadSeedKeywords,
  KeywordInsightsResults,
  KeywordInsightsUpload,
  PeopleAlsoAsked,
  PopulateSCReports,
  SearchConsoleConnect,
  SearchConsoleReport,
  SeedKeywords,
  TeamBlogs,
  WordSeek,
} from "./steps";
import { GenerateKIInput } from "./steps/seed-keywords";

export const AutomationView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<KEY>(KEY.COMPARE_CONSOLE_REPORT);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const {
    isOpen: isContentStrategyOpen,
    onClose: onCloseContentStrategy,
    onOpen: onOpenContentStrategy,
  } = useDisclosure();

  const {
    isOpen: isConfirmDeleteOpen,
    onClose: onCloseConfirmDelete,
    onOpen: onOpenConfirmDelete,
  } = useDisclosure();

  const { data: user } = useUserDetailsQuery(undefined);
  const { data: teams } = useListTeamsQuery({
    teamType: TeamType.INTERNAL,
  });
  const activeTeam = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();
  const contentStrategies = useContentStrategies();

  useListContentStrategiesQuery(
    {
      teamId: activeTeam?.id,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [
    deleteContentStrategy,
    {
      isLoading: isDeletingContentStrategy,
      isSuccess: isDeletedContentStrategy,
      isError: isDeleteContentStrategyError,
      error: deleteContentStrategyError,
    },
  ] = useDeleteContentStrategyMutation();

  useEffect(() => {
    /**
     * Handle the deletion of a content strategy
     */
    if (!isDeletingContentStrategy) {
      onCloseConfirmDelete();
      if (isDeletedContentStrategy) {
        toast({
          title: "Content Strategy Deleted",
          description: "Your content strategy has been deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Remove the content strategy from the store
        dispatch(removeContentStrategy(activeContentStrategy?.id));

        // Remove the active content strategy locally
        const updatedContentStrategies = contentStrategies.filter(
          (contentStrategy) => contentStrategy.id !== activeContentStrategy?.id,
        );

        if (updatedContentStrategies.length > 0) {
          // Set the active content strategy to the first one
          dispatch(setActiveContentStrategy(updatedContentStrategies[0]));
        } else {
          // Set the default to null
          dispatch(setActiveContentStrategy(null));
        }
      } else if (isDeleteContentStrategyError) {
        toast({
          title: "Error",
          description:
            typeCheckError(deleteContentStrategyError) || "Unable to delete content strategy",
          duration: 5000,
          status: "error",
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDeletedContentStrategy,
    isDeleteContentStrategyError,
    deleteContentStrategyError,
    isDeletingContentStrategy,
  ]);

  return (
    <Box mt={20}>
      <ContentStrategy isOpen={isContentStrategyOpen} onClose={onCloseContentStrategy} />
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onClose={onCloseConfirmDelete}
        handleConfirm={() => {
          if (activeContentStrategy?.id) {
            deleteContentStrategy({ id: activeContentStrategy.id });
          }
        }}
        isLoading={isDeletingContentStrategy}
        title={`Delete Content Strategy "${activeContentStrategy?.name}"?`}
      />
      <HStack justifyContent="space-between" mb={10} alignItems="flex-start">
        <Heading fontSize="2xl">
          {`🤖 Welcome to the Automation page, ${user?.firstName || ""}`}
        </Heading>

        <HStack spacing={6}>
          {teams && <FloatingButton teams={teams} />}
          {activeContentStrategy && <FloatingButtonContentStrategy />}
        </HStack>
      </HStack>

      <HStack alignItems="flex-end" border="solid 2px black" borderRadius="md" p={5}>
        <Stack flex={1} my={4}>
          <HStack>
            <Text>Current Team:</Text>
            <Text fontWeight="bold">{activeTeam?.name || ""}</Text>
            <Box h={6} w={6} position="relative" borderRadius={4} overflow="hidden">
              {activeTeam?.logo && (
                <Image src={activeTeam?.logo || ""} layout="fill" alt="Team Logo" />
              )}
            </Box>
          </HStack>
          {activeContentStrategy && (
            <HStack>
              <Text>Current Content Strategy:</Text>
              <Text fontWeight="bold">{activeContentStrategy?.name}</Text>
            </HStack>
          )}
          <HStack>
            <Text>Team Has Drive Setup:</Text>
            {activeTeam?.driveFolderId ? (
              <BsCheckCircleFill color="green" />
            ) : (
              <IoIosCloseCircle color="red" />
            )}
          </HStack>
          <HStack>
            <Text>UID:</Text>
            <Text fontWeight="bold">{activeTeam?.uid || ""}</Text>
          </HStack>
          <HStack>
            <Text># of Content Strategies:</Text>
            <Text fontWeight="bold">{contentStrategies?.length || 0}</Text>
          </HStack>
        </Stack>

        <Stack h="full" justifyContent="flex-end">
          {activeContentStrategy && (
            <ChakraButton variant="outline" colorScheme="red" onClick={onOpenConfirmDelete}>
              Delete Content Strategy
            </ChakraButton>
          )}
        </Stack>
      </HStack>

      <Divider my={8} />

      <Text fontSize="lg" fontWeight="semibold" mb={4} textDecor="underline">
        Automated
      </Text>

      <Button onClick={onOpenContentStrategy}>Create Content Strategy 🧙</Button>

      <Divider my={8} />

      <Text fontSize="lg" fontWeight="semibold" mb={4} textDecor="underline">
        Manual
      </Text>

      <Stack spacing={12} pb={32} pt={6}>
        {STEPS.map(({ title, steps }, key) => (
          <Stack key={key} spacing={8}>
            <Text fontSize="lg" fontWeight="semibold">
              {title}
            </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {steps.map((step, key) => (
                <GridItem key={key} w="100%">
                  <AutomationCard
                    title={step.title}
                    description={step.description}
                    onClick={() => {
                      setActiveStep(step.key as KEY);
                      onOpen();
                    }}
                    comingSoon={step.comingSoon}
                    image={step.image}
                    isDisabled={step.isDisabled}
                    badgeLabel={step.isNew ? "New" : step.isDeprecated ? "Deprecated" : undefined}
                    badgeColor={step.isNew ? "green" : step.isDeprecated ? "yellow" : undefined}
                  />
                </GridItem>
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>

      {/* STEPS */}

      {/* Step 1.1 */}
      <SeedKeywords isOpen={isOpen && activeStep === KEY.SEMRUSH_STEP_1} onClose={onClose} />

      {/* Step 1.2 */}
      <BroadSeedKeywords
        isOpen={isOpen && activeStep === KEY.SEMRUSH_BROAD_SEED_KEYWORDS}
        onClose={onClose}
      />

      {/* Step 1.3 */}
      <GenerateKIInput isOpen={isOpen && activeStep === KEY.COMBINED_STEPS} onClose={onClose} />

      {/* Step 2 */}
      <PeopleAlsoAsked isOpen={isOpen && activeStep === KEY.PEOPLE_ALSO_ASKED} onClose={onClose} />

      {/* Step 3.1 */}
      <KeywordInsightsUpload
        isOpen={isOpen && activeStep === KEY.KEYWORD_INSIGHTS_UPLOAD}
        onClose={onClose}
      />

      {/* Step 3.2 */}
      <KeywordInsightsResults
        isOpen={isOpen && activeStep === KEY.KEYWORD_INSIGHTS_RESULTS}
        onClose={onClose}
      />

      {/* Step 3.3 */}
      <TeamBlogs isOpen={isOpen && activeStep === KEY.TEAM_BLOGS} onClose={onClose} />

      {/* Other */}
      <SearchConsoleConnect
        isOpen={isOpen && activeStep === KEY.SEARCH_CONSOLE_CONNECT}
        onClose={onClose}
      />
      <SearchConsoleReport
        isOpen={isOpen && activeStep === KEY.SEARCH_CONSOLE_REPORT}
        onClose={onClose}
      />
      <WordSeek isOpen={isOpen && activeStep === KEY.COMPARE_CONSOLE_REPORT} onClose={onClose} />
      <PopulateSCReports
        isOpen={isOpen && activeStep === KEY.POPULATE_SC_REPORTS}
        onClose={onClose}
      />
    </Box>
  );
};
