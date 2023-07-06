import { Box, Divider, Stack } from "@chakra-ui/react";
import { useGenerateFaqsQuery } from "api/engine.api";
import { SuggestionType } from "api/types";
import { ClusterAccordion, SimilarQueriesAccordion } from "components/accordion";
import { RowDataItem, RowItemTypes } from "components/table";
import { RowItem } from "components/table/table";
import { HeaderItem } from "components/table/table.header";
import { Tag } from "components/tag";
import { useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { createClusters } from "utils";
import { ClusterItem } from "utils/createCluster";
import { useActiveTeam } from "./useActiveTeam.hook";

interface ReturnProps {
  rowItems: RowItem[];
  rowHeaders: HeaderItem[];
  isLoading: boolean;
  isError: boolean;
}

interface Props {
  resultId: number;
  maxPosition?: number | null;
  minPosition?: number | null;
}

enum SortKey {
  question = "question",
  impressions = "impressions",
  clicks = "clicks",
  position = "position",
}

enum SortDirection {
  asc = "asc",
  desc = "desc",
}

const renderClusterValues = (
  clusterItems: ClusterItem[],
  prefix?: string,
  key?: keyof ClusterItem,
  color?: string,
) =>
  key ? (
    <Stack h="full" alignItems="flex-start" mt={8} spacing={1}>
      {clusterItems.map((item, index) => (
        <Box key={index}>
          <Tag key={index} bgColor={color} size="sm" text={`${prefix}${item[key]}`} />
        </Box>
      ))}
    </Stack>
  ) : null;

export const useBuildFaqsTableData = (args: Props): ReturnProps => {
  const { resultId, minPosition, maxPosition } = args;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const [clustersExpanded, setClustersExpanded] = useState<number[]>([]);

  const activeTeam = useActiveTeam();
  const {
    data: faqData,
    isLoading,
    isError,
  } = useGenerateFaqsQuery(
    {
      teamId: activeTeam.id,
      resultId: resultId,
    },
    {
      skip: !activeTeam.id || !resultId,
    },
  );

  const getTagColour = (position: number) => {
    if (position > 0 && position <= 5) {
      return "brand.position1";
    }

    if (position > 5 && position <= 20) {
      return "brand.position2";
    }

    return "brand.position3";
  };

  const faqTableHeaders = useMemo(() => {
    const handleHeaderClick = (sortKeyArg: SortKey) => {
      if (sortKey === sortKeyArg) {
        if (sortDirection === SortDirection.asc) {
          setSortDirection(SortDirection.desc);
        } else {
          setSortDirection(SortDirection.asc);
        }
      } else {
        setSortKey(sortKeyArg);
        setSortDirection(SortDirection.asc);
      }
    };

    const renderChevron = (sortKeyArg0: SortKey) => {
      if (sortKey === sortKeyArg0) {
        if (sortDirection === SortDirection.asc) {
          return FiChevronDown;
        } else {
          return FiChevronUp;
        }
      } else {
        return null;
      }
    };

    const headers: HeaderItem[] = [
      {
        text: "Missing Queries",
        flex: 4,
        onClick: () => handleHeaderClick(SortKey.question),
        icon: renderChevron(SortKey.question),
      },
      {
        text: "Impressions",
        onClick: () => handleHeaderClick(SortKey.impressions),
        icon: renderChevron(SortKey.impressions),
      },
      {
        text: "Clicks",
        onClick: () => handleHeaderClick(SortKey.clicks),
        icon: renderChevron(SortKey.clicks),
      },
      {
        text: "Average search position",
        flex: 2,
        onClick: () => handleHeaderClick(SortKey.position),
        icon: renderChevron(SortKey.position),
      },
    ];

    return headers;
  }, [sortKey, sortDirection]);

  const faqTableData = () => {
    if (!faqData?.data) {
      return [];
    }

    let dataToBuildFrom = faqData.data.faqs;
    const dataClusters = faqData.data.clusters.faqs;

    // Handle pre-filtering
    if (minPosition && maxPosition) {
      dataToBuildFrom = dataToBuildFrom?.filter(
        (item) => item.position >= minPosition && item.position <= maxPosition,
      );
    } else if (minPosition) {
      dataToBuildFrom = dataToBuildFrom?.filter((item) => item.position >= minPosition);
    } else if (maxPosition) {
      dataToBuildFrom = dataToBuildFrom?.filter((item) => item.position <= maxPosition);
    }

    // Handle sorting
    if (sortKey && sortDirection) {
      dataToBuildFrom = [...dataToBuildFrom].sort((a, b) => {
        if (sortDirection === SortDirection.asc) {
          if (a[sortKey] < b[sortKey]) {
            return -1;
          }
          if (a[sortKey] > b[sortKey]) {
            return 1;
          }
          return 0;
        } else {
          if (a[sortKey] > b[sortKey]) {
            return -1;
          }
          if (a[sortKey] < b[sortKey]) {
            return 1;
          }
          return 0;
        }
      });
    }

    const clusters = createClusters(dataToBuildFrom, dataClusters);

    return clusters?.map(
      (
        {
          suggestionId,
          clusterName,
          clusterItems,
          clusterTotals: { impressions, clicks, position },
        },
        index,
      ) => {
        const rowData: RowDataItem[] = [
          {
            value: () => (
              <Stack>
                <ClusterAccordion
                  title={clusterName}
                  clusterItems={clusterItems.map((i) => i.name)}
                  isOpen={clustersExpanded.includes(index)}
                  onToggle={() => {
                    setClustersExpanded((prev) => {
                      if (prev.includes(index)) {
                        return prev.filter((i) => i !== index);
                      } else {
                        return [...prev, index];
                      }
                    });
                  }}
                />

                {suggestionId ? (
                  <Stack>
                    {clustersExpanded.includes(index) ? <Divider color="#EEF1F6" /> : null}
                    <SimilarQueriesAccordion
                      suggestionType={SuggestionType.FAQS}
                      suggestionPk={suggestionId}
                    />
                  </Stack>
                ) : null}
              </Stack>
            ),
            type: RowItemTypes.component,
            flex: 4,
            tooltip: false,
          },
          {
            value: () => (
              <Box>
                {clustersExpanded.includes(index) ? (
                  renderClusterValues(clusterItems, "👀 ", "impressions")
                ) : (
                  <Tag size="sm" text={`👀 ${impressions}`} />
                )}
              </Box>
            ),
            type: RowItemTypes.component,
          },
          {
            value: () => (
              <Box>
                {clustersExpanded.includes(index) ? (
                  renderClusterValues(clusterItems, "⭐ ", "clicks")
                ) : (
                  <Tag size="sm" text={`⭐ ${clicks}`} />
                )}
              </Box>
            ),
            type: RowItemTypes.component,
          },
          {
            value: () => (
              <Box>
                {clustersExpanded.includes(index)
                  ? renderClusterValues(
                      clusterItems,
                      "",
                      "position",
                      getTagColour(position as number),
                    )
                  : null}
              </Box>
            ),
            type: RowItemTypes.component,
            flex: 2,
          },
        ];

        return {
          rowData,
        };
      },
    );
  };
  // faqData?.data, minPosition, maxPosition, sortKey, sortDirection

  return {
    rowItems: faqTableData() || [],
    rowHeaders: faqTableHeaders,
    isLoading: isLoading,
    isError,
  };
};
