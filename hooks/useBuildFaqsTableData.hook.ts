import { useGenerateFaqsQuery } from "api/engine.api";
import { RowDataItem, RowItemTypes } from "components/table";
import { RowItem } from "components/table/table";
import { HeaderItem } from "components/table/table.header";
import { useMemo } from "react";
import { useActiveTeam } from "./useActiveTeam.hook";

interface ReturnProps {
    rowItems: RowItem[];
    rowHeaders: HeaderItem[];
    isLoading: boolean;
    isError: boolean;
}

interface Props {
    resultId: number;
}

export const useBuildFaqsTableData = (args: Props): ReturnProps => {
    const { resultId } = args;

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

    const faqTableHeaders = useMemo(() => {
        const headers: HeaderItem[] = [
            {
                text: "Missing Queries",
                flex: 3,
            },
            {
                text: "Impressions",
            },
            {
                text: "Clicks",
            },
            {
                text: "Average search position",
                flex: 2,
            },
        ];

        return headers;
    }, []);

    const faqTableData = useMemo(
        () =>
            faqData?.data?.map(({ question, impressions, clicks, position }) => {
                const rowData: RowDataItem[] = [
                    {
                        value: question,
                        type: RowItemTypes.text,
                        flex: 3,
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
                        tagColor: "#CAE7DB"
                    },
                ];

                return {
                    rowData,
                };
            }),
        [faqData?.data],
    );

    return {
        rowItems: faqTableData || [],
        rowHeaders: faqTableHeaders,
        isLoading: isLoading,
        isError,
    };
};
