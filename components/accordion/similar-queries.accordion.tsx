import {
  Accordion as ChakraAccordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  HStack,
  Stack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useFindSimilarKeywordsMutation, useRetrieveSimilarKeywordsQuery } from "api/engine.api";
import { ProgressStatus, SuggestionType } from "api/types";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { FC, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { typeCheckError } from "utils";

interface Props {
  title?: string;
  subtitle?: string;
  suggestionType?: SuggestionType;
  suggestionPk?: number;
}

export const SimilarQueriesAccordion: FC<Props> = ({
  title,
  suggestionType,
  suggestionPk,
  subtitle = "Similar queries on page",
}) => {
  const [similarKeywordsId, setSimilarKeywordsId] = useState<number | null>(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [similarKeywordData, setSimilarKeywordData] = useState<string[]>([]);

  const { onCopy, hasCopied, setValue } = useClipboard("");

  const toast = useToast();

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
    if (hasCopied) {
      toast({
        title: "Copied to clipboard",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    }
  }, [hasCopied, toast]);

  useEffect(() => {
    /**
     * A polling function that checks if the similar keywords are ready
     */
    let count = 0; // Max 30 times to request polling
    const maxCount = 30;

    const interval = setInterval(() => {
      if (isInProgress) {
        if (count < maxCount) {
          refetchSimilarKeywordsId();
          count++;
        } else {
          toast({
            title: "This is taking a while...",
            description:
              "Finding queries on this page is taking longer than usual. Please check back a bit later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsInProgress(false);
          clearInterval(interval);
        }
      }
    }, 2000); // 4 seconds

    return () => clearInterval(interval);
  }, [isInProgress, refetchSimilarKeywordsId, toast]);

  useEffect(() => {
    /**
     * If the similar keywords are ready, set the data
     */
    if (similarKeywordsAPIData?.similarKeywords) {
      setSimilarKeywordData(similarKeywordsAPIData.similarKeywords);
      if (similarKeywordsAPIData.status !== ProgressStatus.IN_PROGRESS) {
        setIsInProgress(false);
      }
    }
  }, [similarKeywordsAPIData]);

  const findSimilarKeywords = async () => {
    if (similarKeywordData.length > 0) return;

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

        if (status === ProgressStatus.IN_PROGRESS) {
          setIsInProgress(true);
        } else {
          setIsInProgress(false);
          if (!data) return;
          setSimilarKeywordData(data.similarKeywords);
        }
      } else if ("error" in response) {
        let error = response.error;
        toast({
          title: "Error",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Stack flexDir="column">
      {title && (
        <Text fontSize="xs" fontWeight="semibold">
          {title}
        </Text>
      )}
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
              <HStack flexWrap="wrap">
                <div />
                {similarKeywordData.map((item, index) => (
                  <Flex
                    key={index}
                    py={1}
                    cursor="pointer"
                    onClick={() => {
                      setValue(item);
                      onCopy();
                    }}
                  >
                    <Tag text={item} fontSize="xs" size="sm" showTooltip fontWeight="medium" />
                  </Flex>
                ))}
              </HStack>
            ) : (
              <Body pl={6} opacity={0.5}>
                No similar queries found on the page.
              </Body>
            )}
          </AccordionPanel>
        </AccordionItem>
      </ChakraAccordion>
    </Stack>
  );
};
