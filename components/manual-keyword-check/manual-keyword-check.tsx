import { Box, Divider, HStack, Tooltip, useToast } from "@chakra-ui/react";
import { useUpdateMisspelledKeywordsMutation, useWordSeekResultsQuery } from "api/engine.api";
import { MisspelledKeywordAction } from "api/types";
import { Body } from "components/text";
import { BRAND_COLOR } from "config";
import { useActiveTeam } from "hooks";
import { FC, useState } from "react";
import { MdWarning } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import { typeCheckError } from "utils";

interface Props {
  jobGroup?: number | null;
  keyword?: string;
  resultId?: number;
}

export const ManualKeywordCheck: FC<Props> = ({ jobGroup, keyword, resultId }) => {
  const activeTeam = useActiveTeam();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [updateMisspelledKeywords, { error }] = useUpdateMisspelledKeywordsMutation();

  const { refetch } = useWordSeekResultsQuery({
    teamId: activeTeam?.id,
    jobGroup,
  });

  const handleUpdateMisspelledKeywords = async (action: MisspelledKeywordAction) => {
    setIsLoading(true);

    if (!jobGroup || !keyword || !resultId) return;

    const response = await updateMisspelledKeywords({
      keyword,
      action,
      resultId,
    });

    if ("error" in response) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong",
        status: "error",
      });
      return;
    }
    {
      toast({
        title: "Success",
        description: "Successfully updated misspelled keyword",
        status: "success",
      });
    }

    refetch();

    setIsLoading(false);
  };

  if (isLoading) {
    return <MoonLoader size={12} color={BRAND_COLOR} />;
  }

  return (
    <HStack h={5} position="relative">
      <Tooltip
        hasArrow
        label="Our engine has flagged this as a potential misspelling. You can either keep or delete this keyword."
      >
        <Box cursor="pointer" bgColor="#F3DEDF" borderRadius="md" p={1}>
          <MdWarning fontSize={14} />
        </Box>
      </Tooltip>
      <Body
        color="#6D6FF6"
        _hover={{
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => handleUpdateMisspelledKeywords(MisspelledKeywordAction.KEEP)}
      >
        Keep
      </Body>
      <Divider orientation="vertical" />
      <Body
        _hover={{
          cursor: "pointer",
          textDecoration: "underline",
        }}
        color="#E87F80"
        onClick={() => handleUpdateMisspelledKeywords(MisspelledKeywordAction.DELETE)}
      >
        Delete
      </Body>
    </HStack>
  );
};
