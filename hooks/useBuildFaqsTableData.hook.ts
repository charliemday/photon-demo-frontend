import { useClipboard, useToast } from "@chakra-ui/react";
import { useGenerateFaqsQuery } from "api/engine.api";
import { RowDataItem, RowItemTypes } from "components/table";
import { RowItem } from "components/table/table";
import { HeaderItem } from "components/table/table.header";
import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
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

export const useBuildFaqsTableData = (args: Props): ReturnProps => {
    const { resultId, minPosition, maxPosition } = args;

    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

    const activeTeam = useActiveTeam();
    const toast = useToast();
    const { onCopy, value, setValue, hasCopied } = useClipboard("");
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

    useEffect(() => {
        if (hasCopied) {
            toast({
                title: "Copied!",
                description: `Copied "${value}" to clipboard`,
                duration: 2000,
                isClosable: true,
            });
        }
    }, [hasCopied, toast, value]);

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
                flex: 3,
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

    const faqTableData = useMemo(() => {
        if (!faqData?.data) {
            return [];
        }

        let dataToBuildFrom = faqData.data;

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

        return dataToBuildFrom?.map(({ question, impressions, clicks, position }) => {
            const rowData: RowDataItem[] = [
                {
                    value: question,
                    type: RowItemTypes.text,
                    flex: 3,
                    onClick: () => {
                        setValue(question);
                        onCopy();
                    },
                    tooltip: false,
                },
                {
                    value: `👀 ${impressions}`,
                    type: RowItemTypes.tag,
                },
                {
                    value: `⭐ ${clicks}`,
                    type: RowItemTypes.tag,
                },
                {
                    value: `${position}`,
                    type: RowItemTypes.tag,
                    flex: 2,
                    tagColor: "#CAE7DB",
                },
            ];

            return {
                rowData,
            };
        });
    }, [faqData?.data, minPosition, maxPosition, sortKey, sortDirection, onCopy, setValue]);

    return {
        rowItems: faqTableData || [],
        rowHeaders: faqTableHeaders,
        isLoading: isLoading,
        isError,
    };
};
