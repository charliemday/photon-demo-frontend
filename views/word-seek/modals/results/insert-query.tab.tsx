import { HStack, Stack, useToast } from "@chakra-ui/react";
import { useRetrieveInsertQueryQuery } from "api/engine.api";
import { ProgressStatus } from "api/types";
import { InsertQuery } from "api/types/engine.types";
import { Button } from "components/button";
import { InsertTextSwipe } from "components/insert-text";
import { Body } from "components/text";
import { BRAND_COLOR } from "config";
import { FC, useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PropagateLoader } from "react-spinners";

interface Props {
  insertQueryId: number | null;
  onBack: () => void;
  isLoading?: boolean;
  url: string;
}

export const InsertionQueryTab: FC<Props> = ({ insertQueryId, onBack, isLoading, url }) => {
  const toast = useToast();

  const [isInProgress, setIsInProgress] = useState(true);
  const [insertQueryData, setInsertQueryData] = useState<InsertQuery | null>(null);

  const { data: insertQueryDataAPI, refetch: refetchInsertQuery } = useRetrieveInsertQueryQuery(
    {
      insertQueryId: insertQueryId || 0,
    },
    {
      skip: insertQueryId === null,
    },
  );

  useEffect(() => {
    /**
     * A polling function that checks if the similar keywords are ready
     */
    let count = 0; // Max 30 times to request polling
    const maxCount = 30;

    const interval = setInterval(() => {
      if (isInProgress) {
        if (count < maxCount) {
          refetchInsertQuery();
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
  }, [isInProgress, refetchInsertQuery, toast]);

  useEffect(() => {
    /**
     * If the similar keywords are ready, set the data
     */
    if (insertQueryDataAPI) {
      setInsertQueryData(insertQueryDataAPI);
      if (insertQueryDataAPI.status !== ProgressStatus.IN_PROGRESS) {
        setIsInProgress(false);
      }
    }
  }, [insertQueryDataAPI]);

  const renderLoading = () => (
    <Stack alignItems="center" py={24} spacing={6}>
      <Body fontSize="sm">
        👀 Finding places to insert your query, this will only take a minute...
      </Body>
      <PropagateLoader color={BRAND_COLOR} />
    </Stack>
  );

  const sentences = insertQueryData?.sentences || [];
  const original_sentences = insertQueryData?.originalSentences || [];
  const query = insertQueryData?.query || "";
  const showSkeleton = isInProgress || isLoading;

  return (
    <Stack spacing={12} pt={12}>
      <>
        {showSkeleton ? (
          renderLoading()
        ) : query.length === 0 || sentences.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" my={12}>
            <Body fontSize="sm">{`🤔 Hmmm...we couldn't find a place to insert your query. Try another page or another query.`}</Body>
          </Stack>
        ) : (
          <Stack spacing={6}>
            <Body fontSize="sm">
              {`Our engine has analysed your page and found a couple of places you can insert the query "${query}". Click
                to copy and paste so you can add it to your CMS but make sure to check the context!`}
            </Body>
            <InsertTextSwipe
              sentences={sentences}
              query={query}
              originalSentences={original_sentences}
              url={url}
            />
          </Stack>
        )}
      </>
      <HStack justifyContent="flex-start">
        <Button onClick={onBack}>
          <BsArrowLeft
            style={{
              marginRight: "0.5rem",
            }}
          />{" "}
          Back
        </Button>
      </HStack>
    </Stack>
  );
};
