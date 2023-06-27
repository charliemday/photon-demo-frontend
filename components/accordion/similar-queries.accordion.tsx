import {
  Accordion as ChakraAccordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Grid,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFindSimilarKeywordsMutation, useRetrieveSimilarKeywordsQuery } from "api/engine.api";
import { SimilarKeywordsStatus, SuggestionType } from "api/types";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { FC, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

interface Props {
  title: string;
  subtitle?: string;
  suggestionType?: SuggestionType;
  suggestionPk?: number;
}

export const SimilarQueriesAccordion: FC<Props> = ({
  title,
  suggestionType,
  suggestionPk,
  subtitle = "Similar Queries on page",
}) => {
  const [similarKeywordsId, setSimilarKeywordsId] = useState<number | null>(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [similarKeywordData, setSimilarKeywordData] = useState<string[]>([]);

  const [findSimilarKeywordsReq, { isLoading }] = useFindSimilarKeywordsMutation();
  const { data: similarKeywordsAPIData, refetch: refetchSimilarKeywordsId } =
    useRetrieveSimilarKeywordsQuery(
      {
        similarKeywordsId: similarKeywordsId || 0,
      },
      {
        skip: similarKeywordsId === null,
      },
    );

  useEffect(() => {
    /**
     * A polling function that checks if the similar keywords are ready
     */

    let count = 0; // Max 30 times to request polling

    const interval = setInterval(() => {
      if (isInProgress && count < 30) {
        refetchSimilarKeywordsId();
        count++;
      }
    }, 2000); // 4 seconds

    return () => clearInterval(interval);
  }, [isInProgress, refetchSimilarKeywordsId]);

  useEffect(() => {
    /**
     * If the similar keywords are leady, set the data
     */
    if (similarKeywordsAPIData?.similarKeywords) {
      setSimilarKeywordData(similarKeywordsAPIData.similarKeywords);
      if (similarKeywordsAPIData.status !== SimilarKeywordsStatus.IN_PROGRESS) {
        setIsInProgress(false);
      }
    }
  }, [similarKeywordsAPIData]);

  const findSimilarKeywords = async () => {
    setSimilarKeywordData([]);

    if (suggestionType && suggestionPk) {
      const response = await findSimilarKeywordsReq({
        suggestionType,
        suggestionPk,
      });

      if ("data" in response) {
        const status = response.data.status;
        const data = response.data.data;

        if (data.id) {
          setSimilarKeywordsId(data.id);
        }

        if (status === SimilarKeywordsStatus.IN_PROGRESS) {
          setIsInProgress(true);
        } else {
          setIsInProgress(false);
          if (!data) return;
          setSimilarKeywordData(data.similarKeywords);
        }
      }
    }
  };

  return (
    <Stack flexDir="column">
      <Text fontSize="xs">{title}</Text>
      <ChakraAccordion
        allowMultiple
        w="full"
        h="full"
        onChange={(e) => {
          if (Array.isArray(e) && e.length) {
            findSimilarKeywords();
          }
        }}
      >
        <AccordionItem border="none" outline="none" p={0}>
          <AccordionButton
            p={0}
            _hover={{
              background: "none",
            }}
          >
            <Stack justify="center" align="flex-start">
              <Stack justify="flex-start" align="flex-start" spacing="2px" alignSelf="stretch">
                <Stack direction="row" justify="flex-start" align="center" spacing="4px">
                  <AccordionIcon />
                  <Text
                    fontFamily="Inter"
                    lineHeight="1.33"
                    fontWeight="semibold"
                    fontSize="12px"
                    color="#6062F6"
                  >
                    {subtitle}
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </AccordionButton>
          <AccordionPanel px={0}>
            {isLoading || isInProgress ? (
              <HStack>
                <Body opacity={0.5} pl={5}>
                  Finding similar keywords on the page...
                </Body>
                <MoonLoader size={12} />
              </HStack>
            ) : similarKeywordData?.length > 0 ? (
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {similarKeywordData.map((item, index) => (
                  <Tag
                    key={index}
                    text={item}
                    fontSize="xs"
                    size="sm"
                    showTooltip
                    fontWeight="medium"
                  />
                ))}
              </Grid>
            ) : (
              <Body pl={5} opacity={0.5}>
                No similar queries found
              </Body>
            )}
          </AccordionPanel>
        </AccordionItem>
      </ChakraAccordion>
    </Stack>
  );
};
